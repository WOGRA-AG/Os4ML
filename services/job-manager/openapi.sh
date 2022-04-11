# -> Original Mustache Templates https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/python-fastapi
# -> Template Customization Tutorial https://duongnt.com/openapi-generator-mustache-customize/


openapi-generator-cli generate \
-i oas/job-manager-oas.yaml \
-t oas/templates \
--package-name build.openapi_server \
-g python-fastapi \
-o . \
--global-property models,supportingFiles

openapi-generator-cli generate \
-i oas/job-manager-oas.yaml \
-t oas/templates \
--package-name build.openapi_server \
-g python-fastapi \
-o .

cd src && openapi-generator-cli generate \
-i ../oas/objectstore-manager-oas.yaml \
-g python \
--package-name build.openapi_client \
-o .
