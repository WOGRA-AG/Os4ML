# Open space for Machine Learning
Open space for Machine Learning is an open source platform for automated 
machine learning. The goal is to enable non-experts to solve every day 
problems with AI. It automates all steps on the way to the finished AI 
model with the help of an intuitive UI/UX. For more details please read the 
[docs][].

## About The Project
The project focus on a good UI/UX experience in combination with comfortable 
AutoML.

We're not reinventing the wheel. Whenever possible, we use third-party open 
source software. For example, we rely on [Kubeflow][], especially for machine 
learning tasks. But don't worry, you don't need a running Kubeflow. 
[Kubeflow][] runs  under the hood at Os4ML.

The project is in an early phase, i.e. everything is work in progress and 
experimental. We plan to release a first demo version at the end of March.

## Getting Started

### Prerequisites
The only thing you need is a running [Kubernetes][]. With [k3d][] you can 
do it like this, for example

```sh
k3d cluster create os4ml-cluster
```

For more information on how GPUs can be used, we refer to the [docs][].

### Installation
Os4ML provides [Terraform][] scripts to deploy on [Kubernetes][]. And this 
is how it works:

```sh
git clone https://github.com/WOGRA-AG/Os4ML.git
cd os4ml/terraform
terraform init
terraform apply
```

This will take a while but [Terraform][] will take care of everything for you.

### Usage
You won't believe it, but in fact your [Kubernetes][] cluster now hosts Os4ML 
including a fully functional [Kubeflow][]. And that's how you get it:

```sh
kubectl port-forward -n istio-system svc/istio-ingressgateway 8000:80
```
Now, open **localhost:8000** for [Kubeflow][] or 
**localhost:8000/os4ml** for Os4ML.

Whenever you are asked credentials, there exists a standard user 
**user@example.com** with password **12341234**.

## Roadmap
There is a lot of work to do. In the near future the following will happen:

1. Integration of 3rd party Software
   - [x] Deploy [Kubeflow][] using a customized [Terraform][] module, see 
     [WOGRA-AG/kubeflow/kustomization][]
   - [ ] Deploy [MinIO][] [just started]
   - [ ] Deploy [Shepard][] (February 2022)
2. Services
   - [ ] Create Objectstore Manager using [FastAPI][] and [OpenAPI][] [just 
     started]
3. Frontend
   - [x] Initial [Angular][] setup
   - [ ] UI/UX Demoversion with some AutoML (March 2022)
4. AutoML
   - [ ] Workflow Templates [just started]
   - [ ] Use [Kubeflow/Katib][] (March 2022)
   
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
