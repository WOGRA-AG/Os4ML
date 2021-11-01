# this is taken from https://github.com/terraform-google-modules/terraform-google-kubernetes-engine/blob/04f75029b7ff7d661832e91ac2ce9a24a990d34e/dns.tf

/******************************************
  Delete default kube-dns configmap
 *****************************************/
module "gcloud_delete_default_kube_dns_configmap" {
  source                      = "terraform-google-modules/gcloud/google//modules/kubectl-wrapper"
  version                     = "~> 2.1.0"
  enabled                     = (local.custom_kube_dns_config || local.upstream_nameservers_config) && !var.skip_provisioners
  cluster_name                = google_container_cluster.kubeflow_cluster.name
  cluster_location            = google_container_cluster.kubeflow_cluster.location
  project_id                  = var.project
  upgrade                     = var.gcloud_upgrade
  impersonate_service_account = var.impersonate_service_account

  kubectl_create_command  = "${path.module}/scripts/delete-default-resource.sh kube-system configmap kube-dns"
  kubectl_destroy_command = ""

  module_depends_on = [
    google_container_cluster.kubeflow_cluster.master_version,
    google_container_node_pool.main_pool.name
  ]
}

/******************************************
  Create kube-dns confimap
 *****************************************/
resource "kubernetes_config_map" "kube-dns" {
  count = local.custom_kube_dns_config && !local.upstream_nameservers_config ? 1 : 0

  metadata {
    name      = "kube-dns"
    namespace = "kube-system"

    labels = {
      maintained_by = "terraform"
    }
  }

  data = {
    stubDomains = <<EOF
${jsonencode(var.stub_domains)}
EOF
  }

  depends_on = [
    module.gcloud_delete_default_kube_dns_configmap.wait,
    google_container_cluster.kubeflow_cluster,
    google_container_node_pool.main_pool,
  ]
}

resource "kubernetes_config_map" "kube-dns-upstream-namservers" {
  count = !local.custom_kube_dns_config && local.upstream_nameservers_config ? 1 : 0

  metadata {
    name = "kube-dns"

    namespace = "kube-system"

    labels = {
      maintained_by = "terraform"
    }
  }

  data = {
    upstreamNameservers = <<EOF
${jsonencode(var.upstream_nameservers)}
EOF
  }

  depends_on = [
    module.gcloud_delete_default_kube_dns_configmap.wait,
    google_container_cluster.kubeflow_cluster,
    google_container_node_pool.main_pool,
  ]
}

resource "kubernetes_config_map" "kube-dns-upstream-nameservers-and-stub-domains" {
  count = local.custom_kube_dns_config && local.upstream_nameservers_config ? 1 : 0

  metadata {
    name      = "kube-dns"
    namespace = "kube-system"

    labels = {
      maintained_by = "terraform"
    }
  }

  data = {
    upstreamNameservers = <<EOF
${jsonencode(var.upstream_nameservers)}
EOF

    stubDomains = <<EOF
${jsonencode(var.stub_domains)}
EOF
  }

  depends_on = [
    module.gcloud_delete_default_kube_dns_configmap.wait,
    google_container_cluster.kubeflow_cluster,
    google_container_node_pool.main_pool,
  ]
}
