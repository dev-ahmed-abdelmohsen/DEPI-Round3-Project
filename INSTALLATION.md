# SocialDev Installation Guide

This guide provides step-by-step instructions to set up the SocialDev project on a local machine using Docker Desktop and Kubernetes.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Docker Desktop**: With the Kubernetes engine enabled.
- **Helm**: The package manager for Kubernetes.
- **PowerShell** (for Windows) or a compatible shell (for macOS/Linux).

## 1. Clone the Repository

First, clone the project repository to your local machine.

```sh
git clone <repository-url>
cd SocialDev
```

## 2. Install NGINX Ingress Controller

The Ingress controller routes external traffic to the correct services in the cluster. Install it using Helm:

```powershell
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

## 3. Install Monitoring Stack

Install Prometheus and Grafana for monitoring using the provided Helm chart values.

```powershell
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install prometheus-stack prometheus-community/kube-prometheus-stack -f monitoring/my-values.yaml
```

### Grafana Credentials
- **Username**: `admin`
- **Password**: The default password is `Password123!` as set in `monitoring/my-values.yaml`.

If you need to retrieve a generated password, use:
```powershell
kubectl get secret prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

## 4. Generate Kubernetes Manifests

The project uses a templating system to generate environment-specific Kubernetes manifests for the Ingress and Frontend Deployment.

Set the `$DOMAIN` variable and run the generation commands. For local development, use `localhost`.

```powershell
# Set domain for local development
$DOMAIN="localhost"

# Generate manifests from templates
(Get-Content k8s/ingress.template.yaml) -replace '\$\{DOMAIN\}', $DOMAIN | Out-File k8s/ingress.yaml
(Get-Content k8s/frontend-deployment.template.yaml) -replace '\$\{DOMAIN\}', $DOMAIN | Out-File k8s/frontend-deployment.yaml
```
**Note**: For a cloud deployment, change `$DOMAIN` to your actual domain name (e.g., `socialdev.com`).

## 5. Deploy Application Services

Apply all the Kubernetes manifests to deploy the application services.

```powershell
kubectl apply -f k8s/
```

## 6. Populate n8n Data

To ensure n8n starts with pre-configured workflows and credentials, populate its persistent volume using a helper pod.

First, ensure the `n8n-data` directory exists in your project root. If it was compressed, you may need to extract it from `n8n-data.tar.gz`.

Then, run the following commands to copy the data:

```powershell
# 1. Create the helper pod
kubectl apply -f helper-pod.yaml

# 2. Wait for the pod to be ready
kubectl wait --for=condition=ready pod/n8n-data-helper --timeout=120s

# 3. Copy the local n8n data to the volume
kubectl cp ./n8n-data/. n8n-data-helper:/data

# 4. Delete the helper pod
kubectl delete pod n8n-data-helper

# 5. Restart the n8n deployment to mount the populated volume
kubectl rollout restart deployment/n8n-deployment
```

For more details, see the [n8n Data Population Guide](./docs/n8n-data-population.md).

## 7. Configure Local DNS

To access the services using their domain names, you need to edit your local `hosts` file.

- **Windows**: `C:\Windows\System32\drivers\etc\hosts`
- **macOS/Linux**: `/etc/hosts`

Add the following entries, pointing the domains to `127.0.0.1`:
```
127.0.0.1 socialdev.com
127.0.0.1 api.socialdev.com
127.0.0.1 n8n.socialdev.com
127.0.0.1 prometheus.socialdev.com
127.0.0.1 grafana.socialdev.com
```

## 8. Configure Frontend Environment

For the frontend application to communicate with the backend API, you need to create a `.env.local` file in the `frontend` directory.

1.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```

2.  Create a new file named `.env.local` and add the following content:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://api.socialdev.com
    ```

This file tells the frontend application where to find the backend API.

## 9. Accessing Services

Once everything is deployed, you can access the services in your browser:
- **Frontend**: http://socialdev.com
- **n8n**: http://n8n.socialdev.com
- **Prometheus**: http://prometheus.socialdev.com
- **Grafana**: http://grafana.socialdev.com

For n8n data population, refer to the [n8n Data Population Guide](./docs/n8n-data-population.md).

