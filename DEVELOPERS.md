## Deployment
### Using terraform
#### Create Cluster Service
```sh
k3d cluster create os4ml-cluster
```
```sh
git clone https://github.com/WOGRA-AG/Os4ML.git
cd os4ml/terraform
terraform init
terraform apply -auto-approve
```
### Using kubectl
#### Create Cluster Service
```sh
while ! kubectl apply -k github.com/kubeflow/manifests.git/example; do echo "Retrying to apply resources"; sleep 10; done
kubectl apply -k common/profile
kubectl apply -k common/base
kubectl apply -k common/cert-manager
kubectl apply -k apps/objectstore-manager
kubectl apply -k apps/job-manager/base
kubectl apply -k apps/frontend
```

#### Delete Cluster Service
```sh
kubectl delete -k common/profile
kubectl delete -k common/base
kubectl delete -k common/cert-manager
kubectl delete -k apps/objectstore-manager
kubectl delete -k apps/job-manager/base
kubectl delete -k apps/frontend
```

## kubectl
### Get
```sh
kubectl get namespaces
kubectl get services -n <namespace>
kubectl get pods -n <service>
kubectl get events -n <namespace> 
```
```
### Create
```sh
kubectl create namespace <namespace>
```
### Delete
```sh
kubectl delete namespace <namespace>
```
 
## Issues
```sh
telepresence: error: Failed to establish intercept: intercept in error state AGENT_ERROR: intercept was made from an unauthenticated client
```
### Telepresence Reset
```sh
telepresence quit -u
telepresence uninstall --everything
rm -r ~/.config/telepresence
telepresence connect
```

### Intercept
```sh
telepresence connect
telepresence intercept os4ml-ui --namespace os4ml --port 4200:80
telepresence intercept os4ml-jobmanager --namespace os4ml --port 8000:8000
telepresence intercept os4ml-objecstore-manager --namespace os4ml --port 8001:8000
```

### Formatting and Import Sorting
```sh
black --config ./pyproject.toml src tests --exclude src/build --check 
black --config ./pyproject.toml src tests --exclude src/build
```sh
isort --settings-path ./pyproject.toml src tests --skip-gitignore --check-only
isort --settings-path ./pyproject.toml src tests --skip-gitignore
```

## Get a Minio
```bash
yay -S kubectl-minio
```
https://docs.min.io/minio/k8s/reference/minio-kubectl-plugin.html#kubectl-minio-proxy

```bash
kubectl minio proxy
```
copy jwt, browse to localhost:9090 and paste jwt on login screen

### Push image to test on cluster
edit manifests/apps/job-manager/base/deployment.yaml
```yaml
image: "gitlab-registry.wogra.com/developer/wogra/os4ml/job-manager:7e64992"
imagePullPolicy: Always
```
now run
```bash
kubectl delete -k manifests/apps/job-manager/overlays/istio
DOCKER_BUILDKIT=1 docker build services/job-manager --tag gitlab-registry.wogra.com/developer/wogra/os4ml/job-manager:7e64992 --target production --no-cache
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/job-manager:7e64992
kubectl apply -k manifests/apps/job-manager/overlays/istio
```

edit manifests/apps/objectstore-manager/base/deployment.yaml
```yaml
image: "gitlab-registry.wogra.com/developer/wogra/os4ml/objectstore-manager:7e64992"
imagePullPolicy: Always
```
now run
```bash
kubectl delete -k manifests/apps/objectstore-manager/overlays/istio
DOCKER_BUILDKIT=1 docker build services/objectstore-manager --tag gitlab-registry.wogra.com/developer/wogra/os4ml/objectstore-manager:7e64992 --target production --no-cache
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/objectstore-manager:7e64992
kubectl apply -k manifests/apps/objectstore-manager/overlays/istio
```
