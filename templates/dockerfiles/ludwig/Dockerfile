ARG POETRY_VERSION=1.6.1
FROM openapitools/openapi-generator-cli:v5.4.0 as openapi

COPY oas/ /oas

RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i /oas/model-manager-oas.yaml \
-t /oas/templates_client \
-g python \
--package-name build.model_manager_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

FROM wogra/cuda-poetry:cuda11.7.1-poetry${POETRY_VERSION} as production

COPY dockerfiles/ludwig/pyproject.toml /pyproject.toml
COPY dockerfiles/ludwig/poetry.lock /poetry.lock

RUN poetry config virtualenvs.create false && poetry install --no-root --only main
RUN pip install torch==2.0.1 # fix for pytorch

COPY --from=openapi /build/ /src/build/
COPY ./src /src

WORKDIR src
