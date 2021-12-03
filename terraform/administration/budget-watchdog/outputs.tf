output "budget_id" {
  value = google_billing_budget.budget.id
}

output "function_id" {
  value = google_cloudfunctions_function.function.id
}

output "topic_id" {
  value = google_pubsub_topic.budget_topic.id
}

output "bucket_id" {
  value = google_storage_bucket.bucket.id
}