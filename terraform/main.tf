terraform {
  backend "kubernetes" {
    secret_suffix = "state"
    config_path   = "~/.kube/config"
  }
}

module "kubeflow" {
  source  = "gitlab.wogra.com/infrastructure/kubeflow/local"
  version = "0.0.6"

  kubernetes_config_path = var.kubernetes_config_path
}

module "frontend" {
  source = "./frontend"

  kubernetes_config_path = var.kubernetes_config_path
}
