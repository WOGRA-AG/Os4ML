openapi-generator-cli generate \
-i oas/model-manager-oas.yaml \
-t oas/templates \
--package-name build.openapi_server \
-g python-fastapi \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

openapi-generator-cli generate \
-i ../oas/model-manager-oas.yaml \
-t ../oas/templates_client \
-g python \
--package-name build.model_manager_client \
-o . \
--global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false

# openapi-generator-cli generate \
# -i ../oas/job-manager-oas.yaml \
# -t ../oas/templates_client \
# -g python \
# --package-name build.job_manager_client \
# -o . \
# --global-property=apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
