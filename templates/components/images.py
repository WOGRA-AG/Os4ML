import os

default_tag = "feature"
_tag = os.getenv("IMG_TAG", default_tag)
if _tag == "":
    _tag = default_tag
python_image = f"wogra/os4ml-python:{_tag}"
pandas_image = f"wogra/os4ml-pandas:{_tag}"
ludwig_image = f"wogra/os4ml-ludwig:{_tag}"
