#!/bin/sh

sudo rm -r src/build

docker run --rm \
  -v $PWD:/local/ openapitools/openapi-generator-cli:v5.4.0 generate \
  -i /local/oas/objectstore-manager-oas.yaml \
  -t /local/oas/templates \
  -g python-fastapi \
  --package-name build.openapi_server \
  -o /local \
  --global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
