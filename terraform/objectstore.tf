data "kustomization_build" "minio_operator_build" {
  path = "../manifests/apps/objectstore-manager/third-party/minio"
}

data "kustomization_build" "minio_tenant_build" {
  path = "../manifests/apps/objectstore-manager/third-party/minio/tenant"
}

data "kustomization_build" "objectstore_manager_build" {
  path = "../manifests/apps/objectstore-manager/overlays/istio"
}

resource "kustomization_resource" "minio_operator" {
  for_each = var.deploy_minio ? data.kustomization_build.minio_operator_build.ids : []
  manifest = data.kustomization_build.minio_operator_build.manifests[each.value]

  depends_on = [
    module.kubeflow
  ]
}

resource "kustomization_resource" "minio_tenant" {
  for_each = var.deploy_minio ? data.kustomization_build.minio_tenant_build.ids : []
  manifest = data.kustomization_build.minio_tenant_build.manifests[each.value]

  depends_on = [
    module.kubeflow,
    kustomization_resource.minio_operator
  ]
}

resource "kustomization_resource" "objectstore_manager" {
  for_each = var.deploy_objectstore_manager ? data.kustomization_build.objectstore_manager_build.ids : []
  manifest = data.kustomization_build.objectstore_manager_build.manifests[each.value]

  depends_on = [
    module.kubeflow,
    kustomization_resource.os4ml_base_build
  ]
}