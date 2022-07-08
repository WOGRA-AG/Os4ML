from typing import NamedTuple

from components.util import build_component
from kfp.v2.dsl import Dataset, Input


def preprocess_data(
    dataframe: Input[Dataset],
) -> NamedTuple("Data", [("x", Dataset), ("y", Dataset)]):
    import re
    from collections import namedtuple

    import numpy as np
    import pandas as pd

    with open(dataframe.path, "r") as f:
        df = pd.read_csv(f)

    # example code from https://towardsdatascience.com/predicting-the-survival-of-titanic-passengers-30870ccc7e8
    df = df.drop(["PassengerId"], axis=1)
    deck = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "U": 8}
    df["Cabin"] = df["Cabin"].fillna("U0")
    df["Deck"] = df["Cabin"].map(
        lambda x: re.compile("([a-zA-Z]+)").search(x).group()
    )
    df["Deck"] = df["Deck"].map(deck).fillna(0).astype(int)
    df = df.drop(["Cabin"], axis=1)

    mean = df["Age"].mean()
    std = df["Age"].std()
    is_null = df["Age"].isnull().sum()
    # compute random numbers between the mean, std and is_null
    rand_age = np.random.randint(mean - std, mean + std, size=is_null)
    age_slice = df["Age"].copy()
    age_slice[np.isnan(age_slice)] = rand_age
    df["Age"] = age_slice.astype(int)

    common_value = "S"
    df["Embarked"] = df["Embarked"].fillna(common_value)

    df["Fare"] = df["Fare"].fillna(0).astype(int)

    titles = {"Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5}

    # extract titles
    df["Title"] = df.Name.str.extract(" ([A-Za-z]+)\.", expand=False)
    # replace titles with a more common title or as Rare
    df["Title"] = df["Title"].replace(
        [
            "Lady",
            "Countess",
            "Capt",
            "Col",
            "Don",
            "Dr",
            "Major",
            "Rev",
            "Sir",
            "Jonkheer",
            "Dona",
        ],
        "Rare",
    )
    df["Title"] = df["Title"].replace("Mlle", "Miss")
    df["Title"] = df["Title"].replace("Ms", "Miss")
    df["Title"] = df["Title"].replace("Mme", "Mrs")
    # convert titles into numbers
    df["Title"] = df["Title"].map(titles)
    # filling NaN with 0, to get safe
    df["Title"] = df["Title"].fillna(0)

    df = df.drop(["Name"], axis=1)

    genders = {"male": 0, "female": 1}
    df["Sex"] = df["Sex"].map(genders)

    df = df.drop(["Ticket"], axis=1)

    ports = {"S": 0, "C": 1, "Q": 2}
    df["Embarked"] = df["Embarked"].map(ports)

    df["relatives"] = df["SibSp"] + df["Parch"]

    # Create Categories
    df["Age"] = df["Age"].astype(int)
    df.loc[df["Age"] <= 11, "Age"] = 0
    df.loc[(df["Age"] > 11) & (df["Age"] <= 18), "Age"] = 1
    df.loc[(df["Age"] > 18) & (df["Age"] <= 22), "Age"] = 2
    df.loc[(df["Age"] > 22) & (df["Age"] <= 27), "Age"] = 3
    df.loc[(df["Age"] > 27) & (df["Age"] <= 33), "Age"] = 4
    df.loc[(df["Age"] > 33) & (df["Age"] <= 40), "Age"] = 5
    df.loc[(df["Age"] > 40) & (df["Age"] <= 66), "Age"] = 6
    df.loc[df["Age"] > 66, "Age"] = 6

    # Fare
    df.loc[df["Fare"] <= 7.91, "Fare"] = 0
    df.loc[(df["Fare"] > 7.91) & (df["Fare"] <= 14.454), "Fare"] = 1
    df.loc[(df["Fare"] > 14.454) & (df["Fare"] <= 31), "Fare"] = 2
    df.loc[(df["Fare"] > 31) & (df["Fare"] <= 99), "Fare"] = 3
    df.loc[(df["Fare"] > 99) & (df["Fare"] <= 250), "Fare"] = 4
    df.loc[df["Fare"] > 250, "Fare"] = 5
    df["Fare"] = df["Fare"].astype(int)

    df["Age_Class"] = df["Age"] * df["Pclass"]

    df["Fare_Per_Person"] = df["Fare"] / (df["relatives"] + 1)
    df["Fare_Per_Person"] = df["Fare_Per_Person"].astype(int)

    df_x = df.drop(["Survived"], axis=1)
    df_y = df["Survived"]

    output = namedtuple("Data", ["x", "y"])
    return output(df_x.to_csv(index=False), df_y.to_csv(index=False))


def main():
    build_component(
        preprocess_data,
        base_image="python:3.9.10-slim",
        file=__file__,
        packages_to_install=["pandas>=1.4.0"],
    )


if __name__ == "__main__":
    main()
