![Ludwig logo](https://github.com/WOGRA-AG/os4ml-docs/raw/main/docs/assets/logos/Os4ML_Logo_Large.png
 "Os4ML logo")

# Open space for Machine Learning

Open space for Machine Learning is an open source platform for automated machine learning. The goal is to enable non-experts to solve every day problems with AI. It automates all steps on the way to the finished model with the help of an intuitive UI/UX.The alpha release supports the following features:

- Create a databag using Excel sheets, csv files and zip files with images
- Create a solution using [Ludwig](https://github.com/ludwig-ai/ludwig) for categorization and regression problems
- Integration of external storage, e.g. [Shepard](https://gitlab.com/dlr-shepard) using python scripts
- Multi-User Isolation

The current version is an alpha release, i.e. everything is work in progress and experimental. For more details please read the [docs](https://wogra-ag.github.io/os4ml-docs/).

- 📂 [Directory overview](#📂-directory-overview)
- 📔 [Usage](#📔-usage)
- 🧪 [Testing](#🧪-testing)
- 🌟 [Deployment](#🌟-deployment)
- 💌 [Releasing](#💌-releasing)
- 🚨 [Monitoring](#🚨-monitoring)
- 🗒 [Logging](#🗒-logging)
- ℹ️ [About the project](#ℹ️-about-the-project)

## 📂 Directory overview

We have several projects inside the repository. You can know more about each one of the projects taking a look to the repo folder structure:

```bash
├── [+] gitlab/                # CI/CD config
├── [+] manifests/             # K8s manifests for os4ml services
├── [+] services/              # Projects of the repository
│    ├── frontend/                # OS4ML App, build with Angular
│    ├── job-manager/             # FastAPI service for managing the execution of the ML pipelines
│    ├── oas/                     # Collection of all openapi specs of the services and templates for the code generation
│    ├── keycloak/                # Templates and themes for [keycloak](https://www.keycloak.org/)
│    ├── model-manager/           # FastAPI service to manage the main models
│    ├── oas/                     # Open api specs for the services and templates to generate clients
│    ├── objectstore-manager/     # FastAPI service for user-isolated file management
│    └── workflow-translator/     # FastAPI service that manages the ML pipelines
├── [+] templates/             # code for the ML pipelines
└── ...                        # Other files
```

## 📔 Usage

### How to install and start projects

1. Clone this repository locally `git clone ssh://git@gitlab.wogra.com:8022/developer/wogra/os4ml.git`
2. Navigate to the desired project (`services/<<SERVICE>>`) and follow the specific project documentation (`README` file)

This is the list of available repos:

- [frontend](./services/frontend/README.md)
- [job-manager](./services/job-manager/README.md)
- [keycloak](./services/keycloak/README.md)
- [model-manager](./services/model-manager/README.md)
- [objectstore-manager](./services/objectstore-manager/README.md)
- [workflow-translator](./services/workflow-translator/README.md)

## 🧪 Testing

This is a quick overview about kind of tests implemented on each one of the projects (you'll find more detail in the project specific documentation):

| Project               | Unit | Integration | E2E | Screenshot |
|-----------------------|------|-------------|-----|------------|
| `/frontend`           |❌|❌|✅|❌|
| `/job-manager`        |✅|✅|❌|❌|
| `/model-manager`      |✅|✅|❌|❌|
| `/objectstore-manager`|✅|✅|❌|❌|
| `/workflow-translator`|✅|✅|❌|❌|

## 🌟 Deployment

The deployment process is being managed by Gitlab. Just execute the corresponding pipeline steps. They will build docker images with and tag them. The argocd image update will notice the new image and notify argocd to deploy the new version.

### CI/CD Pipeline

The pipeline is formed by different stages, executed in this order:

- Prepare
- Test
- Build
- Deploy
- Reset
- E2E

#### Prepare

**Automatic**
Validates, in each one of the API projects, that the OAS file is well written

#### Test

**Automatic**
Lints the project files and runs the unit and integration tests.

#### Build

**Automatic**
Generates the application images (with Docker).

#### Deploy

**Manual**
Loads the built images and tags them to deploy them on the differen environments:

- feature
- dev
- testing
- release (only available on the `rc` branch)
- staging (only available on the `main` branch)
- prod (only available on the `main` branch and when a new tag is created)

#### Reset

**Automatic** (only when deploy to `testing` environment is run)
Resets the testing stage so each run starts from scratch.

#### E2E

**Automatic** (only when deploy to `testing` environment is run)
Runs the e2e and frontend integration tests.

## 💌 Releasing

We are sticking to the [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow. However since this project is in its early stages, we are treating fixes like new features. Follow the following steps to create and deploy a new release:
  1. At some point merge the `dev` branch into `rc`.
  2. Deploy to the release stage and test the functionality. If some issues arise, fix them and merge them also in the `rc` branch.
  3. If all is working, merge the `rc` branch into `main`.
  4. Deploy to staging and test again (the staging envoronment uses the same infrastructure as the production envoronment).
  5. Create a new tag for the new version of the `main` branch and make sure the CHANGELOG is updated.

## 🚨 Monitoring

[k9s](https://k9scli.io/) is a great tool to manage and monitor your kubernetes cluster if running locally. Otherwise use the monitoring capabilities of your cloud provider.

## 🗒 Logging

You can check the logs of each pod directly by using `kubectl` or [k9s](https://k9scli.io/). However, you can automatically collect the logs of the pod by deploying [fluentbit](https://fluentbit.io/) to the cluster.

Furthermore, you can access the logs of the services through the argocd UI and the logs of the ML pipelines through the kubeflow UI.

## ℹ️ About the Project

The project focuses on easy installation, intuitive UI/UX and comfortable machine learning. So we do not reinvent the wheel. Whenever possible, we use third-party open source software.

### Roadmap

There is a lot of work to do. In the near future the following will happen:

- [x] A [Terraform module to install Os4ML](https://github.com/WOGRA-AG/terraform-kustomization-os4ml) on a k3d cluster using ArgoCD
- [x] Solving regression problems (Winter 2022)
- [x] Solving multi output problems (Spring 2022)
- [x] Adding Transfer Learning Support (Summer 2023)
- [x] Support for Model Sharing (Fall 2023)
- [ ] Suggestions for Transfer learning (Winter 2023)
- [ ] Data visualizations (Spring 2024)
- [ ] Intelligent Data Labeling (Summer 2024)

### More Information

If you are interested in contributing, have questions, comments, or thoughts to share, or if you just want to be in the know, please consider [joining the Os4ML Slack](https://join.slack.com/t/os4ml/shared_invite/zt-24j5pz3g4-tKaztoxu3JpYQ0gQYy03lw)

### Citing Os4ML

If you are using Os4ML for a scientific project, please cite the following paper:

Rall, D., Bauer, B., & Fraunholz, T. (2023). Towards Democratizing AI: A Comparative Analysis of AI as a Service Platforms and the Open Space for Machine Learning Approach. Proceedings of the 2023 7th International Conference on Cloud and Big Data Computing, 34–39. [https://doi.org/10.1145/3616131.3616136](https://doi.org/10.1145/3616131.3616136)

```bibtex
@inproceedings{rall2023towards,
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
@inproceedings{rall2023ai,
  title={AI-Democratization: From Data-first to Human-first AI},
  author={Rall, Dennis and Fraunholz, Thomas and Bauer, Bernhard},
  booktitle={Central European Conference on Information and Intelligent Systems},
  pages={261-67},
  year={2023},
  organization={Faculty of Organization and Informatics Varazdin}
}
```

### Acknowledgment

Os4ML is a project of the [WOGRA AG](https://www.wogra.com/) research group in cooperation with the German Aerospace Center and is funded by the Ministry of Economic Affairs, Regional Development and Energy as part of the High Tech Agenda of the Free State of Bavaria.

### License

Os4ML is primarily distributed under the terms of both the MIT license and the Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE), [LICENSE-MIT](LICENSE-MIT), and [COPYRIGHT](COPYRIGHT) for details.
