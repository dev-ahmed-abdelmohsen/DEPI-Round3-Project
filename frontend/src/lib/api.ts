import type { Video, ApiVideo } from "./types";
import { API_BASE_URL, API_BASE_URL_INTERNAL } from '../../Config/config';

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please check your environment variables.");
}

async function apiPost<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  // Use API_BASE_URL_INTERNAL for server-side fetches, otherwise API_BASE_URL
  const baseUrl = typeof window === 'undefined' ? API_BASE_URL_INTERNAL : API_BASE_URL;

  console.log(`[DEBUG] API Request to ${endpoint}`, {
    url: `${baseUrl}${endpoint}`,
    method: "POST",
    body: JSON.stringify(body),
  });

  try {
    const timerId = crypto.randomUUID();
    console.time(`[PERF] API call to ${endpoint} #${timerId.substring(0, 8)}`);
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    console.timeEnd(`[PERF] API call to ${endpoint} #${timerId.substring(0, 8)}`);

    console.log(`[DEBUG] API Response from ${endpoint}`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] API Error Response: ${errorText}`);
      throw new Error(
        `The server returned an error: ${response.statusText} (${response.status}). Please check the channel URL and try again.`
      );
    }

    const text = await response.text();
    console.log(`[DEBUG] API Response raw text length: ${text.length}`);
    if (text.length < 100) {
      console.log(`[DEBUG] API Response raw text content: "${text}"`);
    }

    if (!text) {
      console.warn(
        "[WARN] API returned an empty response, likely due to a timeout on the backend."
      );
      // Return empty array for empty responses
      return [] as unknown as T;
    }

    try {
      const parsed = JSON.parse(text) as T;
      console.log(`[DEBUG] API Response parsed:`, {
        type: typeof parsed,
        isArray: Array.isArray(parsed),
        length: Array.isArray(parsed) ? parsed.length : 0,
      });
      return parsed;
    } catch (parseError) {
      console.error("[ERROR] Failed to parse JSON response:", parseError);
      console.error("[ERROR] Raw response:", text);
      // Return empty array for invalid JSON
      return [] as unknown as T;
    }
  } catch (error) {
    console.error(`Fetch error for endpoint ${endpoint}:`, error);
    if (error instanceof Error && error.message.includes("fetch failed")) {
      throw new Error(
        "Could not connect to the server. Please ensure it is running and accessible."
      );
    }
    throw error;
  }
}

export const fetchUploads = async (channelId: string): Promise<Video[]> => {
  console.log(
    `[DEBUG] fetchUploads - Starting request for channel: ${channelId}`
  );

  try {
    const timerId = crypto.randomUUID();
    console.time(`[PERF] fetchUploads for ${channelId} #${timerId.substring(0, 8)}`);
    const data = await apiPost<ApiVideo[]>("/api/uploads", { channelId });
    console.timeEnd(`[PERF] fetchUploads for ${channelId} #${timerId.substring(0, 8)}`);

    console.log(`[DEBUG] fetchUploads - Response received for ${channelId}:`, {
      dataType: typeof data,
      isArray: Array.isArray(data),
      dataLength: Array.isArray(data) ? data.length : 0,
      dataPreview: Array.isArray(data) && data.length > 0 ? data[0] : data,
    });

    if (!Array.isArray(data)) {
      console.error(
        "[ERROR] API did not return an array as expected. Data received:",
        JSON.stringify(data)
      );
      // Return empty array for consistent data structure
      return [];
    }

    const mappedData = data.map((v) => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      publishedAt: v.publishedAt,
    }));

    console.log(
      `[DEBUG] fetchUploads - Mapped ${mappedData.length} videos for ${channelId}`
    );

    return mappedData;
  } catch (error) {
    console.error(
      `[ERROR] fetchUploads - Error fetching data for ${channelId}:`,
      error
    );
    // Rethrow to let component handle the error
    throw error;
  }
};
