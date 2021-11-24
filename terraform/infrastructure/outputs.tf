output "kf_cluster_id" {
  value = google_container_cluster.kubeflow_cluster.id
}

output "kf_cluster_name" {
  value = google_container_cluster.kubeflow_cluster.name
}

output "kf_cluster_endpoint" {
  value = local.cluster_endpoint
}

output "kf_cluster_ca_certificate" {
  value     = local.cluster_ca_certificate
  sensitive = true
}

output "vpc_network" {
  value = google_compute_network.vpc.id
}

output "sub_network" {
  value = google_compute_subnetwork.subnet.id
}

output "kf_admin_service_account" {
  value = google_service_account.kubeflow_admin
}

output "kf_user_service_account" {
  value = google_service_account.kubeflow_user
}

output "kf_vm_service_account" {
  value = google_service_account.kubeflow_vm
}

output "cloudsql_proxy_service_account" {
  value = google_service_account.cloudsql_proxy
}
