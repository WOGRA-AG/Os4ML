variable "deploy_frontend" {
  description = "Deploy frontend"
  type        = bool
  default     = true
}

variable "kubernetes_config_path" {
  description = "Path of Kubernetes configuration file"
  default     = "~/.kube/config"
}

variable "deploy_minio" {
  description = "Deploy Minio Operator and Tenant"
  type        = bool
  default     = true
}

variable "deploy_objectstore_manager" {
  description = "Deploy the Objectstore Manager"
  type        = bool
  default     = true
}

variable "cluster_provisioner" {
  description = "Deployment environment. One of: [k3d, gke]"
  type        = string
  default     = "k3d"
}

variable "nvidia-driver-installer-version" {
  description = "Commit hash of the installer for the nvidia driver daemon set in the repo https://github.com/GoogleCloudPlatform/container-engine-accelerators"
  default     = "2e6077e7e782345031092b5d368fb861c96ba600"
}