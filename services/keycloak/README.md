# How to develop

For development, the following command can be executed in the `keycloak` directory:
```shell
docker run --rm -it -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -v $PWD/src/main/resources/theme/os4ml-theme:/opt/keycloak/themes/os4ml-theme quay.io/keycloak/keycloak:18.0.0 start-dev
```
