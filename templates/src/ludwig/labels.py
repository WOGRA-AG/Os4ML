def get_label_name(model_definition):
    return model_definition["output_features"][0]["name"]


def get_all_label_values(dataset, label):
    return dataset[label].unique().astype(str)
