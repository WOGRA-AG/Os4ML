resource "helm_release" "influxdb" {
  name = "influxdb"

  repository = "https://helm.influxdata.com"
  chart      = "influxdb"
  version    = "4.4.12"

  namespace = "shepard"

  set {
    name  = "auth.enabled"
    value = "true"
  }
  set {
    name  = "auth.admin.username"
    value = "admin"
  }
  set {
    name  = "auth.admin.password"
    value = "influx1234"
  }

  depends_on = [
    kustomization_resource.dlr_shepard_base_resource
  ]
}
