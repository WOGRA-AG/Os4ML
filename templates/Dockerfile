FROM openapitools/openapi-generator-cli:v5.4.0 as openapi

COPY oas/ /oas

RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i /oas/objectstore-manager-oas.yaml \
-t /oas/templates_client \
-g python \
--package-name build.objectstore \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i /oas/job-manager-oas.yaml \
-t /oas/templates_client \
-g python \
--package-name build.jobmanager \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

# From: https://github.com/michael0liver/python-poetry-docker-example/blob/master/docker/Dockerfile
FROM gitlab-registry.wogra.com/developer/images/python:3.9.10-slim as python-base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv" \
    PROJECT_DIR="/app" \
    POETRY_VERSION=1.2.0

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$JAVA_HOME/bin:$PATH"
ENV PYTHONPATH="$PROJECT_DIR:$PROJECT_DIR/src:$PROJECT_DIR/build:$PROJECT_DIR/build/src:$PYTHONPATH"


FROM python-base as builder-base
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        build-essential curl \
    && apt-get autoclean

RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml ./

RUN --mount=type=cache,target=/root/.cache \
    poetry install --no-dev --no-interaction --no-ansi

# 'development' stage installs all dev deps and can be used to develop code.
# For example using docker-compose to mount local volume under /app
FROM python-base as development
ENV FASTAPI_ENV=development

COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR $PYSETUP_PATH
RUN --mount=type=cache,target=/root/.cache \
    poetry install -q

WORKDIR $PROJECT_DIR
COPY . .

WORKDIR $PROJECT_DIR
COPY --from=openapi /build/ ./src/build/


FROM development AS lint
RUN black --config ./pyproject.toml --check src tests components pipelines
RUN isort --settings-path ./pyproject.toml --check-only src tests components pipelines

FROM development AS test
RUN coverage run --rcfile ./pyproject.toml -m pytest ./tests
RUN #coverage report -m --fail-under 75
