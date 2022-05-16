# -> Original Mustache Templates https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/python-fastapi
# -> Template Customization Tutorial https://duongnt.com/openapi-generator-mustache-customize/

cd src && openapi-generator-cli generate \
-i ../oas/objectstore-manager-oas.yaml \
-g python \
--package-name build.openapi_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
