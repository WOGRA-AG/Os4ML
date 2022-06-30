tag=test-dennis1
cd python || exit 1
docker buildx build -f Dockerfile --tag gitlab-registry.wogra.com/developer/wogra/os4ml/python:$tag \
--build-arg BUILDKIT_INLINE_CACHE=1 --build-context templates="../../" "."

cd ../pandas || exit 1
docker buildx build -f Dockerfile --tag gitlab-registry.wogra.com/developer/wogra/os4ml/pandas:$tag \
--build-arg BUILDKIT_INLINE_CACHE=1 --build-context templates="../../" "."

cd ../ludwig || exit 1
docker buildx build -f Dockerfile --tag gitlab-registry.wogra.com/developer/wogra/os4ml/ludwig:$tag \
--build-arg BUILDKIT_INLINE_CACHE=1 --build-context templates="../../" "."

cd .. || exit 1
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/python:$tag
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/pandas:$tag
docker push gitlab-registry.wogra.com/developer/wogra/os4ml/ludwig:$tag
