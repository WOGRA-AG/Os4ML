#!/bin/sh

cd oas && ./distribute_oas.sh
cd ..

cd job-manager && ./openapi.sh
cd ..

cd model-manager && ./openapi.sh
cd ..

cd objectstore-manager && ./openapi.sh
cd ..

cd workflow-translator && ./openapi.sh
cd ..

cd ../templates && ./openapi.sh