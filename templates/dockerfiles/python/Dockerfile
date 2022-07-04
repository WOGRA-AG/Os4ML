#syntax=docker/dockerfile:1.4
FROM alpine:latest as templates
COPY . /data/templates/

FROM python:3.8.9-slim as production

COPY --from=templates /data/templates/src /src

