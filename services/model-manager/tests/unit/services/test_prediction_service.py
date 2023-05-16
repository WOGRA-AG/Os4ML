import base64
import uuid
from datetime import datetime
from typing import Any
from unittest.mock import Mock

import pytest
from pytest_mock import MockerFixture

from build.job_manager_client.models import RunParams
from build.objectstore_client.exceptions import NotFoundException
from build.objectstore_client.models import JsonResponse
from build.openapi_server.models.prediction import Prediction
from build.openapi_server.models.solution import Solution
from exceptions import (
    IdUpdateNotAllowedException,
    ModelNotFoundException,
    ResourceNotFoundException,
)
from services import DATE_FORMAT_STR
from services.prediction_service import PredictionSerivce
from services.solution_service import SolutionService


def test_messaging_service_mock(prediction_service: PredictionSerivce):
    assert isinstance(
        prediction_service.messaging_service._listen_to_channel(), Mock
    )
    p = PredictionSerivce()
    assert isinstance(p.messaging_service._listen_to_channel(), Mock)


def test_uses_same_messaging_service():
    p1 = PredictionSerivce()
    p2 = PredictionSerivce()
    assert p1.messaging_service == p2.messaging_service


def test_get_file_name(
    prediction_service: PredictionSerivce, mocker: MockerFixture
):
    solution = mocker.Mock(id="solution_id", databag_id="databag_id")
    prediction = mocker.Mock(id="prediction_id")
    file_name = prediction_service.get_file_name(
        prediction, "file.csv", solution=solution
    )
    assert file_name == "databag_id/solution_id/prediction_id/file.csv"


def test_get_file_name_without_solution(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    mocker: MockerFixture,
):
    solution = Solution(id="solution_id", databag_id="databag_id")
    prediction = Prediction(id="prediction_id")
    mocker.patch.object(
        solution_service, "get_solution_by_id", return_value=solution
    )
    file_name = prediction_service.get_file_name(prediction, "file.csv")
    assert file_name == "databag_id/solution_id/prediction_id/file.csv"


def test_config_file_name(prediction_service: PredictionSerivce):
    assert prediction_service.config_file_name == "prediction.json"


def test_model_name(prediction_service: PredictionSerivce):
    assert prediction_service.model_name == "Prediction"


def test_build_model(
    prediction_service: PredictionSerivce,
    prediction_dict: dict[str, Any],
):
    prediction = prediction_service.build_model(prediction_dict)
    assert prediction.id == "prediction_id"
    assert prediction.name == "prediction"
    assert prediction.solution_id == "solution_id"
    assert prediction.run_id == "run_id"


def test_create_prediction(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    solution: Solution,
    jobmanager: Mock,
    messaging_service: Mock,
    mocker: MockerFixture,
):
    prediction = Prediction(
        id="prediction_id", name="prediction", solution_id="solution_id"
    )
    mocker.patch.object(
        solution_service, "get_solution_by_id", return_value=solution
    )

    create_run = mocker.Mock(return_value="run_id")
    mocker.patch.object(jobmanager, "create_run_by_solver_name", create_run)

    publish_mock = mocker.Mock(return_value=None)
    mocker.patch.object(messaging_service, "publish", publish_mock)

    prediction = prediction_service.create_prediction(prediction, usertoken="")

    assert prediction.id == "prediction_id"
    assert (
        datetime.strptime(prediction.creation_time, DATE_FORMAT_STR).date()
        == datetime.today().date()
    )
    assert prediction.run_id == "run_id"

    run_params = RunParams(prediction_id="prediction_id")
    create_run.assert_called_once_with(
        "prediction", run_params=run_params, usertoken=""
    )
    publish_mock.assert_called_once_with("default")


