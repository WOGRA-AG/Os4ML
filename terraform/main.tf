terraform {
  backend "kubernetes" {
    secret_suffix = "state"
    config_path   = "~/.kube/config"
  }
}

module "kubeflow" {
  source  = "WOGRA-AG/kubeflow/kustomization"
  version = "0.2.2"

  deploy_istio                = true
  deploy_pipelines            = true
  deploy_dashboard            = true
  deploy_katib                = true
  deploy_notebooks            = false
  deploy_tensorboard          = false
  deploy_volumes              = false
  deploy_serving              = false
  istio_ingress_load_balancer = false
  dex_user_email              = var.user_email
  dex_user_hash               = var.user_hash
  dex_user_name               = var.user_name
  dex_user_id                 = var.user_id
}
