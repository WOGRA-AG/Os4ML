ARG POETRY_VERSION=1.5.1
# From: https://github.com/michael0liver/python-poetry-docker-example/blob/master/docker/Dockerfile
FROM python:3.10.7-slim as python-base
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
    POETRY_VERSION=${POETRY_VERSION} \
    OPENAPI_GENERATOR_CLI_VERSION=5.4.0

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$JAVA_HOME/bin:$PATH"
ENV PYTHONPATH="$PROJECT_DIR:$PROJECT_DIR/src:$PROJECT_DIR/src/build$PYTHONPATH"

# Specify a base image
FROM openapitools/openapi-generator-cli:v6.2.0 as openapi

WORKDIR /usr/app
COPY services/workflow-translator/oas /usr/app/oas
RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i oas/workflow-translator-oas.yaml \
-t oas/templates \
--package-name src.build.openapi_server \
-g python-fastapi \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

FROM python-base as builder-base
ARG IMAGE_TAG
ENV IMG_TAG=$IMAGE_TAG
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        build-essential curl \
    && apt-get autoclean

RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR $PYSETUP_PATH
COPY services/workflow-translator/poetry.lock services/workflow-translator/pyproject.toml ./

RUN --mount=type=cache,target=/root/.cache \
    poetry install --only main --no-root

WORKDIR /templates
COPY templates /templates
RUN python build_all_components.py
RUN python build_all_pipelines.py
WORKDIR $PYSETUP_PATH

# 'development' stage installs all dev deps and can be used to develop code.
# For example using docker-compose to mount local volume under /app
FROM python-base as development
ENV FASTAPI_ENV=development

COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH

COPY services/workflow-translator/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR $PYSETUP_PATH
RUN poetry install --no-root

COPY --from=openapi /usr/app/src/src/build $PROJECT_DIR/src/build
COPY --from=builder-base /templates/pipelines /pipelines
WORKDIR $PROJECT_DIR
COPY services/workflow-translator/ .

EXPOSE 8000
ENTRYPOINT /docker-entrypoint.sh $0 $@
CMD ["uvicorn", "--reload", "--host=0.0.0.0", "--port=8000", "main:app"]

FROM development AS lint
RUN black --config ./pyproject.toml src tests --exclude src/build --check
RUN isort --settings-path ./pyproject.toml src tests --check-only
CMD ["tail", "-f", "/dev/null"]


# 'test' stage runs our unit tests with pytest and coverage.
FROM development AS test
RUN coverage run --rcfile ./pyproject.toml -m pytest ./tests
RUN coverage report -m --fail-under 80


FROM python-base as production
ENV FASTAPI_ENV=production

COPY --from=builder-base $VENV_PATH $VENV_PATH
COPY --from=openapi /usr/app/src/src/build $PROJECT_DIR/src/build
COPY --from=builder-base /templates/pipelines /pipelines
COPY services/workflow-translator/gunicorn_conf.py $PROJECT_DIR/

WORKDIR $PROJECT_DIR

COPY services/workflow-translator/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY services/workflow-translator/src $PROJECT_DIR/src

EXPOSE 8000
ENTRYPOINT /docker-entrypoint.sh $0 $@
CMD [ "gunicorn", "--worker-class uvicorn.workers.UvicornWorker", "--config ./gunicorn_conf.py", "--chdir src", "main:app"]
