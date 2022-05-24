
## Deployment
### Using terraform
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
kubectl apply -k manifests/common/profile
kubectl apply -k manifests/common/base
kubectl apply -k manifests/common/cert-manager
kubectl apply -k manifests/apps/objectstore-manager
kubectl apply -k manifests/apps/job-manager/base
// TODO: Check this
kubectl apply -k manifests/apps/frontend
```

#### Delete Cluster Service
```sh
kubectl delete -k manifests/common/profile
kubectl delete -k manifests/common/base
kubectl delete -k manifests/common/cert-manager
kubectl delete -k manifests/apps/objectstore-manager
kubectl delete -k manifests/apps/job-manager/base
kubectl delete -k manifests/apps/frontend
// TODO: Check this
```

## kubectl
### Get
```sh
kubectl get namespaces
kubectl get services -n <namespace>
kubectl get pods -n <service>
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

istio-ingressgateway.istio-system/

jobmanager.os4ml

servicename.namespace

### Intercept
```sh
telepresence intercept os4ml-jobmanager --namespace os4ml --port 8000:8000
```

### Formatting and Import Sorting
```sh
black --config ./pyproject.toml src tests --exclude src/build --check 
black --config ./pyproject.toml src tests --exclude src/build
```sh
isort --settings-path ./pyproject.toml src tests --skip-gitignore --check-only
isort --settings-path ./pyproject.toml src tests --skip-gitignore
```

### OpenAPI Server and client generation
```sh
openapi-generator-cli generate \
-i oas/job-manager-oas.yaml \
-t oas/templates \
--package-name build.openapi_server \
-g python-fastapi \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

cd src && openapi-generator-cli generate \
-i ../oas/objectstore-manager-oas.yaml \
-g python \
--package-name build.openapi_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
```

deployment.yaml anpassen manifests/apps/job-manager/base/deployment.yaml
```yaml
image: "gitlab-registry.wogra.com/developer/wogra/os4ml/job-manager:7e64992"
imagePullPolicy: Always
```
```bash
kubectl delete -k manifests/apps/job-manager/overlays/istio
DOCKER_BUILDKIT=1 docker build services/job-manager --tag gitlab-registry.wogra.com/developer/wogra/os4ml/job-manager:7e64992 --target production --no-cache
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/job-manager:7e64992
kubectl apply -k manifests/apps/job-manager/overlays/istio
```

deployment.yaml anpassen manifests/apps/objectstore-manager/base/deployment.yaml
```yaml
image: "gitlab-registry.wogra.com/developer/wogra/os4ml/objectstore-manager:7e64992"
imagePullPolicy: Always
```
```bash
kubectl delete -k manifests/apps/objectstore-manager/overlays/istio
DOCKER_BUILDKIT=1 docker build services/objectstore-manager --tag gitlab-registry.wogra.com/developer/wogra/os4ml/objectstore-manager:7e64992 --target production --no-cache
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/objectstore-manager:7e64992
kubectl apply -k manifests/apps/objectstore-manager/overlays/istio
```

```bash
kubectl -n os4ml get events
```
```bash
yay -S kubectl-minio
```
https://docs.min.io/minio/k8s/reference/minio-kubectl-plugin.html#kubectl-minio-proxy

```bash
kubectl minio proxy
```
copy jwt, browse to localhost:9090 and paste jwt on login screen
