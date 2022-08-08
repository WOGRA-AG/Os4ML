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

FROM gitlab-registry.wogra.com/developer/images/python:3.9.10-slim as production

COPY dockerfiles/pandas/requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

COPY --from=openapi /build/ /src/build/
COPY ./src /src

WORKDIR src

