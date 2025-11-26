"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define interfaces for the new structured data from the API
interface MetricResult {
  metric: { [key: string]: string };
  value?: [number, string]; // For instant queries
  values?: [number, string][]; // For range queries
}

interface StatisticsData {
  up: MetricResult[];
  requestRate: MetricResult[];
  p99Latency: MetricResult[];
  cpuUsage: MetricResult[];
  memoryUsage: MetricResult[];
  eventLoopLag: MetricResult[];
  totalRequests: MetricResult[];
  errorRate: MetricResult[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const jsonData: StatisticsData = await response.json();
        setStats(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Statistics...</h1>
        <p>Fetching data from Prometheus.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
        <p>Please ensure your Prometheus and backend services are running and configured correctly.</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No Statistics Data Available</h1>
        <p>Could not load statistics. Check console for errors.</p>
      </div>
    );
  }

  // Helper to extract latest value from a metric result
  const getLatestValue = (metricResults: MetricResult[]): string | number => {
    if (!Array.isArray(metricResults) || metricResults.length === 0) return 'N/A';
    const lastValue = metricResults[0].value?.[1];
    return lastValue !== undefined ? parseFloat(lastValue).toFixed(2) : 'N/A';
  };

  // Process data for charts (example for request rate)
  // This assumes the API returns range queries, but currently it returns instant queries.
  // For instant queries, we'll just show the latest value in a stat card.
  // If we want time series charts, the API needs to return range queries.
  // For now, I'll focus on displaying instant query results in stat cards and simple lists.

  const serviceStatus =
    Array.isArray(stats.up) && stats.up[0]?.value?.[1] === '1' ? 'Up' : 'Down';
  const totalRequests = getLatestValue(stats.totalRequests);
  const cpuUsage = getLatestValue(stats.cpuUsage);
  const memoryUsageBytes = parseFloat(getLatestValue(stats.memoryUsage) as string);
  const memoryUsageMB = isNaN(memoryUsageBytes) ? 'N/A' : (memoryUsageBytes / (1024 * 1024)).toFixed(2);
  const eventLoopLag = getLatestValue(stats.eventLoopLag);
  const errorRate = getLatestValue(stats.errorRate);

  // For request rate and latency, the API returns instant queries.
  // To make charts, we would need range queries.
  // For now, I'll display the latest values for these as well.
  const requestRateData = Array.isArray(stats.requestRate)
    ? stats.requestRate.map((item) => ({
        route: item.metric.route || 'unknown',
        method: item.metric.method || 'unknown',
        value: parseFloat(item.value?.[1] || '0'),
      }))
    : [];

  const p99LatencyData = Array.isArray(stats.p99Latency)
    ? stats.p99Latency.map((item) => ({
        route: item.metric.route || 'unknown',
        value: parseFloat(item.value?.[1] || '0'),
      }))
    : [];


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Backend Service Statistics</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <span className={`h-4 w-4 rounded-full ${serviceStatus === 'Up' ? 'bg-green-500' : 'bg-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceStatus}</div>
            <p className="text-xs text-muted-foreground">Backend service health</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests (Last 5 min)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cpuUsage}%</div>
            <p className="text-xs text-muted-foreground">Current process CPU usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryUsageMB} MB</div>
            <p className="text-xs text-muted-foreground">Resident memory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Loop Lag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventLoopLag} s</div>
            <p className="text-xs text-muted-foreground">Node.js event loop lag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate (5xx)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorRate}%</div>
            <p className="text-xs text-muted-foreground">Last 5 min average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Rate by Route (Last 5 min)</CardTitle>
            <CardDescription>Average requests per second for each route.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Req/Sec" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>P99 Latency by Route (Last 5 min)</CardTitle>
            <CardDescription>99th percentile response time in seconds.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={p99LatencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} name="Latency (s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
