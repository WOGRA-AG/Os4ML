#!/bin/sh

rm -r src/build

docker run --rm -u $(id -u):$(id -g) \
  -v $PWD:/local/ openapitools/openapi-generator-cli:v6.2.0 generate \
  -i /local/oas/workflow-translator-oas.yaml \
  -t /local/oas/templates \
  -g python-fastapi \
  --package-name src.build.openapi_server \
  -o /local \
  --global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

mkdir src/build
mv src/src/build/* src/build
rm -r src/src
