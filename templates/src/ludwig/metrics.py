from sklearn.metrics import confusion_matrix


def calculate_conf_matrix(pred, label, df_test, categories):
    prediction_key = next(iter(pred))
    y_pred = pred[prediction_key]
    y_true = df_test[label].astype(str)
    return confusion_matrix(y_true, y_pred, labels=categories).tolist()
