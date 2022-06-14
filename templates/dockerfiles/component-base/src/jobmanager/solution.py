from datetime import datetime
from typing import Dict

import requests
from src.util.date import FORMAT_STR


def status_update(solution_name: str, new_status: str) -> None:
    solution = get_solution(solution_name)
    solution["status"] = new_status
    put_solution(solution, solution_name)


def error_status_update(solution_name: str) -> None:
    solution = get_solution(solution_name)
    solution["status"] = "error"
    solution["completionTime"] = datetime.utcnow().strftime(FORMAT_STR)
    put_solution(solution, solution_name)


def get_solution(solution_name: str) -> Dict:
    url = f"http://os4ml-jobmanager.os4ml:8000/apis/v1beta1/jobmanager/solution/{solution_name}"
    return requests.get(url).json()


def put_solution(solution: Dict, solution_name: str) -> None:
    url = f"http://os4ml-jobmanager.os4ml:8000/apis/v1beta1/jobmanager/solution/{solution_name}"
    requests.put(url, json=solution)
