terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 3.90.1"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 3.90.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.6.1"
    }
    null = {
      source  = "hashicorp/null"
      version = ">= 3.1.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.1.0"
    }
  }

  required_version = "~> 1.0.10"
}

