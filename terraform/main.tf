terraform {
  backend "kubernetes" {
    secret_suffix = "state"
    config_path   = "~/.kube/config"
  }
}

module "kubeflow" {
  source  = "WOGRA-AG/kubeflow/kustomization"
  version = "0.1.0"

  kubernetes_config_path = var.kubernetes_config_path
}
