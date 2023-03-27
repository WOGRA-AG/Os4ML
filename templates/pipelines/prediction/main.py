from kfp.v2.dsl import pipeline

from pipelines.build import compile_pipeline, load_component

load_prediction_data_op = load_component("load_prediction_data")
load_model_op = load_component("load_model")
predict_op = load_component("predict")


@pipeline(name="prediction")
def prediction_pipeline(
    databag_id: str,
    solution_id: str,
    prediction_id: str,
):

    prediction_data = load_prediction_data_op(prediction_id=prediction_id)
    model = load_model_op(prediction_id=prediction_id)
    predict_op(
        prediction_id=prediction_id,
        prediction_data=prediction_data.output,
        model=model.output,
    )


def main():
    compile_pipeline(prediction_pipeline, file=__file__, node_pool='high-cpu')


if __name__ == "__main__":
    main()
