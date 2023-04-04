import src.parser.impl.kubeflow
from src.parser.impl.kubeflow import (
    PipelineStep,
    get_node_selector_by_pipeline_step,
    get_node_toleration_by_pipeline_step,
)


def test_get_node_selector_by_pipeline_step(mocker):
    mocker.patch.object(
        src.parser.impl.kubeflow,
        "SOLVE_NODE_SELECTOR",
        '{"cloud.google.com/gke-nodepool":"gpu-pool"}',
    )

    obj = get_node_selector_by_pipeline_step(PipelineStep.SOLVE)
    assert obj == {"cloud.google.com/gke-nodepool": "gpu-pool"}


def test_get_node_toleration_by_pipeline_step(mocker):
    mocker.patch.object(
        src.parser.impl.kubeflow,
        "SOLVE_NODE_TOLERATION",
        '{"key":"nvidia.com/gpu","value":"present","operator":"Equal","effect":"NoSchedule"}',
    )

    obj = get_node_toleration_by_pipeline_step(PipelineStep.SOLVE)
    assert obj == [
        {
            "key": "nvidia.com/gpu",
            "value": "present",
            "operator": "Equal",
            "effect": "NoSchedule",
        }
    ]


def test_get_node_toleration_by_pipeline_step_with_list(mocker):
    mocker.patch.object(
        src.parser.impl.kubeflow,
        "SOLVE_NODE_TOLERATION",
        '[{"key":"nvidia.com/gpu","value":"present","operator":"Equal","effect":"NoSchedule"}]',
    )

    obj = get_node_toleration_by_pipeline_step(PipelineStep.SOLVE)
    assert obj == [
        {
            "key": "nvidia.com/gpu",
            "value": "present",
            "operator": "Equal",
            "effect": "NoSchedule",
        }
    ]
