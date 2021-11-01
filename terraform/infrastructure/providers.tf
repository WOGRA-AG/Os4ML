# set project for the provider as a whole to avoid having to repeat it for each resource
provider "google" {
  credentials = file("gcp-terraform-cred.json")
  project     = var.project
  region      = var.cluster_region
  zone        = var.cluster_zone
}

#provider "google-beta" {
# credentials = file("gcp-terraform-cred.json")
#  project = var.project
#  region  = var.region
#  zone    = var.zone
#}

provider "random" {
}

provider "null" {
}

provider "kubernetes" {
  # use the cluster managed by this module
  host                   = "https://${local.cluster_endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(local.cluster_ca_certificate)
}

locals {
  cluster_endpoint            = google_container_cluster.kubeflow_cluster.endpoint
  cluster_ca_certificate      = google_container_cluster.kubeflow_cluster.master_auth[0].cluster_ca_certificate
  custom_kube_dns_config      = length(keys(var.stub_domains)) > 0
  upstream_nameservers_config = length(var.upstream_nameservers) > 0
}
