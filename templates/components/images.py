import os
_tag = os.getenv("IMG_TAG", "latest")
python_image = f"gitlab-registry.wogra.com/developer/wogra/os4ml/python:{_tag}"
pandas_image = f"gitlab-registry.wogra.com/developer/wogra/os4ml/pandas:{_tag}"
ludwig_image = f"gitlab-registry.wogra.com/developer/wogra/os4ml/ludwig:{_tag}"
