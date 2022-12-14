import pandas as pd
from sklearn.metrics import confusion_matrix


def calculate_conf_matrix(y_true: pd.Series, y_pred: pd.Series, categories):
    y_true = y_true.astype(str)
    return confusion_matrix(y_true, y_pred, labels=categories).tolist()