def test_get_predictions(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    solution: Solution,
    objectstore: Mock,
    mocker: MockerFixture,
):
    objectstore.get_objects_with_prefix = mocker.Mock(
        return_value=[
            "file.txt",
            "pred1/prediction.json",
            "pred2/prediction.json",
            "other/file.csv",
        ]
    )
    pred1_str = '{"id": "prediction_id", "name": null, "status": null, "creation_time": null, "completion_time": null, "solution_id": "solution_id", "run_id": null}'
    pred2_str = '{"id": "prediction2_id", "solution_id": "solution2_id"}'
    pred1 = JsonResponse(
        json_content=base64.encodebytes(pred1_str.encode()).decode()
    )
    pred2 = JsonResponse(
        json_content=base64.encodebytes(pred2_str.encode()).decode()
    )
    objectstore.get_json_object_by_name = mocker.Mock(
        side_effect=[pred1, pred2]
    )

    get_solution = mocker.Mock(return_value=solution)
    mocker.patch.object(solution_service, "get_solution_by_id", get_solution)

    pred1, pred2 = prediction_service.get_predictions(usertoken="")

    assert pred1.id == "prediction_id"
    assert pred1.solution_id == "solution_id"
    assert pred1.run_id is None
    assert pred2.id == "prediction2_id"
    assert pred2.solution_id == "solution2_id"
    assert pred2.run_id is None


def test_get_prediction_by_id(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    solution: Solution,
    objectstore: Mock,
    mocker: MockerFixture,
):
    objectstore.get_objects_with_prefix.return_value = [
        "file.txt",
        "pred1/prediction.json",
        "pred2/prediction.json",
        "other/file.csv",
    ]
    pred1_str = '{"id": "prediction_id", "name": null, "status": null, "creation_time": null, "completion_time": null, "solution_id": "solution_id", "run_id": null}'
    pred2_str = '{"id": "prediction2_id", "solution_id": "solution2_id"}'
    pred1 = JsonResponse(
        json_content=base64.encodebytes(pred1_str.encode()).decode()
    )
    pred2 = JsonResponse(
        json_content=base64.encodebytes(pred2_str.encode()).decode()
    )
    objectstore.get_json_object_by_name.side_effect = [pred1, pred2]

    get_solution = mocker.Mock(return_value=solution)
    mocker.patch.object(solution_service, "get_solution_by_id", get_solution)

    pred = prediction_service.get_prediction_by_id(
        "prediction_id", usertoken=""
    )

    assert pred.id == "prediction_id"
    assert pred.solution_id == "solution_id"


def test_get_prediction_by_id_raises_not_found(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
):
    objectstore.get_objects_with_prefix = mocker.Mock(
        return_value=[
            "file.txt",
            "pred1/prediction.json",
            "pred2/prediction.json",
            "other/file.csv",
        ]
    )
    pred1_str = '{"id": "prediction_id", "name": null, "status": null, "creation_time": null, "completion_time": null, "solution_id": "solution_id", "run_id": null}'
    pred2_str = '{"id": "prediction2_id", "solution_id": "solution2_id"}'
    pred1 = JsonResponse(
        json_content=base64.encodebytes(pred1_str.encode()).decode()
    )
    pred2 = JsonResponse(
        json_content=base64.encodebytes(pred2_str.encode()).decode()
    )
    objectstore.get_json_object_by_name = mocker.Mock(
        side_effect=[pred1, pred2]
    )

    with pytest.raises(ResourceNotFoundException):
        prediction_service.get_prediction_by_id("does_not_exist", usertoken="")


def test_update_prediction_by_id(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
    prediction: Prediction,
    messaging_service: Mock,
    solution: Solution,
    solution_service: SolutionService,
):
    prediction.name = "updated_name"

    get_solution = mocker.Mock(return_value=solution)
    mocker.patch.object(solution_service, "get_solution_by_id", get_solution)

    publish_mock = mocker.Mock(return_value=None)
    messaging_service.publish = publish_mock

    put_mock = mocker.Mock()
    objectstore.put_object_by_name = put_mock

    get_url_mock = mocker.Mock()
    objectstore.get_presigned_get_url = get_url_mock

    prediction = prediction_service.update_prediction_by_id(
        "prediction_id", prediction, usertoken=""
    )

    assert prediction.name == "updated_name"
    get_solution.assert_called_with("solution_id", usertoken="")
    assert get_solution.call_count == 3
    publish_mock.assert_called_once_with("default")
    put_mock.assert_called_once()
    assert get_url_mock.call_count == 2


