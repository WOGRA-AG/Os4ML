# set project for the provider as a whole to avoid having to repeat it for each resource
provider "google" {
  alias = "tokengen"
}

data "google_client_config" "default" {
  provider = google.tokengen
}
data "google_service_account_access_token" "sa" {
  provider               = google.tokengen
  target_service_account = "terraform@${var.project}.iam.gserviceaccount.com"
  lifetime               = "600s"
  scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
  ]
}
/******************************************
  GA Provider configuration
 *****************************************/
provider "google" {
  access_token          = data.google_service_account_access_token.sa.access_token
  project               = var.project
  region                = var.region
  zone                  = var.zone
  user_project_override = true
  billing_project       = var.project
}
/******************************************
  Beta Provider configuration
 *****************************************/
provider "google-beta" {
  access_token          = data.google_service_account_access_token.sa.access_token
  project               = var.project
  region                = var.region
  zone                  = var.zone
  user_project_override = true
  billing_project       = var.project
}