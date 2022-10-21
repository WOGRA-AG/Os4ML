openapi-generator-cli generate \
-i oas/job-manager-oas.yaml \
-t oas/templates \
--package-name build.openapi_server \
-g python-fastapi \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

cd src

openapi-generator-cli generate \
-i ../oas/objectstore-manager-oas.yaml \
-t ../oas/templates_client \
-g python \
--package-name build.objectstore_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

openapi-generator-cli generate \
-i ../oas/workflow-translator-oas.yaml \
-t ../oas/templates_client \
-g python \
--package-name build.translator_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false