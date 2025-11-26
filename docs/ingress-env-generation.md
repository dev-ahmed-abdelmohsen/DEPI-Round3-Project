# Ingress Generation Using Environment Variables

To keep hostnames DRY and adaptable across environments, use the `ingress.template.yaml` file and substitute `${DOMAIN}`.

## 1. Set a DOMAIN variable
On Windows PowerShell:

```powershell
$env:DOMAIN = "socialdev.com"
```

Or inline when generating:

```powershell
$DOMAIN="socialdev.com"; (Get-Content k8s/ingress.template.yaml) -replace '\$\{DOMAIN\}', $DOMAIN | Out-File k8s/ingress.yaml
kubectl apply -f k8s/ingress.yaml
```

For local development:

```powershell
$DOMAIN="localhost"; (Get-Content k8s/ingress.template.yaml) -replace '\$\{DOMAIN\}', $DOMAIN | Out-File k8s/ingress.yaml
kubectl apply -f k8s/ingress.yaml
```

## 2. Apply ingress
```powershell
kubectl apply -f k8s/ingress.yaml
```

## 3. Update hosts file locally (no real DNS yet)
Add entries pointing to 127.0.0.1 or the ingress controller IP:
```
127.0.0.1 socialdev.com
127.0.0.1 api.socialdev.com
127.0.0.1 n8n.socialdev.com
127.0.0.1 prometheus.socialdev.com
127.0.0.1 grafana.socialdev.com
```

## 4. Changing the domain later
Just set `$env:DOMAIN` to the new domain and regenerate.

## 5. Notes
- The application ingress lives in the default namespace; monitoring ingress is in `monitoring` so it can reach Prometheus/Grafana services.
- Ingress cannot route across namespaces; each ingress can only reference services in its own namespace.
- Keep the template under version control; generate concrete `ingress.yaml` as needed.
