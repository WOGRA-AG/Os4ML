resource "google_cloudfunctions_function" "function" {
  name                  = "budget-watchdog"
  description           = "budget watchdog function"
  runtime               = "python39"
  service_account_email = google_service_account.budget-watchdog.email
  region = "europe-west3"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.budget_topic.name
    failure_policy {
      retry = true
    }
  }
  max_instances = 1
  timeout       = 60
  entry_point   = "stop_billing"
  labels = {
    app = "${var.project}-budget-watchdog"
  }

  environment_variables = {
    GCP_PROJECT = var.project
  }
}