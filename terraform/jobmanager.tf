data "kustomization_build" "jobmanager_build" {
  path = "../manifests/apps/job-manager/overlays/istio"
}

resource "kustomization_resource" "jobmanager" {
  for_each = var.deploy_jobmanager ? data.kustomization_build.jobmanager_build.ids : []
  manifest = data.kustomization_build.jobmanager_build.manifests[each.value]

  depends_on = [
    module.kubeflow,
    kustomization_resource.os4ml_base_build
  ]
}