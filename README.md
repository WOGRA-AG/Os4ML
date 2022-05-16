# Open space for Machine Learning
Open space for Machine Learning is an open source platform for automated 
machine learning. The goal is to enable non-experts to solve every day 
problems with AI. It automates all steps on the way to the finished AI 
model with the help of an intuitive UI/UX. For more details please read the 
[docs][].

## About The Project
The project focuses on easy installation, intuitive UI/UX and comfortable 
machine learning.

We're not reinventing the wheel. Whenever possible, we use third-party open 
source software. For example, we rely on [Kubeflow][], especially for machine 
learning tasks. But don't worry, you don't need a running Kubeflow. 
[Kubeflow][] runs  under the hood at Os4ML.

The project is in an early phase, i.e. everything is work in progress and 
experimental. We plan to release a first demo version at the end of March.

## Getting Started
As said before we try to keep things as simple as possible. 

### Prerequisites
In fact, all it takes is a running [Kubernetes][] cluster to get started.
With [k3d][] you can do it like this, for example

```sh
k3d cluster create os4ml-cluster
```

If you want to do machine learning, GPUs are always an issue. Unfortunately, 
GPUs are known to be a topic of their own. For more information on how to 
use GPUs please read the [docs][].

### Installation
Nobody wants complicated installations. We neither. For this reason
we provide [Terraform][] scripts to install Os4ML on any [Kubernetes][]
cluster. And this is how it works:

```sh
git clone https://github.com/WOGRA-AG/Os4ML.git
cd os4ml/terraform
terraform init
terraform apply -auto-approve
```

This takes a bit and offers the opportunity to get a coffee.

** REMARK: We recommend using k3d. However, there are issues with the image
k3s:v1.22.6-k3s1. In case of problems, try the image k3s:v1.21.7-k3s1. **

### Usage
You won't believe it, but in fact your [Kubernetes][] cluster now hosts Os4ML 
including a fully functional [Kubeflow][]. And that's how you get it:

```sh
kubectl port-forward -n istio-system svc/istio-ingressgateway 8000:80
```
Now, open `localhost:8000` for [Kubeflow][] or `localhost:8000/os4ml/` for 
Os4ML (don't forget the slash). As described 
[here](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/),
the connection is terminated when the command is aborted. Whenever you are 
asked for credentials, there exists a standard user with email 
`user@example.com` and password `12341234`.

## Implemented Features
We're heading towards the alpha release in early fall 2022. The following 
features are currently already implemented experimentally:

- Create a data bags using Excel sheets
- Create a solution using [Ludwig](https://github.com/ludwig-ai/ludwig) for 
  categorization problems

## Roadmap
There is a lot of work to do. In the near future the following will happen:

- [Shepard] Integration
   - [x] [Terraform module](https://github.com/WOGRA-AG/terraform-kustomization-shepard) (April 2022)
   - [ ] Os4ML Shepard Controller (Mai 2022)
- Frontend
   - [ ] Finalize UI/UX to create data bag and solutions (May 2022)
   - [ ] Live Tutorial (July 2022)
- AutoML
   - [ ] Solver for Image data based using  [Kubeflow/Katib][] (Mai 2022)
   - [ ] Intelligent Data Labeling (June 2022)
   - [ ] Solving regression problems (Winter 2022)
   
## 	Acknowledgment
Os4ML is a project of the [WOGRA AG][] research group in cooperation with the 
German Aerospace Center and is funded by the Ministry of Economic Affairs, 
Regional Development and Energy as part of the High Tech Agenda of the 
Free State of Bavaria.

## License
Os4ML is primarily distributed under the terms of both the MIT license
and the Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE), [LICENSE-MIT](LICENSE-MIT), and
[COPYRIGHT](COPYRIGHT) for details.

[Angular]: https://angular.io/
[FastAPI]: https://fastapi.tiangolo.com/
[Kubernetes]: https://kubernetes.io/
[Kubernetes/port-forward]: https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/
[Kubeflow]: https://www.kubeflow.org/
[Kubeflow/Katib]: https://github.com/kubeflow/katib
[k3d]: https://k3d.io
[MinIO]: https://min.io/
[OpenAPI]:https://swagger.io/specification/
[docs]: https://wogra-ag.github.io/os4ml-docs/
[Shepard]: https://gitlab.com/dlr-shepard
[Terraform]: https://www.terraform.io/
[WOGRA AG]: https://www.wogra.com/
[WOGRA-AG/kubeflow/kustomization]: https://registry.terraform.io/modules/WOGRA-AG/kubeflow/kustomization/latest
