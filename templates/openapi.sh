#!/bin/sh

docker run --rm \
  -v $PWD:/local/ openapitools/openapi-generator-cli:v6.2.0 generate \
  -i /local/oas/model-manager-oas.yaml \
  -t /local/oas/templates_client \
  -g python \
  --package-name src.build.model_manager_client \
  -o /local \
  --global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

docker run --rm \
  -v $PWD:/local/ openapitools/openapi-generator-cli:v5.4.0 generate \
  -i /local/oas/objectstore-manager-oas.yaml \
  -t /local/oas/templates_client \
  -g python \
  --package-name src.build.objectstore_client \
  -o /local \
  --global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
