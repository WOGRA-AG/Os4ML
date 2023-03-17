import requests
import argparse
import io
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--output", required=True)
args = parser.parse_args()

backend = 'https://shepard.os4ml.wogra.com/shepard/api'
url = f'{backend}/files/16/payload/6332e13e7e8a77152c08b715'

api_key = 'SHEPARD_API_KEY'
headers = {'x-api-key': api_key}

res = requests.get(url, headers=headers)
content = io.BytesIO(res.content)
df = pd.read_csv(content)
df.to_pickle(args.output)