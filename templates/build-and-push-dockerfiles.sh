tag=feature
DOCKER_BUILDKIT=1 docker build -f dockerfiles/python/Dockerfile --tag wogra/os4ml-python:$tag .

DOCKER_BUILDKIT=1 docker build -f dockerfiles/pandas/Dockerfile --tag wogra/os4ml-pandas:$tag .

DOCKER_BUILDKIT=1 docker build -f dockerfiles/ludwig/Dockerfile --tag wogra/os4ml-ludwig:$tag .

docker push wogra/os4ml-python:$tag
docker push wogra/os4ml-pandas:$tag
docker push wogra/os4ml-ludwig:$tag
