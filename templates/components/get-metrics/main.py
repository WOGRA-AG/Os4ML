from kfp.v2.dsl import component, Artifact, Input, Metrics


def get_metrics(metrics: Input[Metrics]):
    print(metrics.metadata)


if __name__ == '__main__':
    component(get_metrics, base_image='python:3.10.2-slim',
              output_component_file='component.yaml')
