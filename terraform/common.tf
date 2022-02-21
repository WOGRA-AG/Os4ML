data "kustomization_build" "os4ml_profile_build" {
  path = "../manifests/common/profile"
}

data "kustomization_build" "os4ml_base_build" {
  path = "../manifests/common/base"
}

resource "kustomization_resource" "os4ml_profile_build" {
  for_each = data.kustomization_build.os4ml_profile_build.ids
  manifest = data.kustomization_build.os4ml_profile_build.manifests[each.value]

  depends_on = [
    module.kubeflow
  ]
}

resource "kustomization_resource" "os4ml_base_build" {
  for_each = data.kustomization_build.os4ml_base_build.ids
  manifest = data.kustomization_build.os4ml_base_build.manifests[each.value]

  depends_on = [
    module.kubeflow,
    kustomization_resource.os4ml_profile_build
  ]
}
