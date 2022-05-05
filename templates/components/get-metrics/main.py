from kfp.v2.dsl import Artifact, Input, Metrics, component


def get_metrics(metrics: Input[Metrics], solution_name: str = ''):
    import requests
    print(f'{metrics.metadata=}')
    if 'accuracy' in metrics.metadata:
        accuracy = metrics.metadata['accuracy']
        print(f'{accuracy=}')

        url = f"http://os4ml-jobmanager.os4ml:8000/apis/v1beta1/jobmanager/solution/{solution_name}"
        response = requests.get(url)
        print(f'{response.status_code=}')

        solution = response.json()
        print(f'{solution=}')

        solution['metrics']['accuracy'] = accuracy

        solution = requests.put(url, data=solution)
        print(f'{solution=}')


if __name__ == "__main__":
    component(
        get_metrics,
        base_image="python:3.10.2-slim",
        output_component_file="component.yaml",
    )
