#!/bin/sh

cp ./shared-oas.yaml ../job-manager/oas/
cp ./shared-oas.yaml ../objectstore-manager/oas/
cp ./objectstore-manager-oas.yaml ../job-manager/oas/
cp ./objectstore-manager-oas.yaml ../objectstore-manager/oas/
cp ./job-manager-oas.yaml ../job-manager/oas/
cp -r ./templates ../job-manager/oas
cp -r ./templates ../objectstore-manager/oas
cp -r ./templates_client ../objectstore-manager/oas
cp -r ./templates_client ../objectstore-manager/oas
