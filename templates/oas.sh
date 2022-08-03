openapi-generator-cli generate \
-i ./oas/objectstore-manager-oas.yaml \
-t ./oas/templates_client \
-g python \
--package-name build.objectstore \
-o src \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

openapi-generator-cli generate \
-i ./oas/job-manager-oas.yaml \
-t ./oas/templates_client \
-g python \
--package-name build.jobmanager \
-o src \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
