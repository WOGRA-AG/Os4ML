import argparse
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--output", required=True)
args = parser.parse_args()

url = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
df = pd.read_csv(url)
df.to_pickle(args.output)
