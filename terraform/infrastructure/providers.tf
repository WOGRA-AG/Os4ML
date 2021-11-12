# set project for the provider as a whole to avoid having to repeat it for each resource
provider "google" {
  alias = "tokengen"
}

data "google_client_config" "default" {
  provider = google.tokengen
}
data "google_service_account_access_token" "sa" {
  provider               = google.tokengen
  target_service_account = var.terraform_account
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
  region                = var.cluster_region
  zone                  = var.cluster_zone
  user_project_override = true
  billing_project       = var.project
}
/******************************************
  Beta Provider configuration
 *****************************************/
provider "google-beta" {
  access_token          = data.google_service_account_access_token.sa.access_token
  project               = var.project
  region                = var.cluster_region
  zone                  = var.cluster_zone
  user_project_override = true
  billing_project       = var.project
}

provider "random" {
}

provider "null" {
}

provider "kubernetes" {
  # use the cluster managed by this module
  host                   = "https://${local.cluster_endpoint}"
  token                  = data.google_service_account_access_token.sa.access_token
  cluster_ca_certificate = base64decode(local.cluster_ca_certificate)
}

locals {
  cluster_endpoint            = google_container_cluster.kubeflow_cluster.endpoint
  cluster_ca_certificate      = google_container_cluster.kubeflow_cluster.master_auth[0].cluster_ca_certificate
  custom_kube_dns_config      = length(keys(var.stub_domains)) > 0
  upstream_nameservers_config = length(var.upstream_nameservers) > 0
}
