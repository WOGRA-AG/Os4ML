# From: https://github.com/michael0liver/python-poetry-docker-example/blob/master/docker/Dockerfile
FROM python:3.8.9-slim as python-base
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
    POETRY_VERSION=1.1.13

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$JAVA_HOME/bin:$PATH"
ENV PYTHONPATH="$PROJECT_DIR:$PROJECT_DIR/src:$PROJECT_DIR/build:$PROJECT_DIR/build/src:$PYTHONPATH"


FROM python-base as builder-base
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        build-essential curl \
    && apt-get autoclean

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

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

EXPOSE 8000
ENTRYPOINT /docker-entrypoint.sh $0 $@
CMD ["uvicorn", "--reload", "--host=0.0.0.0", "--port=8000", "main:app"]


FROM development AS lint
RUN black --config ./pyproject.toml --check src tests components pipelines
RUN isort --settings-path ./pyproject.toml --check-only src tests components pipelines

FROM development AS test
RUN coverage run --rcfile ./pyproject.toml -m pytest ./tests
RUN #coverage report -m --fail-under 75
