resource "helm_release" "neo4j" {
  name = "neo4j"

  repository = "https://helm.neo4j.com/neo4j"
  chart      = "neo4j-standalone"
  values     = [file("../manifests/apps/third-party/neo4j/helm/values.yaml")]
  version    = "4.4.5"

  namespace = "shepard"

  depends_on = [
    kustomization_resource.dlr_shepard_base_resource
  ]
}