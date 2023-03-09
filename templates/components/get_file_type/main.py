from components.build import build_component
from components.images import python_image


def get_file_type(
    databag_id: str,
) -> str:
    from components.get_file_type import get_file_type

    return get_file_type(
        databag_id=databag_id,
    )


def main():
    build_component(
        get_file_type,
        base_image=python_image,
        file=__file__,
    )


if __name__ == "__main__":
    main()
