# Backend Infrastructure

This document explains the containerization and deployment setup for the backend service.

## Docker

### Dockerfile

The backend service is containerized using a multi-stage `Dockerfile` located at `backend/Dockerfile`.

-   **Builder Stage**: This stage uses a `node:18-alpine` image to install `npm` dependencies. It copies `package.json` and `package-lock.json`, runs `npm install`, and then copies the rest of the source code.
-   **Production Stage**: This stage also uses a `node:18-alpine` image for a smaller footprint. It copies the `node_modules` and application code from the builder stage, ensuring a clean and optimized production image.

The container exposes port `3001` and starts the application by running `node src/server.js`.

### Docker Compose

In the local development environment, the backend is managed by `docker-compose.yml`.

-   **Service Name**: `backend`
-   **Build Context**: Uses the `backend` directory.
-   **Ports**: Maps port `3001` of the host to port `3001` in the container.
-   **Environment Variables**:
    -   `N8N_UPLOADS_URL`: Configured to point to the `n8n` service within the Docker network (`http://n8n:5678/...`).
    -   `PORT`: Set to `3001`.
-   **Volumes**: Mounts the local `backend` directory into the container to allow for hot-reloading during development.
-   **Command**: Overrides the Dockerfile's `CMD` to run `npm run dev`, which uses `nodemon` for automatic restarts.
-   **Network**: Connects to the `my-app-network` bridge network, allowing it to communicate with other services like `frontend` and `n8n`.

## Kubernetes

### Deployment

The Kubernetes deployment is defined in `k8s/backend-deployment.yaml`.

-   **Name**: `backend-deployment`
-   **Replicas**: Configured to run `2` replicas for high availability.
-   **Selector**: Manages pods with the label `app: backend`.
-   **Container Image**: Uses the pre-built image `georgemedhat/socialdev-backend:latest`. For production, this should point to a stable image tag in a container registry.
-   **Container Port**: Exposes port `3001`.
-   **Environment Variables**: Similar to Docker Compose, it sets `N8N_UPLOADS_URL` to point to the `n8n-service` within the Kubernetes cluster.

### Service

The service that exposes the backend deployment is defined in `k8s/backend-service.yaml`.

-   **Name**: `backend-service`
-   **Type**: `ClusterIP`. This makes the service reachable only from within the Kubernetes cluster. Other services (like the frontend) can access it using its name, `backend-service`.
-   **Selector**: Routes traffic to pods with the label `app: backend`.
-   **Ports**: Exposes the deployment's port `3001`. The port is named `http-metrics` which allows Prometheus to discover it for scraping metrics.
