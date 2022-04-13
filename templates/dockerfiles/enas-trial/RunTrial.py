import argparse
import enum
import json
import zipfile
from typing import BinaryIO

import pandas as pd
import requests
from keras.preprocessing.image import ImageDataGenerator
from tensorflow import keras
from tensorflow.python.keras.utils.multi_gpu_utils import multi_gpu_model

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
        bucket = settings['bucketName']
        file_name = settings['fileName']
        url = f'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1/objectstore/{bucket}/object/{file_name}'
        with open(output, 'wb') as file:
            download_file(url, file)


    databag_filename = 'databag.json'
    with open(databag_filename, 'wb') as file:
        download_file(databag_info_url, file)
        settings = json.load(file)

    if settings['datasetType'] == DatabagTypes.zip_file:
        zip_file = 'dataset.zip'
        download_zip(zip_file)
        with zipfile.ZipFile(zip_file) as ds_zip:
            ds_zip.extractall()
            root_dir = next(zipfile.Path(ds_zip).iterdir()).name
    else:
        raise NotImplementedError()

    with open(zip_file, 'r') as input_file:
        dataset = pd.read_csv(input_file)

    # TODO infer real image size
    image_size = (32, 32)
    train_len = settings['numberRows']

    augmentation = ImageDataGenerator(
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        validation_split=0.2,
    )

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
        print("\nTotal Epoch {}/{}".format(e + 1, num_epochs))
        history = test_model.fit(train_data_flow,
                                 steps_per_epoch=int(train_len / batch_size) + 1,
                                 epochs=1, verbose=1,
                                 validation_data=val_data_flow)
        print("Training-Accuracy={}".format(history.history['accuracy'][-1]))
        print("Training-Loss={}".format(history.history['loss'][-1]))
        print("Validation-Accuracy={}".format(history.history['val_accuracy'][-1]))
        print("Validation-Loss={}".format(history.history['val_loss'][-1]))
