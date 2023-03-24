## Deployment
### Using terraform and k3d
#### Create Cluster Service
```sh
git clone https://github.com/WOGRA-AG/terraform-kustomization-os4ml.git
cd terraform-kustomization-os4ml
k3d cluster create --config ./k3d-default.yaml
terraform init
terraform apply -auto-approve
```

## kubectl
### Get
```sh
kubectl get namespaces
kubectl get services -n <namespace>
kubectl get pods -n <service>
kubectl get events -n <namespace> 
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
### Telepresence Reset
```sh
telepresence quit -s
telepresence helm uninstall
telepresence helm install
telepresence connect
```

### Intercept
```sh
telepresence connect
telepresence intercept frontend --namespace os4ml --port 4200:80
telepresence intercept jobmanager --namespace os4ml --port 8000:8000
telepresence intercept objectstore-manager --namespace os4ml --port 8001:8000
```

### Formatting and Import Sorting
```sh
black --config ./pyproject.toml src tests --exclude src/build --check 
black --config ./pyproject.toml src tests --exclude src/build
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

## Access fastapi service swagger-docs

To access the fastapi swagger docs forward port 8000 of the target service to an arbitrary local port

`kubectl port-forward -n <service-namespace> services/<service-name> <local-port>:8000`

and access the docs on

`localhost:<local-port>/docs`
