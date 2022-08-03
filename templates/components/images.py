import os

default_tag = "test-dennis"
_tag = os.getenv("IMG_TAG", default_tag)
if _tag == "":
    _tag = default_tag
python_image = f"gitlab-registry.wogra.com/developer/wogra/os4ml/python:{_tag}"
pandas_image = f"gitlab-registry.wogra.com/developer/wogra/os4ml/pandas:{_tag}"
ludwig_image = f"gitlab-registry.wogra.com/developer/wogra/os4ml/ludwig:{_tag}"
