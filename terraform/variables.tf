variable "kubernetes_config_path" {
  description = "Path to kubernetes config file"
  default     = "~/.kube/config"
}

variable "deploy_frontend" {
  description = "Deploy frontend"
  type        = bool
  default     = true
}
