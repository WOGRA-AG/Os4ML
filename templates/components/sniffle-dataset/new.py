from kfp.v2.dsl import Dataset, Input, Metrics, component

from components.images import component_base_img


def sniffle_dataset(
    dataset: Input[Dataset],
    dataset_type: str = "local_file",
    max_categories: int = 10,
    file_name: str = "",
    bucket_name: str = "",
    solution_name: str = "",
) -> Dataset:
    from src.components.sniffle_dataset import sniffle_dataset

    return sniffle_dataset(
        dataset,
        dataset_type,
        max_categories,
        file_name,
        bucket_name,
        solution_name=solution_name,
    )


if __name__ == "__main__":
    component(
        sniffle_dataset,
        base_image=component_base_img,
        output_component_file="component.yaml",
    )
