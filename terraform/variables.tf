variable "deploy_frontend" {
  description = "Deploy frontend"
  type        = bool
  default     = true
}

variable "kubernetes_config_path" {
  description = "Path of Kubernites configuration file"
  default     = "~/.kube/config"
}