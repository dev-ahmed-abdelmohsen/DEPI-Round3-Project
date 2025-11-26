import { NextResponse } from 'next/server';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus:9090';
// const PROMETHEUS_URL ='http://prometheus:9090';
// const PROMETHEUS_URL = 'http://prometheus.socialdev.com';

// Helper function to fetch data from Prometheus
async function fetchPrometheusData(query: string) {
    const prometheusQueryURL = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`;
    console.log(`Fetching from Prometheus: ${prometheusQueryURL}`);
    try {
        const response = await fetch(prometheusQueryURL, { cache: 'no-store' }); // Disable cache for debugging
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Prometheus query failed! URL: ${prometheusQueryURL}, Status: ${response.status} ${response.statusText}, Body: ${errorText}`);
            throw new Error(`Prometheus query failed for "${query}": ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        if (data.status !== 'success') {
            console.error(`Prometheus query not successful! URL: ${prometheusQueryURL}, Response: ${JSON.stringify(data)}`);
            throw new Error(`Prometheus query was not successful for "${query}": ${JSON.stringify(data)}`);
        }
        console.log(`Prometheus query successful for: "${query}"`);
        return data.data.result;
    } catch (error) {
        console.error(`Network error or fetch failed for Prometheus query: "${query}". URL: ${prometheusQueryURL}`, error);
        throw error; // Re-throw the error to be caught by Promise.allSettled
    }
}

export async function GET() {
    console.log(`[Statistics API] Received request. Using PROMETHEUS_URL: ${PROMETHEUS_URL}`);
    try {
        const metrics = await Promise.allSettled([
            fetchPrometheusData('up{job="backend-service"}'), // Service status
            fetchPrometheusData('sum(rate(http_requests_total{job="backend-service"}[5m])) by (method, route)'), // Request rate per route
            fetchPrometheusData('histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="backend-service"}[5m])) by (le, route))'), // P99 latency per route
            fetchPrometheusData('sum(rate(process_cpu_seconds_total{job="backend-service"}[5m]))'), // Total CPU usage
            fetchPrometheusData('process_resident_memory_bytes{job="backend-service"}'), // Resident memory usage
            fetchPrometheusData('nodejs_eventloop_lag_seconds{job="backend-service"}'), // Node.js event loop lag
            fetchPrometheusData('sum(increase(http_requests_total{job="backend-service"}[5m]))'), // Total requests over last 5 minutes
            fetchPrometheusData('sum(rate(http_requests_total{job="backend-service", status_code=~"5.."}[5m])) / sum(rate(http_requests_total{job="backend-service"}[5m])) * 100') // Error rate (5xx)
        ]);

        const results: { [key: string]: any } = {};
        const keys = [
            'up',
            'requestRate',
            'p99Latency',
            'cpuUsage',
            'memoryUsage',
            'eventLoopLag',
            'totalRequests',
            'errorRate'
        ];

        metrics.forEach((metric, index) => {
            const key = keys[index];

            if (metric.status === 'fulfilled') {
                results[key] = metric.value;
            } else {
                console.error(`[Statistics API] Error fetching metric "${key}":`, metric.reason);
                results[key] = { error: metric.reason.message || 'Failed to fetch' };
            }
        });

        console.log('[Statistics API] Sending response:', JSON.stringify(results, null, 2));
        return NextResponse.json(results);
    } catch (error) {
        console.error('[Statistics API] Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
