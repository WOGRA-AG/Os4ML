#syntax=docker/dockerfile:1.4
# copy os4ml source code
FROM gitlab-registry.wogra.com/developer/images/ludwig-gpu:cuda11.3-ludwig0.5.4 as production

COPY ./src /src

CMD ["python3"]
