## Deployment
### Using terraform and k3d
Create a Cluster and deploy os4ml
```sh
git clone https://github.com/WOGRA-AG/terraform-kustomization-os4ml.git
cd terraform-kustomization-os4ml
k3d cluster create --config ./k3d-default.yaml
terraform init
terraform apply -auto-approve
```

## Telepresence
### Telepresence Reset
Sometimes telepresence does not work properly, use the following steps to reset telepresene:
```sh
telepresence quit -s
telepresence helm uninstall
telepresence helm install
telepresence connect
```

### Intercept Services
```sh
telepresence connect
telepresence intercept frontend --namespace os4ml --port 4200:80
telepresence intercept jobmanager --namespace os4ml --port 8000:8000
telepresence intercept objectstore-manager --namespace os4ml --port 8001:8000
telepresence intercept workflow-translator --namespace os4ml --port 8002:8000
telepresence intercept model-manager --namespace os4ml --port 8003:8000
```

## Formatting
For the python services we are using black and isort to format our files. Use the following commands to format the files:
```sh
black --config ./pyproject.toml src tests --exclude src/build --check 
black --config ./pyproject.toml src tests --exclude src/build
isort --settings-path ./pyproject.toml src tests --skip-gitignore --check-only
isort --settings-path ./pyproject.toml src tests --skip-gitignore
```

To lint the frontend files run
```sh
npm run lint
```
and to format them run
```sh
npm run format
```

## Access the Minio
You can use the minio plugin to get access to the minio instance running in the cluster. Install it with:
```sh
yay -S kubectl-minio
```
https://docs.min.io/minio/k8s/reference/minio-kubectl-plugin.html#kubectl-minio-proxy

and run it with:
```sh
kubectl minio proxy
```
Copy the printed jwt, browse to localhost:9090 and paste jwt on login screen.

## Access fastapi service swagger-docs
To access the fastapi swagger docs forward port 8000 of the target service to an arbitrary local port

```sh
kubectl port-forward -n os4ml services/<service-name> <local-port>:8000
```

and access the docs on

```sh
localhost:<local-port>/docs
```
