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
  }

  required_version = "~> 1.0.10"
}