data "curl" "nvidia-driver-installer" {
  count       = var.cluster_provisioner == "gke" ? 1 : 0
  http_method = "GET"
  uri         = "https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/${var.nvidia-driver-installer-version}/nvidia-driver-installer/cos/daemonset-preloaded.yaml"
}

resource "kustomization_resource" "nvidia-driver-installer" {
  count    = var.cluster_provisioner == "gke" ? 1 : 0
  manifest = jsonencode(yamldecode(data.curl.nvidia-driver-installer[0].response))
}
