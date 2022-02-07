terraform {
  required_providers {
    kustomization = {
      source  = "kbst/kustomization"
      version = ">= 0.7.0"
    }
    curl = {
      source  = "anschoewe/curl"
      version = "0.1.3"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.13.1"
    }
  }

  required_version = "~> 1.1"
}
