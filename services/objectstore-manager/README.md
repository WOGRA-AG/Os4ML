# OS4ML - Objectstore manager

Handles storing and retrieving large files with multi-user isolation in different storages such as s3, minio and gcp.

- 📂 [Directory overview](#📂-directory-overview)
- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)

## 📂 Directory overview

```bash
├── [+] oas/                # Mirror of the services/oas directory (needed for docker build)
├── [+] src/                # Source code of the app
│    ├── api/                 # Entry point of the rest api
│    ├── exceptions/          # Collection of the exceptions
│    ├── lib/                 # Shared code
│    ├── repository/          # Implementations of the different storages
│    └── services/            # Services the api exposes
├── [+] tests/              # Tests of the app
├── README.md               # Inception
├── gunicorn_conf.py        # Configuration of the webserver
└── pyproject.toml          # Pyproject file
```

## 🛠️ Getting started

1. Install the project with `poetry install`
2. Run the server with `poetry run python src/main.py`

### Available scripts

Here there's a list of the most relevant scripts:

- `openapi.sh`: generate the openapi server and client code

## 🧪 Testing

On this project is implemented, at the moment, these kind of tests:

- ✅ Unit tests
- ✅ Integration tests
- ⁉️ E2E tests
- ⁉️ Visual tests
