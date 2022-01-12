terraform {
  required_providers {
    kustomization = {
      source  = "kbst/kustomization"
      version = ">= 0.7.0"
    }
  }

  required_version = "~> 1.1"
}
