# Monitoring Setup with kube-prometheus-stack

This guide provides instructions for setting up `kube-prometheus-stack` to monitor the backend service in your Kubernetes cluster.

## 1. Deploying kube-prometheus-stack

You will be using the `kube-prometheus-stack` Helm chart, which includes Prometheus, Grafana, Alertmanager, and other components.

### Using Helm

1.  **Add the Prometheus Community Helm repository:**
    ```sh
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    ```

2.  **Install `kube-prometheus-stack`:**
    You can install the stack using your provided `my-values.yaml` file.
    ```sh
    helm install prometheus-stack prometheus-community/kube-prometheus-stack -f monitoring/my-values.yaml
    ```
    This will deploy Prometheus and Grafana, along with other monitoring components.

## 2. Configuring Prometheus to Scrape the Backend

`kube-prometheus-stack` uses `ServiceMonitor` custom resources to configure Prometheus to scrape metrics from your services. You need to create a `ServiceMonitor` for your backend application.

Create a file named `k8s/backend-servicemonitor.yaml` with the following content:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: backend-servicemonitor
  labels:
    app: backend
    release: prometheus-stack # This label is important for kube-prometheus-stack to discover this ServiceMonitor
spec:
  selector:
    matchLabels:
      app: backend
  endpoints:
  - port: http-metrics # This should match the name of the port in your backend-service.yaml
    path: /metrics
    interval: 15s
```

**Note**: You need to add a `name` to the port in your `k8s/backend-service.yaml` file for the `ServiceMonitor` to correctly identify it. I will update the `k8s/backend-service.yaml` file to include this.

Apply the `ServiceMonitor` to your cluster:
```sh
kubectl apply -f k8s/backend-servicemonitor.yaml
```

## 3. Accessing Grafana

Once `kube-prometheus-stack` is deployed, Grafana will be available.

### Accessing Grafana UI

By default, Grafana is not exposed externally. You can access it using `kubectl port-forward`:
```sh
kubectl port-forward svc/prometheus-stack-grafana 3000:80
```
You can then access Grafana at `http://localhost:3000`.

To get the admin password, run:
```sh
kubectl get secret --namespace default prometheus-stack-grafana -o jsonpath="{.data.grafana-admin-password}" | base64 --decode ; echo
```
(Note: The secret name might vary slightly based on your Helm release name, e.g., `prometheus-stack-grafana`).

### Create a Dashboard

You can create a dashboard to visualize the metrics from the backend.

1.  In the Grafana UI, go to **Dashboards > New > New Dashboard**.
2.  Click **Add visualization**.
3.  In the query editor, select the Prometheus data source (it should be pre-configured by `kube-prometheus-stack`, usually named `Prometheus`).
4.  Enter the following PromQL query to show the total number of requests:
    ```
    sum(rate(http_requests_total[5m])) by (method, route)
    ```
5.  In the panel options, you can choose a visualization type, like a **Time series** or a **Stat** panel.

You can also create panels for other metrics like `http_request_duration_seconds`.