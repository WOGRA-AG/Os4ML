module "project-factory_project_services" {
  source     = "terraform-google-modules/project-factory/google//modules/project_services"
  version    = "11.2.3"
  project_id = var.project

  activate_apis = [
    "iam.googleapis.com",
    "servicemanagement.googleapis.com",
    "billingbudgets.googleapis.com",
    "cloudbilling.googleapis.com",
    "pubsub.googleapis.com",
  ]

  disable_services_on_destroy = var.disable_googleapi_services_on_destroy
}