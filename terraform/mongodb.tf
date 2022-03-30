resource "helm_release" "mongodb" {
  name = "mongodb"

  repository = "https://mongodb.github.io/helm-charts"
  chart      = "community-operator"
  version    = "0.7.3"

  namespace = "shepard"

  depends_on = [
    kustomization_resource.dlr_shepard_base_resource
  ]
}