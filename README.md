![Ludwig logo](https://github.com/WOGRA-AG/os4ml-docs/raw/main/docs/assets/logos/Os4ML_Logo_Large.png
 "Os4ML logo")

# Open space for Machine Learning
Open space for Machine Learning is an open source platform for automated 
machine learning. The goal is to enable non-experts to solve every day 
problems with AI. It automates all steps on the way to the finished AI 
model with the help of an intuitive UI/UX.The alpha release supports the 
following features:

- Create a data bags using Excel sheets
- Create a solution using [Ludwig](https://github.com/ludwig-ai/ludwig) for 
  categorization and regression problems
- Integration of external storage, e.g. [Shepard][] using python scripts
- Multi-User Isolation

The current version is an alpha release, i.e. everything is work in progress and 
experimental. For more details please read the [docs][]. 

## About the Project
The project focuses on easy installation, intuitive UI/UX and comfortable 
machine learning. So we do not reinvent the wheel. Whenever possible, we 
use third-party open source software.

## Roadmap
There is a lot of work to do. In the near future the following will happen:

- [x] A [Terraform module to install Os4ML](https://github.com/WOGRA-AG/terraform-kustomization-os4ml) on a k3d cluster using ArgoCD
- [x] Solving regression problems (Winter 2022)
- [x] Solving multi output problems (Spring 2022)
- [ ] Adding Transfer Learning Support (Summer 2023)
- [ ] Intelligent Data Labeling (Fall 2023)

## More Information
If you are interested in contributing, have questions, comments, or thoughts to share, or if you just want to be in the
know, please consider [joining the Os4ML Slack](https://join.slack.com/t/os4ml/shared_invite/zt-24j5pz3g4-tKaztoxu3JpYQ0gQYy03lw)

## Citing Os4ML
If you are using Os4ML for a scientific project, please cite the following paper:

Rall, D., Bauer, B., & Fraunholz, T. (2023). Towards Democratizing AI: A Comparative Analysis of AI as a Service Platforms and the Open Space for Machine Learning Approach. Proceedings of the 2023 7th International Conference on Cloud and Big Data Computing, 34–39. [https://doi.org/10.1145/3616131.3616136]()

```bibtex
@inproceedings{10.1145/3616131.3616136,
author={Rall, Dennis and Bauer, Bernhard and Fraunholz, Thomas},
title={Towards Democratizing AI: A Comparative Analysis of AI as a Service Platforms and the Open Space for Machine Learning Approach},
year={2023},
isbn={9798400707339},
publisher={Association for Computing Machinery},
address={New York, NY, USA},
url={https://doi.org/10.1145/3616131.3616136},
doi={10.1145/3616131.3616136},
booktitle={Proceedings of the 2023 7th International Conference on Cloud and Big Data Computing},
pages={34–39},
numpages={6},
keywords={AI-as-a-Service, Cloud Computing, Platform, Artificial Intelligence},
location={Manchester, United Kingdom},
series={ICCBDC '23}
}
```

Rall, D., Fraunholz, T., & Bauer, B. (2023). AI-Democratization: From Data-first to Human-first AI. Central European Conference on Information and Intelligent Systems, 261–267.

```bibtex
@inproceedings{rail2023ai,
  title={AI-Democratization: From Data-first to Human-first AI},
  author={Rall, Dennis and Fraunholz, Thomas and Bauer, Bernhard},
  booktitle={Central European Conference on Information and Intelligent Systems},
  pages={261-67},
  year={2023},
  organization={Faculty of Organization and Informatics Varazdin}
}
```
   
## Acknowledgment
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
