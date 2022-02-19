locals {
  istio_patch       = "[{'op': 'add', 'path': '/spec/loadBalancerIP', 'value': ${var.external_ip}}, {'op': 'replace', 'path': '/spec/type', 'value': 'LoadBalancer'}]"
  ingress_name      = "istio-ingressgateway"
  ingress_namespace = "istio-system"
}
# terrible abuse of the null resource until kubernetes provider implements the patch functionality
# https://github.com/hashicorp/terraform-provider-kubernetes/issues/723

resource "null_resource" "istio_patcher" {
  count = var.cluster_provisioner == "gke" ? 1 : 0
  provisioner "local-exec" {
    command = <<EOH
kubectl patch -n istio-system svc istio-ingressgateway --type=json -p "${local.istio_patch}"
EOH
  }
  depends_on = [
    module.kubeflow
  ]
}