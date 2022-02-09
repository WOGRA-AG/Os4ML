from os import remove
from typing import NamedTuple

from kfp.compiler import Compiler
from kfp.dsl import PipelineExecutionMode
from kfp.v2.dsl import component, Output, Dataset, pipeline, Input, ClassificationMetrics, Metrics


@component()
def dummy_component() -> NamedTuple("Data", [('x', Dataset), ('y', Dataset)]):
    from collections import namedtuple
    outputs = namedtuple("Data", ["x", "y"])
    return outputs("", "")


@component(base_image="python:3.9.10-slim",
           output_component_file="component.yaml",
           packages_to_install=["pandas>=1.4.0", "scikit-learn>=1.0.2"])
def train_random_forest(data_x: Input[Dataset], data_y: Input[Dataset], class_metrics: Output[ClassificationMetrics],
                        metrics: Output[Metrics]) -> float:
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import confusion_matrix

    random_state = 42
    with open(data_x.path, 'r') as f:
        df_x = pd.read_csv(f)
    with open(data_y.path, 'r') as f:
        df_y = pd.read_csv(f)
    x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.33, random_state=random_state)
    clf = RandomForestClassifier(n_estimators=100, random_state=random_state)
    clf.fit(x_train, y_train)
    score = clf.score(x_test, y_test) * 100
    y_pred = clf.predict(x_test)
    conf_matrix = confusion_matrix(y_test, y_pred).tolist()
    class_metrics.log_confusion_matrix(["Died", "Survived"], conf_matrix)
    metrics.log_metric("accuracy", score)
    return score


@pipeline(name="train-random-forest")
def pipeline():
    dummy_task = dummy_component()
    task = train_random_forest(dummy_task.outputs["x"], dummy_task.outputs["y"])


if __name__ == "__main__":
    file_name = "pipeline.yaml"
    Compiler(mode=PipelineExecutionMode.V2_COMPATIBLE).compile(pipeline_func=pipeline, package_path=file_name)
    remove(file_name)