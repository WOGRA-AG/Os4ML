import argparse
import enum
import pathlib
import zipfile
from typing import BinaryIO

import pandas as pd
import requests
from keras.preprocessing.image import ImageDataGenerator
from tensorflow import keras
from tensorflow.python.keras.utils.multi_gpu_utils import multi_gpu_model
from PIL import Image

from ModelConstructor import ModelConstructor

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='TrainingContainer')
    parser.add_argument('--architecture', type=str, default="", metavar='N',
                        help='architecture of the neural network')
    parser.add_argument('--nn_config', type=str, default="", metavar='N',
                        help='configurations and search space embeddings')
    parser.add_argument('--num_epochs', type=int, default=10, metavar='N',
                        help='number of epoches that each child will be trained')
    parser.add_argument('--num_gpus', type=int, default=1, metavar='N',
                        help='number of GPU that used for training')
    parser.add_argument('--batch_size', type=int, default=64, metavar='N',
                        help='sizes of the batches on which are trained')
    parser.add_argument('--databag_info_url', type=str, metavar='N',
                        help='url for the databag info file')
    args = parser.parse_args()

    arch = args.architecture.replace("\'", "\"")
    print(">>> arch received by trial")
    print(arch)

    nn_config = args.nn_config.replace("\'", "\"")
    print(">>> nn_config received by trial")
    print(nn_config)

    num_epochs = args.num_epochs
    print(">>> num_epochs received by trial")
    print(num_epochs)

    num_gpus = args.num_gpus
    print(">>> num_gpus received by trial:")
    print(num_gpus)

    batch_size = args.batch_size
    print(">>> batch_size received by trial:")
    print(batch_size)

    databag_info_url = args.databag_info_url
    print(">>> image databag_info_url received by trial:")
    print(databag_info_url)

    print("\n>>> Constructing Model...")
    constructor = ModelConstructor(arch, nn_config)
    test_model = constructor.build_model()
    print(">>> Model Constructed Successfully\n")

    if num_gpus > 1:
        test_model = multi_gpu_model(test_model, gpus=num_gpus)

    test_model.summary()
    test_model.compile(loss=keras.losses.categorical_crossentropy,
                       optimizer=keras.optimizers.Adam(learning_rate=1e-3, decay=1e-4),
                       metrics=['accuracy'])


    class DatabagTypes(str, enum.Enum):
        local_file = 'local_file'
        zip_file = 'zip_file'


    def download_file(url: str, output_file: BinaryIO, chunk_size=128) -> None:
        response = requests.get(url, stream=True)
        for chunk in response.iter_content(chunk_size=chunk_size):
            output_file.write(chunk)


    def download_zip(output):
        bucket = databag['bucket_name']
        file_name = databag['file_name']
        url = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}'
        with open(output, 'wb') as file:
            download_file(url, file)


    def path_to_absolute(rel_path: str):
        rel = pathlib.Path(rel_path)
        return str(rel.resolve())


    response = requests.get(databag_info_url)
    databag = response.json()

    if databag['dataset_type'] == DatabagTypes.zip_file:
        zip_file = 'dataset.zip'
        download_zip(zip_file)
        with zipfile.ZipFile(zip_file) as ds_zip:
            ds_zip.extractall()
            root_dir = next(zipfile.Path(ds_zip).iterdir()).name
    else:
        raise NotImplementedError()

    dataset_url = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{databag["bucket_name"]}/' \
                  f'object/dataset'
    dataset = pd.read_csv(dataset_url)
    dataset['label'] = dataset['label'].astype(str)
    dataset['file'] = dataset['file'].map(path_to_absolute)

    test_img = dataset.sample(1)['file'].iloc[0]
    image_size = Image.open(test_img).size

    augmentation = ImageDataGenerator(validation_split=0.2)

    train_data_flow = augmentation.flow_from_dataframe(
        dataset,
        directory=root_dir,
        x_col='file',
        y_col='label',
        target_size=image_size,
        batch_size=batch_size,
        shuffle=True,
        seed=42,
        subset='training',
    )

    val_data_flow = augmentation.flow_from_dataframe(
        dataset,
        directory=root_dir,
        x_col='file',
        y_col='label',
        target_size=image_size,
        batch_size=batch_size,
        shuffle=True,
        seed=42,
        subset='validation',
    )

    print(">>> Data Loaded. Training starts.")
    for e in range(num_epochs):
        print(f"\nTotal Epoch {e + 1}/{num_epochs}")
        history = test_model.fit(train_data_flow,
                                 epochs=1, verbose=1,
                                 validation_data=val_data_flow)
        print(f"Training-Accuracy={history.history['accuracy'][-1]}")
        print(f"Training-Loss={history.history['loss'][-1]}")
        print(f"Validation-Accuracy={history.history['val_accuracy'][-1]}")
        print(f"Validation-Loss={history.history['val_loss'][-1]}")
