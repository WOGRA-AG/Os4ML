from kfp.v2.dsl import component, Input, Dataset, Metrics, \
    ClassificationMetrics, Output


def katib_solver(dataset_file: Input[Dataset],
                 databag_file: Input[Dataset],
                 cls_metrics: Output[ClassificationMetrics],
                 metrics: Output[Metrics]):
    from kubeflow.katib import KatibClient
    from kubernetes.client import V1ObjectMeta
    from kubeflow.katib import V1beta1Experiment
    from kubeflow.katib import V1beta1AlgorithmSpec
    from kubeflow.katib import V1beta1ObjectiveSpec
    from kubeflow.katib import V1beta1FeasibleSpace
    from kubeflow.katib import V1beta1ExperimentSpec
    from kubeflow.katib import V1beta1NasConfig
    from kubeflow.katib import V1beta1GraphConfig
    from kubeflow.katib import V1beta1Operation
    from kubeflow.katib import V1beta1ParameterSpec
    from kubeflow.katib import V1beta1TrialTemplate
    from kubeflow.katib import V1beta1TrialParameterSpec

    import json

    with open(databag_file.path) as file:
        databag = json.load(file)

    databag_info_url = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/' \
                       f'{databag["bucket_name"]}/object/databag.json'

    namespace = "os4ml"
    experiment_name = "enas-example"

    metadata = V1ObjectMeta(
        name=experiment_name,
        namespace=namespace
    )

    algorithm_spec = V1beta1AlgorithmSpec(
        algorithm_name="enas",
    )

    objective_spec = V1beta1ObjectiveSpec(
        type="maximize",
        goal=0.99,
        objective_metric_name="Validation-Accuracy",
    )

    nas_config = V1beta1NasConfig(
        graph_config=V1beta1GraphConfig(
            num_layers=8,
            input_sizes=[28, 28, 3],
            output_sizes=[10],
        ),
        operations=[
            V1beta1Operation(
                operation_type="convolution",
                parameters=[
                    V1beta1ParameterSpec(
                        name="filter_size",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["3", "5", "7"]),
                    ),
                    V1beta1ParameterSpec(
                        name="num_filter",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["32", "48", "64", "96", "128"]),
                    ),
                    V1beta1ParameterSpec(
                        name="stride",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["1", "2"]),
                    ),
                ]
            ),
            V1beta1Operation(
                operation_type="separable_convolution",
                parameters=[
                    V1beta1ParameterSpec(
                        name="filter_size",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["3", "5", "7"]),
                    ),
                    V1beta1ParameterSpec(
                        name="num_filter",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["32", "48", "64", "96", "128"]),
                    ),
                    V1beta1ParameterSpec(
                        name="stride",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["1", "2"]),
                    ),
                    V1beta1ParameterSpec(
                        name="depth_multiplier",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["1", "2"]),
                    ),
                ]
            ),
            V1beta1Operation(
                operation_type="depthwise_convolution",
                parameters=[
                    V1beta1ParameterSpec(
                        name="filter_size",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["3", "5", "7"]),
                    ),
                    V1beta1ParameterSpec(
                        name="stride",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["1", "2"]),
                    ),
                    V1beta1ParameterSpec(
                        name="depth_multiplier",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["1", "2"]),
                    ),
                ]
            ),
            V1beta1Operation(
                operation_type="reduction",
                parameters=[
                    V1beta1ParameterSpec(
                        name="reduction_type",
                        parameter_type="categorical",
                        feasible_space=V1beta1FeasibleSpace(list=["max_pooling", "avg_pooling"]),
                    ),
                    V1beta1ParameterSpec(
                        name="pool_size",
                        parameter_type="int",
                        feasible_space=V1beta1FeasibleSpace(min="2", max="3", step="1"),
                    )
                ]
            ),
        ]
    )

    trial_spec = {
        "apiVersion": "batch/v1",
        "kind": "Job",
        "spec": {
            "template": {
                "metadata": {
                    "annotations": {
                        "sidecar.istio.io/inject": "false"
                    }
                },
                "spec": {
                    "containers": [
                        {
                            "name": "training-container",
                            "image": "gitlab-registry.wogra.com/developer/wogra/os4ml/"
                                     "enas-trial:8c66edce",
                            "command": [
                                'python3 ',
                                '-u ',
                                'RunTrial.py '
                                '--architecture="${trialParameters.neuralNetworkArchitecture}" '
                                '--nn_config="${trialParameters.neuralNetworkConfig}" ',
                                '--databag_info_url=' + databag_info_url
                            ],
                            # Training container requires 1 GPU.
                            "resources": {
                                "limits": {
                                    "nvidia.com/gpu": 1
                                }
                            }
                        },
                    ],
                    "imagePullSecrets": [
                        {
                            "name": "registry-credentials"
                        }
                    ],
                    "restartPolicy": "Never"
                }
            }
        }
    }

    # Template with Trial parameters and Trial spec.
    # Set retain to True to save trial resources after completion.
    trial_template = V1beta1TrialTemplate(
        # retain=True,
        primary_container_name="training-container",
        trial_parameters=[
            V1beta1TrialParameterSpec(
                name="neuralNetworkArchitecture",
                description="NN architecture contains operations ID on each NN layer and skip connections between "
                            "layers",
                reference="architecture",
            ),
            V1beta1TrialParameterSpec(
                name="neuralNetworkConfig",
                description="Configuration contains NN number of layers, input and output sizes, description what each "
                            "operation ID means",
                reference="nn_config",
            ),
        ],
        trial_spec=trial_spec
    )

    # Experiment object.
    experiment = V1beta1Experiment(
        api_version="kubeflow.org/v1beta1",
        kind="Experiment",
        metadata=metadata,
        spec=V1beta1ExperimentSpec(
            parallel_trial_count=1,
            max_trial_count=10,
            max_failed_trial_count=1,
            objective=objective_spec,
            algorithm=algorithm_spec,
            nas_config=nas_config,
            trial_template=trial_template,
        )
    )

    # Create client.
    kclient = KatibClient()

    # Create your Experiment.
    kclient.create_experiment(experiment, namespace=namespace)


if __name__ == "__main__":
    component(katib_solver, base_image="python:3.10.2-slim",
              output_component_file="component.yaml",
              packages_to_install=["kubeflow-katib>=0.13.0"])
