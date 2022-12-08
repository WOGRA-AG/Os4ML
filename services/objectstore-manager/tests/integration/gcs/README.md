# How to run gcs tests locally

To run the tests locally, you must authenticate as a service account (setting the application default credentials with your user account is not enough):

https://cloud.google.com/docs/authentication#service-accounts

For example, download the credential.json-file and set the env `GOOGLE_APPLICATION_CREDENTIALS` to the path of the downloaded file.