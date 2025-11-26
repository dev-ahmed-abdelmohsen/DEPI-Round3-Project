require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors(
  { origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
   }
));
app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[Request Logger] Received: ${req.method} ${req.url}`);
  next();
});

// Prometheus Metrics
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = client.register;

// Collect default metrics like CPU, memory, etc.
collectDefaultMetrics({ register });

// Define custom metrics
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // buckets for response time
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    const route = req.route ? req.route.path : req.path;
    httpRequestCounter.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode,
    });
    end({
      method: req.method,
      route: route,
      status_code: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

const N8N_UPLOADS_URL = process.env.N8N_UPLOADS_URL;

if (!N8N_UPLOADS_URL) {
  console.error("Error: N8N_UPLOADS_URL is not defined in .env file.");
  process.exit(1);
}

/**
 * Extracts a YouTube Channel ID from a given URL by scraping the page.
 * @param {string} channelUrl The full URL of the YouTube channel.
 * @returns {Promise<string|null>} The extracted channel ID or null if not found.
 */
async function extractChannelIdFromUrl(channelUrl) {
  try {
    console.log(`[Extractor] Scraping URL: ${channelUrl}`);
    const { data: html } = await axios.get(channelUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const match = html.match(/"browseId":"(UC[\w-]{22,})"/);
    if (match && match[1]) {
      console.log(`[Extractor] Found channel ID: ${match[1]}`);
      return match[1];
    }
    console.warn("[Extractor] Could not find browseId in page source.");
    return null;
  } catch (error) {
    console.error(
      `[Extractor] Error scraping URL ${channelUrl}:`,
      error.message
    );
    return null;
  }
}

app.post("/api/uploads", async (req, res) => {
  console.log("[Backend] /api/uploads endpoint hit");
  // The identifier can be a URL or a direct channel ID
  const { channelId: channelIdentifier } = req.body;
  if (!channelIdentifier) {
    return res
      .status(400)
      .json({ error: "channelId (URL or ID) is required" });
  }

  let finalChannelId = channelIdentifier;

  // If the identifier is a URL, extract the ID. Otherwise, assume it's already an ID.
  if (channelIdentifier.startsWith("http")) {
    console.log(
      `[Backend] Received a URL, attempting to extract channel ID.`
    );
    finalChannelId = await extractChannelIdFromUrl(channelIdentifier);
    if (!finalChannelId) {
      return res.status(400).json({
        error:
          "Invalid or unsupported YouTube channel URL. Could not extract channel ID.",
      });
    }
  } else {
    console.log(`[Backend] Received an identifier, assuming it's a channel ID.`);
  }

  try {
    console.log(`[Backend] Requesting uploads for channel ID: ${finalChannelId}`);

    const n8nResponse = await axios.post(
      N8N_UPLOADS_URL,
      { channelId: finalChannelId }, // Send the extracted/final ID to n8n
      {
        timeout: 90000, // 90 second timeout
      }
    );

    console.log("[Backend] Received data from n8n successfully.");

    if (
      n8nResponse.data === undefined ||
      n8nResponse.data === null ||
      n8nResponse.data === ""
    ) {
      console.warn("[Backend] n8n returned empty data");
      return res.status(200).json([]);
    }

    res.status(200).json(n8nResponse.data);
  } catch (error) {
    console.error("[Backend] Error while calling n8n:", error.message);
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Cannot connect to the n8n service. Please ensure it is running.",
      });
    }
    if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      return res.status(504).json({
        error: "The n8n service took too long to respond. Please try again later.",
      });
    }
    res.status(200).json([]);
  }
});

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`[Server] Running on http://${HOST}:${PORT}`);
});

module.exports = { app, server };
