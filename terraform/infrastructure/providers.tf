data "google_client_config" "default" {}

/******************************************
  GA Provider configuration
 *****************************************/
provider "google" {
  impersonate_service_account = var.terraform_account
  project                     = var.project
  region                      = var.cluster_region
  zone                        = var.cluster_zone
  user_project_override       = true
  billing_project             = var.project
}
/******************************************
  Beta Provider configuration
 *****************************************/
provider "google-beta" {
  impersonate_service_account = var.terraform_account
  project                     = var.project
  region                      = var.cluster_region
  zone                        = var.cluster_zone
  user_project_override       = true
  billing_project             = var.project
}

provider "random" {}

provider "null" {}

locals {
  cluster_endpoint            = google_container_cluster.kubeflow_cluster.endpoint
  cluster_ca_certificate      = google_container_cluster.kubeflow_cluster.master_auth[0].cluster_ca_certificate
  custom_kube_dns_config      = length(keys(var.stub_domains)) > 0
  upstream_nameservers_config = length(var.upstream_nameservers) > 0
}
