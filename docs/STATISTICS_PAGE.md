# Statistics Page Setup and Troubleshooting Guide

This document summarizes the recent changes made to integrate a statistics page into the frontend, displaying data from Prometheus, and provides instructions for ensuring it works correctly in both local development and Kubernetes environments.

## Problem Addressed

The frontend's `/statistics` page initially showed "Failed to fetch statistics" because the Next.js API route (running on the host during local development) could not resolve the `prometheus` service name, which is only available within the Docker network.

## Solutions Implemented

1.  **Configurable Prometheus URL in Frontend API:**
    *   The `frontend/src/app/api/statistics/route.ts` file now uses `process.env.PROMETHEUS_URL`.
    *   It falls back to `http://prometheus:9090` if `PROMETHEUS_URL` is not set (ideal for Docker/Kubernetes environments).

2.  **Local Development Configuration (`frontend/.env.local`):**
    *   A new file `frontend/.env.local` has been created with `PROMETHEUS_URL=http://localhost:9090`. This tells your local Next.js development server how to reach Prometheus, which is exposed on your host machine via `docker-compose`.

3.  **Kubernetes LoadBalancer for Prometheus (`k8s/prometheus-lb.yaml`):**
    *   A new Kubernetes Service manifest (`k8s/prometheus-lb.yaml`) has been created. This will expose your Prometheus instance externally via a LoadBalancer, allowing administrative access if needed.

## How to Make it Work

### 1. Local Development (`docker-compose`)

To ensure the statistics page works correctly in your local development environment:

1.  **Start Docker Compose:** Make sure your `docker-compose` services (frontend, backend, prometheus, grafana) are running:
    ```bash
    docker-compose up -d
    ```
2.  **Restart Frontend Dev Server:** It is crucial to restart your Next.js development server so it picks up the new `frontend/.env.local` file:
    ```bash
    # Navigate to the frontend directory
    cd frontend
    npm run dev # or yarn dev, pnpm dev
    ```
3.  **Access the Page:** Open your browser and navigate to `http://localhost:3000/statistics`. You should now see the "Monitored Services" card displaying the status of your `backend` service (Up/Down).

### 2. Kubernetes Deployment

To ensure the statistics page and Prometheus access work in your Kubernetes cluster:

1.  **Apply Prometheus LoadBalancer Service:**
    ```bash
    kubectl apply -f k8s/prometheus-lb.yaml
    ```
    This will create a `LoadBalancer` service for Prometheus. You can get its external IP using `kubectl get svc prometheus-lb`.

2.  **Ensure Prometheus Deployment:** Verify that your Prometheus deployment exists and its pods are labeled `app: prometheus` (this is assumed based on project conventions).

3.  **Configure Frontend Deployment:** When deploying your frontend to Kubernetes, you **must** ensure that the `PROMETHEUS_URL` environment variable is set in your frontend deployment manifest. It should point to the internal Kubernetes service name for Prometheus.
    *   **Example (in your frontend deployment YAML):**
        ```yaml
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: frontend-deployment
          # ...
        spec:
          template:
            spec:
              containers:
              - name: frontend
                # ...
                env:
                - name: PROMETHEUS_URL
                  value: "http://prometheus:9090" # Assuming your Prometheus service is named 'prometheus'
                # ...
        ```
    *   Replace `prometheus` with the actual name of your Prometheus Kubernetes Service if it's different.

4.  **Access the Page:** Once your frontend is deployed with the correct environment variable, navigate to your frontend application's URL and then to `/statistics`. The page should now display the metrics.
