data "kustomization_build" "frontend_build" {
  path = "../manifests/apps/frontend/overlays/istio"
}

resource "kustomization_resource" "frontend" {
  for_each = var.deploy_frontend ? data.kustomization_build.frontend_build.ids : []
  manifest = data.kustomization_build.frontend_build.manifests[each.value]

  depends_on = [
    module.kubeflow,
    kustomization_resource.os4ml_base_build
  ]
}
