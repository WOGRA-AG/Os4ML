ARG POETRY_VERSION=1.6.1
FROM openapitools/openapi-generator-cli:v5.4.0 as openapi

WORKDIR /usr/app
COPY ./oas/ /usr/app/oas
RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i oas/model-manager-oas.yaml \
-t oas/templates \
--package-name src.build.openapi_server \
-g python-fastapi \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

WORKDIR /usr/app/src
RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i ../oas/objectstore-manager-oas.yaml \
-t ../oas/templates_client \
-g python \
--package-name src.build.objectstore_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i ../oas/job-manager-oas.yaml \
-t ../oas/templates_client \
-g python \
--package-name src.build.job_manager_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

# https://github.com/svx/poetry-fastapi-docker/blob/main/Dockerfile
# Dockerfile
# Uses multi-stage builds requiring Docker 17.05 or higher
# See https://docs.docker.com/develop/develop-images/multistage-build/
# Creating a python base with shared environment variables
FROM python:3.10.7-slim AS python-base
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
    POETRY_VERSION=${POETRY_VERSION}

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
ENV PYTHONPATH="$PROJECT_DIR:$PROJECT_DIR/src:$PROJECT_DIR/src/build$PYTHONPATH"

# builder-base is used to build dependencies
FROM python-base AS builder-base
RUN buildDeps="build-essential" \
    && apt-get update \
    && apt-get install --no-install-recommends -y \
        curl \
        vim \
        netcat \
    && apt-get install -y --no-install-recommends $buildDeps \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry - respects $POETRY_VERSION & $POETRY_HOME
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=${POETRY_HOME} python3 - && \
    chmod a+x /opt/poetry/bin/poetry

# We copy our Python requirements here to cache them
# and install only runtime deps using poetry
WORKDIR $PYSETUP_PATH
COPY ./poetry.lock ./pyproject.toml ./
RUN poetry install --only main --no-root # respects

# 'development' stage installs all dev deps and can be used to develop code.
# For example using docker-compose to mount local volume under /app
FROM python-base as development
ENV FASTAPI_ENV=development

# Copying poetry and venv into image
COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH

# Copying in our entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# venv already has runtime deps installed we get a quicker install
WORKDIR $PYSETUP_PATH
RUN poetry install --no-root

COPY --from=openapi /usr/app/src/src/build $PROJECT_DIR/src/build
WORKDIR $PROJECT_DIR
COPY . .

EXPOSE 8000
ENTRYPOINT /docker-entrypoint.sh $0 $@
CMD ["uvicorn", "--reload", "--host=0.0.0.0", "--port=8000", "main:app"]


# 'lint' stage runs black and isort
# running in check mode means build will fail if any linting errors occur
FROM development AS lint
RUN black --config ./pyproject.toml --exclude src/build --check src tests
RUN isort --settings-path ./pyproject.toml --check-only src tests
CMD ["tail", "-f", "/dev/null"]

# 'test' stage runs our unit tests with pytest and
# coverage.  Build will fail if test coverage is under 95%
# runs static type-checking with mypy
FROM development AS test
RUN mypy src
RUN coverage run --rcfile ./pyproject.toml -m pytest ./tests
RUN coverage report --fail-under 55

# 'production' stage uses the clean 'python-base' stage and copyies
# in only our runtime deps that were installed in the 'builder-base'
FROM python-base AS production
ENV FASTAPI_ENV=production

COPY --from=builder-base $VENV_PATH $VENV_PATH
COPY --from=openapi /usr/app/src/src/build $PROJECT_DIR/src/build
COPY gunicorn_conf.py /gunicorn_conf.py

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create user with the name poetry
RUN groupadd -g 1500 poetry && \
    useradd -m -u 1500 -g poetry poetry

COPY --chown=poetry:poetry ./src $PROJECT_DIR/src
COPY --chown=poetry:poetry main.py $PROJECT_DIR/main.py
USER poetry
WORKDIR /app

ENTRYPOINT /docker-entrypoint.sh $0 $@
CMD [ "gunicorn", "--worker-class uvicorn.workers.UvicornWorker", "--config /gunicorn_conf.py", "main:app"]
