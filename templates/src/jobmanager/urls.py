def get_solution_url(solution_name: str, os4ml_namespace: str) -> str:
    base_server_url = _get_base_server_url(os4ml_namespace)
    return (
        f"{base_server_url}/apis/v1beta1/jobmanager/solution/{solution_name}"
    )


def put_solution_url(solution_name: str, os4ml_namespace: str) -> str:
    base_server_url = _get_base_server_url(os4ml_namespace)
    return (
        f"{base_server_url}/apis/v1beta1/jobmanager/solution/{solution_name}"
    )


def _get_base_server_url(os4ml_namespace: str) -> str:
    return f"http://jobmanager.{os4ml_namespace}.svc.cluster.local:8000"
