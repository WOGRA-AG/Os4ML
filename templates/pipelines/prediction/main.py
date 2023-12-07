from kfp.v2.dsl import pipeline

from pipelines.build import compile_pipeline, load_component

predict_op = load_component("predict")


@pipeline(name="prediction")
def prediction_pipeline(
    databag_id: str,
    solution_id: str,
    prediction_id: str,
):

    predict_op(
        prediction_id=prediction_id,
    )


def main():
    compile_pipeline(prediction_pipeline, pipeline_file=__file__)


if __name__ == "__main__":
    main()
