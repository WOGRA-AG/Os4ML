variable "project" {
  description = "GCP project to create the resources in"
}

variable "project_name" {
  default = "Short name for project"
}

variable "region" {
  description = "Default region for google provider"
}

variable "zone" {
  description = "Default zone for google provider"
}

variable "terraform_account" {
  description = "Terraform account with necessary iam Policies to impersonate"
}

variable "billing_account" {
  description = "Billing Account for Project"
}

variable "budget" {
  description = "Budget for project"
  default     = "100"
}

variable "disable_googleapi_services_on_destroy" {
  description = "Disable Apis on destroy"
}