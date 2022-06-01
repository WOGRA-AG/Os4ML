data "kustomization_build" "os4ml_profile_build" {
  path = "../manifests/common/profile"
}

data "kustomization_build" "os4ml_base_build" {
  path = "../manifests/common/base"
}

data "kustomization_build" "os4ml_gateway_build" {
  path = "../manifests/common/istio-resources"
}

resource "kustomization_resource" "os4ml_profile_build" {
  for_each = data.kustomization_build.os4ml_profile_build.ids
  manifest = replace(data.kustomization_build.os4ml_profile_build.manifests[each.value], "$USER_MAIL", var.user_email)

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

resource "kustomization_resource" "os4ml_gateway_resource" {
  for_each = data.kustomization_build.os4ml_gateway_build.ids
  manifest = replace(data.kustomization_build.os4ml_gateway_build.manifests[each.value], "$OS4ML_DNS_NAME", var.os4ml_dns_name)

  depends_on = [
    module.kubeflow,
    kustomization_resource.os4ml_profile_build
  ]
}