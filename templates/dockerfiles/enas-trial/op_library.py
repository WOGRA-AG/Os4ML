import numpy as np
from keras import backend as K
from keras.layers import Conv2D, ZeroPadding2D, concatenate, MaxPooling2D, \
    AveragePooling2D, Activation, BatchNormalization, SeparableConv2D, DepthwiseConv2D


def concat(inputs):
    n = len(inputs)
    if n == 1:
        return inputs[0]

    total_dim = list()
    for x in inputs:
        total_dim.append(K.int_shape(x))
    total_dim = np.asarray(total_dim)
    max_dim = max(total_dim[:, 1])

    padded_input = [0 for _ in range(n)]

    for i in range(n):
        if total_dim[i][1] < max_dim:
            diff = max_dim - total_dim[i][1]
            half_diff = int(diff / 2)
            if diff % 2 == 0:
                padded_input[i] = ZeroPadding2D(padding=(half_diff, half_diff))(inputs[i])
            else:
                padded_input[i] = ZeroPadding2D(padding=((half_diff, half_diff + 1),
                                                         (half_diff, half_diff + 1)))(inputs[i])
        else:
            padded_input[i] = inputs[i]

    result = concatenate(inputs=padded_input, axis=-1)
    return result


def conv(x, config):
    parameters = {
        "num_filter": 64,
        "filter_size": 3,
        "stride": 1,
    }
    for k in parameters.keys():
        if k in config:
            parameters[k] = int(config[k])

    activated = Activation('relu')(x)

    conved = Conv2D(
        filters=parameters['num_filter'],
        kernel_size=parameters['filter_size'],
        strides=parameters['stride'],
        padding='same')(activated)

    result = BatchNormalization()(conved)

    return result


def sp_conv(x, config):
    parameters = {
        "num_filter": 64,
        "filter_size": 3,
        "stride": 1,
        "depth_multiplier": 1,
    }

    for k in parameters.keys():
        if k in config:
            parameters[k] = int(config[k])

    activated = Activation('relu')(x)

    conved = SeparableConv2D(
        filters=parameters['num_filter'],
        kernel_size=parameters['filter_size'],
        strides=parameters['stride'],
        depth_multiplier=parameters['depth_multiplier'],
        padding='same')(activated)

    result = BatchNormalization()(conved)

    return result


def dw_conv(x, config):
    parameters = {
        "filter_size": 3,
        "stride": 1,
        "depth_multiplier": 1,
    }
    for k in parameters.keys():
        if k in config:
            parameters[k] = int(config[k])

    activated = Activation('relu')(x)

    conved = DepthwiseConv2D(
        kernel_size=parameters['filter_size'],
        strides=parameters['stride'],
        depth_multiplier=parameters['depth_multiplier'],
        padding='same')(activated)

    result = BatchNormalization()(conved)

    return result


def reduction(x, config):
    # handle the extreme case where the input has the dimension 1 by 1 and is not reducible
    # we will just change the reduction layer to identity layer
    # such situation is very likely to appear though
    dim = K.int_shape(x)
    if dim[1] == 1 or dim[2] == 1:
        print("WARNING: One or more dimensions of the input of the reduction layer is 1. It cannot be further reduced. "
              "A identity layer will be used instead.")
        return x

    parameters = {
        'reduction_type': "max_pooling",
        'pool_size': 2,
        'stride': None,
    }

    if 'reduction_type' in config:
        parameters['reduction_type'] = config['reduction_type']
    if 'pool_size' in config:
        parameters['pool_size'] = int(config['pool_size'])
    if 'stride' in config:
        parameters['stride'] = int(config['stride'])

    if parameters['reduction_type'] == 'max_pooling':
        result = MaxPooling2D(
            pool_size=parameters['pool_size'],
            strides=parameters['stride']
        )(x)
    elif parameters['reduction_type'] == 'avg_pooling':
        result = AveragePooling2D(
            pool_size=parameters['pool_size'],
            strides=parameters['stride']
        )(x)
    else:
        raise ValueError(f'Unknown reduction type in config: {parameters["reduction_type"]}')

    return result
