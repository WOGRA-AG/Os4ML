tag=feature
docker build -f dockerfiles/python/Dockerfile --tag gitlab-registry.wogra.com/developer/wogra/os4ml/python:$tag .

docker build -f dockerfiles/pandas/Dockerfile --tag gitlab-registry.wogra.com/developer/wogra/os4ml/pandas:$tag .

#docker build -f dockerfiles/ludwig/Dockerfile --tag gitlab-registry.wogra.com/developer/wogra/os4ml/ludwig:$tag .

docker push gitlab-registry.wogra.com/developer/wogra/os4ml/python:$tag
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/pandas:$tag
#docker push gitlab-registry.wogra.com/developer/wogra/os4ml/ludwig:$tag
