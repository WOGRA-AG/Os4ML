FROM gitlab-registry.wogra.com/developer/images/openapi-generator-cli:v5.4.0 as openapi

COPY oas/ /oas

RUN bash /usr/local/bin/docker-entrypoint.sh generate \
-i /oas/model-manager-oas.yaml \
-t /oas/templates_client \
-g python \
--package-name build.model_manager_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

FROM gitlab-registry.wogra.com/developer/images/ludwig-gpu:latest as production

COPY dockerfiles/ludwig/requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

COPY --from=openapi /build/ /src/build/
COPY ./src /src

WORKDIR src