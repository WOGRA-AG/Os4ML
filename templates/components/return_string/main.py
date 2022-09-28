from kfp.v2.dsl import Dataset, Input, Output

from components.images import python_image
from components.util import build_component


def return_string(s: str) -> str:
    return s


def main():
    build_component(return_string, base_image=python_image, file=__file__)


if __name__ == "__main__":
    main()
