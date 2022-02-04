data "curl" "nvidia_driver_installer" {
  count       = var.cluster_provisioner == "gke" ? 1 : 0
  http_method = "GET"
  uri         = "https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/${var.nvidia_driver_installer_version}/nvidia-driver-installer/cos/daemonset-preloaded.yaml"
}

resource "kubernetes_manifest" "nvidia_driver_installer" {
  count = var.cluster_provisioner == "gke" ? 1 : 0
  # ignore cpu limit to prevent inconsistent result after apply- see https://github.com/hashicorp/terraform-provider-kubernetes/issues/1466
  computed_fields = ["spec.template.spec.initContainers[0].resources.requests"]

  manifest = yamldecode(data.curl.nvidia_driver_installer[0].response)
}
