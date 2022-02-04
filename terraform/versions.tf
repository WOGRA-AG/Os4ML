terraform {
  required_providers {
    kustomization = {
      source  = "kbst/kustomization"
      version = ">= 0.7.0"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.13.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.7.1"
    }
    curl = {
      source  = "anschoewe/curl"
      version = "0.1.3"
    }
  }

  required_version = "~> 1.1"
}
