# set project for the provider as a whole to avoid having to repeat it for each resource
provider "google" {
  credentials           = file("gcp-terraform-cred.json")
  project               = var.project
  region                = var.region
  zone                  = var.zone
  user_project_override = true
  billing_project       = var.project
}