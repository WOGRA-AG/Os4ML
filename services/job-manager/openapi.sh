openapi-generator-cli generate \
-i oas/job-manager-oas.yaml \
-t oas/templates \
--package-name build.openapi_server \
-g python-fastapi \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

cd src && openapi-generator-cli generate \
-i ../oas/objectstore-manager-oas.yaml \
-t ../oas/templates_client \
-g python \
--package-name build.openapi_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
