![Ludwig logo](https://github.com/WOGRA-AG/os4ml-docs/raw/main/docs/assets/Os4ML_Logo_Large.png
 "Os4ML logo")

# Open space for Machine Learning
Open space for Machine Learning is an open source platform for automated 
machine learning. The goal is to enable non-experts to solve every day 
problems with AI. It automates all steps on the way to the finished AI 
model with the help of an intuitive UI/UX.The alpha release supports the 
following features:

- Create a data bags using Excel sheets
- Create a solution using [Ludwig](https://github.com/ludwig-ai/ludwig) for 
  categorization problems
- Integration of external storage, e.g. [Shepard][] using python scripts
- Multi-User Isolation

The current version is an alpha release, i.e. everything is work in progress and 
experimental. For more details including installation manuals please read the 
[docs][]. 

## About the Project
The project focuses on easy installation, intuitive UI/UX and comfortable 
machine learning. So we do not reinvent the wheel. Whenever possible, we 
use third-party open source software.

## Roadmap
There is a lot of work to do. In the near future the following will happen:

- [x] A [Terraform module to install Os4ML](https://github.com/WOGRA-AG/terraform-kustomization-os4ml) on a k3d cluster using ArgoCD
- [ ] Solving regression problems (Winter 2022)
- [ ] Intelligent Data Labeling (Spring 2023)
   
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
