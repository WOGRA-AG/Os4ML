data "kustomization_build" "os4ml" {
  path = "../../services/frontend/kubernetes/base"
}

resource "kustomization_resource" "os4ml" {
  for_each = data.kustomization_build.os4ml.ids
  manifest = data.kustomization_build.os4ml.manifests[each.value]

  depends_on = [
    kustomization_resource.istio-resources,
  ]
}