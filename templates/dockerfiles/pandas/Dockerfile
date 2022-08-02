FROM gitlab-registry.wogra.com/developer/images/python:3.9.10-slim as production

COPY dockerfiles/pandas/requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

COPY ./src /src

