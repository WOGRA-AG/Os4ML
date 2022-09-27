import requests
import argparse
import io
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--output", required=True)
args = parser.parse_args()

backend = 'https://shepard.os4ml.wogra.com/shepard/api'
url = f'{backend}/files/16/payload/6332e13e7e8a77152c08b715'

api_key = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1ZDQxMTcwZi0xYjcxLTRiNmUtOGIyNi02MzFmMWEzMTA0M2UiLCJpc3MiOiJodHRwczovL3NoZXBhcmQub3M0bWwud29ncmEuY29tL3NoZXBhcmQvYXBpLyIsIm5iZiI6MTY2NDI4MTEyNCwiaWF0IjoxNjY0MjgxMTI0LCJqdGkiOiIzNzk3ZWE1ZS1hODgyLTQwYTgtYjlhMC04ZTMxMGFiNDE2MTkifQ.sr5KTrEHVThEmfIkbtLOFGYxscmb45v7PXthzCxHQ-tzQMoEB1r-qgRrXnRnymTjtFUh2XUGl6a72k7futj9b1eZbSnYnSfISK1USutlTrsAfN1pBcu5gVOOJrLCc7NFfX0lPAPLEfTJ1qAAFcngFEFOr9kJ3Tje57-18GPi8CWJxnpDCfI9ZCK-gWTT-Jx6FGNDT-9eBpUJyq7YcEBs-vReWwD4TvxstV_RlzR3kvHFqZOTzKlrsTaNk0SoVMZ--ZvJ72hZxKdVOA8okMAu-ltVKZL5mycy5Qw6kIO2Cdb6IW53atG4v88V5nlhSVfWZJHnM6LqPXEeP35pI7KUPg'
headers = {'x-api-key': api_key}

res = requests.get(url, headers=headers)
content = io.BytesIO(res.content)
df = pd.read_csv(content)
with open(args.output, 'w') as file:
    df.to_csv(file, index=False)
