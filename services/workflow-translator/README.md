# OS4ML - Workflow translator

Manages the workflows for the ML pipelines for the workflow engine. Adds necessary information such as the execution informations (usertoken, computing resources, etc.) on the fly to them.

- 📂 [Directory overview](#📂-directory-overview)
- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)

## 📂 Directory overview

```bash
├── [+] oas/                # Mirror of the services/oas directory (needed for the docker build)
├── [+] src/                # Source code of the app
│    ├── api/                 # Entry point of the rest api
│    ├── decorators/          # Shared decorators
│    ├── exceptions/          # Collection of exceptions
│    ├── parser/              # Implementation of different parsers
│    ├── repository/          # Implementation of different storage locations of the pipelines
│    └── services/            # Services the api exposes
├── [+] tests/              # Tests of the app
├── README.md               # Inception
├── gunicorn_conf.py        # Configuration of the webserver
└── pyproject.toml          # Pyproject file
```

## 🛠️ Getting started

1. Install the project with `poetry install`
2. Build the components and pipelines (see [templates](/templates/README.md))
3. Direct the `PIPELINE_TEMPLATES_DIR` variable to the directory where you built the pipelines
4. Run the server with `poetry run python src/main.py`

### Available scripts

Here there's a list of the most relevant scripts:

- `openapi.sh`: generate the openapi server and client code

## 🧪 Testing

On this project is implemented, at the moment, these kind of tests:

- ⁉️ Unit tests
- ⁉️ Integration tests
- ⁉️ E2E tests
- ⁉️ Visual tests
