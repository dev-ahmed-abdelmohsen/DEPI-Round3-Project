# CI/CD Automation Guide

This guide outlines how to automate the deployment of this application, focusing on the custom n8n image and secure handling of credentials.

## Prerequisites

- Your CI/CD environment (e.g., GitHub Actions) must have `docker` and `kubectl` installed and configured to access your container registry and Kubernetes cluster.
- You have stored your n8n YouTube credentials JSON content as a secret in your CI/CD provider (e.g., a GitHub repository secret named `N8N_CREDENTIALS_JSON`).

## Pipeline Steps

Here are the recommended steps for your CI/CD pipeline:

### 1. Build and Push Custom n8n Image

Build the custom n8n Docker image that contains your workflow and push it to your container registry.

```bash
# Login to your container registry (e.g., Docker Hub)
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# Build the custom n8n image
docker build -t georgemedhat/socialdev-n8n:latest ./n8n

# Push the image
docker push georgemedhat/socialdev-n8n:latest
```

*(Note: You will also need to build and push your `frontend` and `backend` images if you make changes to them.)*

### 2. Create/Update Kubernetes Secret for n8n Credentials

Use the secret you stored in your CI/CD provider to create a Kubernetes secret. This command will delete the old secret if it exists and create a new one. This ensures the credentials are always up-to-date.

The secret key (the filename) must match what n8n expects. In our case, it's `YouTube account.json`.

```bash
# Delete the secret if it exists, ignoring errors if it doesn't
kubectl delete secret n8n-credentials --ignore-not-found

# Create the secret from the environment variable provided by the CI/CD platform
kubectl create secret generic n8n-credentials --from-literal="YouTube account.json"="$N8N_CREDENTIALS_JSON"
```

### 3. Deploy Kubernetes Manifests

Apply all your Kubernetes configurations. `kubectl apply` is idempotent and will only make changes where necessary.

```bash
# Apply all services, deployments, etc.
kubectl apply -f k8s/

# It's good practice to force a rollout of the deployments that use new images
# to ensure the changes are picked up immediately.
kubectl rollout restart deployment/n8n-deployment
kubectl rollout restart deployment/frontend-deployment
kubectl rollout restart deployment/backend-deployment
```

This setup ensures that your n8n instance is deployed automatically with the correct workflow, and your sensitive credentials are handled securely without being exposed in your repository or Docker images.