def test_update_prediction_by_id_id_update(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
    prediction: Prediction,
):
    with pytest.raises(IdUpdateNotAllowedException):
        prediction_service.update_prediction_by_id(
            "id_updated", prediction, usertoken=""
        )


def test_delete_prediction_by_id(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
    prediction: Prediction,
    messaging_service: Mock,
    solution: Solution,
    solution_service: SolutionService,
):
    mocker.patch.object(
        prediction_service, "get_model_by_id", return_value=prediction
    )
    mocker.patch.object(prediction_service, "get_file_name", return_value="")

    terminate_run = mocker.Mock()
    mocker.patch.object(
        prediction_service, "terminate_run_for_model", terminate_run
    )

    delete_objects = mocker.Mock()
    mocker.patch.object(
        objectstore, "delete_objects_with_prefix", delete_objects
    )

    publish_mock = mocker.Mock()
    mocker.patch.object(messaging_service, "publish", publish_mock)

    prediction_service.delete_prediction_by_id("prediction_id", usertoken="")

    terminate_run.assert_called_once_with(prediction, usertoken="")
    delete_objects.assert_called_once()
    publish_mock.assert_called_once_with("default")


def test_delete_prediction_by_id_not_found(
    prediction_service: PredictionSerivce,
    mocker: MockerFixture,
):

    mocker.patch.object(
        prediction_service,
        "get_model_by_id",
        side_effect=ModelNotFoundException("", ""),
    )

    prediction_service.delete_prediction_by_id("does_not_exist", usertoken="")


def test_update_get_urls(
    prediction_service: PredictionSerivce,
    prediction: Prediction,
    objectstore: Mock,
    mocker: MockerFixture,
):

    mocker.patch.object(prediction_service, "get_file_name")
    objectstore.get_presigned_get_url.side_effect = ["url1", "url2"]

    prediction_ret = prediction_service.update_get_urls(
        prediction, usertoken=""
    )

    assert prediction_ret.data_url == "url1"
    assert prediction_ret.result_url == "url2"


def test_update_get_urls_not_present(
    prediction_service: PredictionSerivce,
    prediction: Prediction,
    objectstore: Mock,
    mocker: MockerFixture,
):
    mocker.patch.object(prediction_service, "get_file_name")
    objectstore.get_presigned_get_url.side_effect = NotFoundException()

    prediction_ret = prediction_service.update_get_urls(
        prediction, usertoken=""
    )

    assert prediction_ret.data_url is None
    assert prediction_ret.result_url is None


def test_get_prediction_data_put_url(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    objectstore: Mock,
    mocker: MockerFixture,
    equal_mock: Mock,
):
    mocker.patch.object(
        solution_service, "get_solution_by_id", return_value=None
    )
    file_name_mock = mocker.Mock(return_value="file/name/test")
    mocker.patch.object(prediction_service, "get_file_name", file_name_mock)
    objectstore.get_presigned_put_url.return_value = "url"

    url_and_prediction_id = prediction_service.get_prediction_data_put_url(
        "solution_id", "prediction_data.csv", usertoken=""
    )

    uuid.UUID(url_and_prediction_id.prediction_id)
    file_name_mock.assert_called_once_with(
        equal_mock, "prediction_data.csv", usertoken="", solution=None
    )
    assert url_and_prediction_id.url == "url"


def test_get_prediction_result_put_url(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    prediction: Prediction,
    mocker: MockerFixture,
):
    mocker.patch.object(
        prediction_service, "get_model_by_id", return_value=None
    )

    file_name_mock = mocker.Mock(return_value="file/name/test")
    mocker.patch.object(prediction_service, "get_file_name", file_name_mock)

    objectstore.get_presigned_put_url.return_value = "url"

    url = prediction_service.get_prediction_result_put_url(
        "prediction_id", usertoken=""
    )

    file_name_mock.assert_called_once_with(
        None, "prediction_result.csv", usertoken=""
    )
    assert url == "url"
