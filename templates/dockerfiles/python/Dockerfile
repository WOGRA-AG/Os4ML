#syntax=docker/dockerfile:1.4
FROM alpine:latest as templates
COPY . /data/templates/

FROM gitlab-registry.wogra.com/developer/images/python:3.9.10-slim as production

COPY --from=templates /data/templates/src /src

