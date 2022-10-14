#!/bin/sh

cp ./shared-oas.yaml ../job-manager/oas/
cp ./job-manager-oas.yaml ../job-manager/oas/
cp ./objectstore-manager-oas.yaml ../job-manager/oas/
cp -r ./templates ../job-manager/oas/
cp -r ./templates_client ../job-manager/oas/

cp ./shared-oas.yaml ../objectstore-manager/oas/
cp ./objectstore-manager-oas.yaml ../objectstore-manager/oas/
cp ./job-manager-oas.yaml ../objectstore-manager/oas/
cp -r ./templates ../objectstore-manager/oas/
cp -r ./templates_client ../objectstore-manager/oas/

cp ./shared-oas.yaml ../model-manager/oas/
cp ./objectstore-manager-oas.yaml ../model-manager/oas/
cp ./job-manager-oas.yaml ../model-manager/oas/
cp ./model-manager-oas.yaml ../model-manager/oas/
cp -r ./templates ../model-manager/oas/
cp -r ./templates_client ../model-manager/oas/

cp ./shared-oas.yaml ../../templates/oas/
cp ./job-manager-oas.yaml ../../templates/oas/
cp ./objectstore-manager-oas.yaml ../../templates/oas/
cp ./model-manager-oas.yaml ../../templates/oas/
cp -r ./templates_client ../../templates/oas/
