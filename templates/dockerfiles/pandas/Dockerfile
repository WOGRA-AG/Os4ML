ARG POETRY_VERSION=1.4.2
ARG PYTHON_VERSION=3.10.6
FROM gitlab-registry.wogra.com/developer/images/openapi-generator-cli:v5.4.0 as openapi

COPY oas/ /oas

RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i /oas/model-manager-oas.yaml \
-t /oas/templates_client \
-g python \
--package-name build.model_manager_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

FROM python:${PYTHON_VERSION}-slim as production

RUN apt update && apt install -y --no-install-recommends curl

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/usr POETRY_VERSION=${POETRY_VERSION} python3 -

COPY dockerfiles/pandas/pyproject.toml /pyproject.toml
COPY dockerfiles/pandas/poetry.lock /poetry.lock

RUN poetry config virtualenvs.create false && poetry install --no-root --only main

COPY --from=openapi /build/ /src/build/
COPY ./src /src

WORKDIR src

