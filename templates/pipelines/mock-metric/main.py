from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import pipeline

from templates.pipelines.util import load_component

get_metrics_op = load_component('get-metrics')
mock_metric_op = load_component('mock-metric')


@pipeline(name="mock-metric")
def mock_metric():
    metrics = mock_metric_op()
    get_metrics_op(metrics.outputs['metrics'])


if __name__ == "__main__":
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(
        mock_metric, "pipeline.yaml")
