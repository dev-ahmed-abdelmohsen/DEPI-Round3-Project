# Monitoring and Observability Guide

This document explains how to use the monitoring stack, which includes Prometheus for metrics collection and Grafana for visualization.

## Overview

The project is set up with a monitoring solution to provide insights into the backend service's performance and health.

-   **Prometheus**: Scrapes and stores time-series data from the backend's `/metrics` endpoint.
-   **Grafana**: Queries Prometheus and visualizes the data in a pre-configured dashboard.

## Local Development Access

When running the services using `docker-compose up`, the monitoring tools are available at the following URLs:

-   **Prometheus**: [http://localhost:9090](http://localhost:9090)
    -   You can use the Prometheus UI to run ad-hoc queries on the collected metrics. For example, to see all metrics for the backend, you can query `up{job="backend"}`.

-   **Grafana**: [http://localhost:3002](http://localhost:3002)
    -   **Default Login**:
        -   Username: `admin`
        -   Password: `Password123!` (as configured in `my-values.yaml`)

## Prometheus Configuration

The Prometheus configuration is located at `monitoring/prometheus.yml`.

-   **Scrape Interval**: It scrapes targets every `15 seconds`.
-   **Job Name**: A single job named `backend` is configured.
-   **Target**: It scrapes the backend service at `backend:3001`, relying on the Docker network for service discovery.

## Grafana Dashboard

A pre-configured Grafana dashboard is available to visualize the most important metrics from the backend.

### How to Import the Dashboard

1.  Log in to Grafana at [http://localhost:3002](http://localhost:3002).
2.  On the left-hand menu, navigate to **Dashboards**.
3.  On the Dashboards page, click **New** and select **Import**.
4.  Click **Upload JSON file** and select the `grafana-dashboard.json` file from the root of this project.
5.  Click **Import**. The "Node.js Backend Monitoring" dashboard should now be available.

### Key Metrics in the Dashboard

The dashboard provides several key panels:

-   **Total Requests**: The total number of HTTP requests handled by the backend.
-   **Request Rate**: The per-second rate of incoming requests, broken down by API route.
-   **95th Percentile Latency**: The response time that 95% of requests fall under, giving a good indication of the user-perceived latency.
-   **Error Rate (5xx)**: The percentage of server-side errors (status codes 500-599).
-   **Event Loop Lag**: A measure of the Node.js event loop's health. High values can indicate performance bottlenecks.
-   **CPU & Memory Usage**: The system-level resource consumption of the backend process.
