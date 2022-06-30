#syntax=docker/dockerfile:1.4
FROM alpine:latest as templates
COPY . /data/templates/

FROM python:3.8.9-slim

COPY requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

COPY --from=templates /data/templates/src /src

