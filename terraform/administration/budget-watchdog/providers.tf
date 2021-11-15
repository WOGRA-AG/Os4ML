data "google_client_config" "default" {}
/******************************************
  GA Provider configuration
 *****************************************/
provider "google" {
  impersonate_service_account = var.terraform_account
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
  impersonate_service_account = var.terraform_account
  project               = var.project
  region                = var.region
  zone                  = var.zone
  user_project_override = true
  billing_project       = var.project
}