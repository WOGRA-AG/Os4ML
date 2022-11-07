docker run --rm \
  -v $PWD:/local/ openapitools/openapi-generator-cli:v6.2.0 generate \
  -i /local/oas/model-manager-oas.yaml \
  -t /local/oas/templates_client \
  -g python \
  --package-name src.build.model_manager_client \
  -o /local \
  --global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
