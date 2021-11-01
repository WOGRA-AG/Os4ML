module "project-services" {
  source  = "terraform-google-modules/project-factory/google//modules/project_services"
  version = "10.1.1"

  project_id = var.project

  activate_apis = [
    "compute.googleapis.com",
    "container.googleapis.com",
    "iam.googleapis.com",
    "servicemanagement.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "ml.googleapis.com",
    "meshconfig.googleapis.com",
  ]

  disable_services_on_destroy = var.disable_googleapi_services_on_destroy
}