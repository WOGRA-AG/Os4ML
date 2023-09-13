#!/bin/sh

if [[ "$PWD" != *os4ml/services/oas ]]
then
  echo 'run from the os4ml/services/oas dir'
  exit 1
fi

cp -r . ../objectstore-manager/oas/
cp -r . ../job-manager/oas/
cp -r . ../model-manager/oas/
cp -r . ../workflow-translator/oas/
cp -r . ../../templates/oas/
