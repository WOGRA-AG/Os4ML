# OS4ML - Job manager

The job manager is responsible for running and terminating the execution of the ML pipelines. At the moment it uses [kubelflow](https://www.kubeflow.org/), but it abstracts its concept so we can switch to a different workflow enging in the future if needed.

- 📂 [Directory overview](#📂-directory-overview)
- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)

## 📂 Directory overview

```bash
├── [+] oas/                # Mirror of the services/oas directory (needed for docker builds)
├── [+] src/                # Source code of the app
│    ├── api/                 # Entry point of the rest api
│    ├── exceptions/          # Collection of the exceptions
│    ├── executor/            # Implementations of the different executors (workflow enginges)
│    └── services/            # Services the api exposes
├── [+] tests/              # Tests of the app
├── README.md               # Inception
├── gunicorn_conf.py        # Configuration of the webserver
└── pyproject.toml          # Pyproject file
```

## 🛠️ Getting started

1. Install the project with `poetry install`
2. Run the server with `poetry run python src/main.py`
3. Change the host in the `oas/workflow-translator-oas.yaml` file to `http://workflow-translator.os4ml.cluster.local:8000` if you are intercepting with telepresence (only until this [issue](https://github.com/telepresenceio/telepresence/issues/3375) is resolved)

### Available scripts

Here there's a list of the most relevant scripts:

- `openapi.sh`: generate the openapi server and client code

## 🧪 Testing

On this project is implemented, at the moment, these kind of tests:

- ✅ Unit tests
- ✅ Integration tests
- ⁉️ E2E tests
