# Populating a Persistent Volume with a Helper Pod

This document outlines the method used to populate a Kubernetes Persistent Volume (PV) with existing data using a temporary "helper" pod. This is useful when you need to pre-load data into a `hostPath` or other volume type without direct access to the Kubernetes node's filesystem.

## The Process

The method involves these steps:

1.  **Create a temporary "helper" pod** that mounts the target Persistent Volume Claim (PVC).
2.  **Use `kubectl cp`** to copy your local data into the helper pod, which writes it to the mounted volume.
3.  **Delete the helper pod.**
4.  **Restart your main application's deployment** to ensure it mounts the now-populated volume.

## Helper Pod Manifest (`helper-pod.yaml`)

This is the manifest for the helper pod. It uses a lightweight `alpine` image and mounts the PVC named `n8n-pvc` to the `/data` directory inside the pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: n8n-data-helper
spec:
  containers:
  - name: helper
    image: alpine
    command: ["/bin/sh", "-c", "sleep 3600"]
    volumeMounts:
    - name: n8n-data
      mountPath: /data
  volumes:
  - name: n8n-data
    persistentVolumeClaim:
      claimName: n8n-pvc
```

## Step-by-Step Instructions

1.  **Create the Helper Pod:**
    ```bash
    kubectl apply -f helper-pod.yaml
    ```

2.  **Wait for the Pod to be Ready:**
    ```bash
    kubectl wait --for=condition=ready pod/n8n-data-helper --timeout=60s
    ```

3.  **Copy Your Data:**
    This command copies the contents of your local `./n8n-data` directory to the `/data` directory in the helper pod (and thus onto the Persistent Volume).
    ```bash
    kubectl cp ./n8n-data/. n8n-data-helper:/data
    ```

4.  **Delete the Helper Pod:**
    Once the data is copied, the helper pod is no longer needed.
    ```bash
    kubectl delete pod n8n-data-helper
    ```

5.  **Restart Your Application:**
    Finally, restart your application's deployment to make it load the data from the volume.
    ```bash
    kubectl rollout restart deployment/n8n-deployment
    ```
