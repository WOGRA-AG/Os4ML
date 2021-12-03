resource "google_pubsub_topic" "budget_topic" {
  provider = google-beta
  name     = "budget-topic"
  project  = var.project

  labels = {
    app = "${var.project_name}-budget-topic"
  }
}

resource "google_pubsub_subscription" "budget_subscription" {
  provider = google-beta
  name     = "budgetSub"
  topic    = google_pubsub_topic.budget_topic.name
  project  = var.project

  ack_deadline_seconds = 20

  labels = {
    app = "${var.project_name}-budget-subscription"
  }

  push_config {
    push_endpoint = "https://${var.project}.appspot.com/_ah/push-handlers/pubsub/projects/${var.project}/topics/${google_pubsub_topic.budget_topic.name}?pubsub_trigger=true"

    attributes = {
      x-goog-version = "v1"
    }
  }

  depends_on = [
    google_pubsub_topic.budget_topic
  ]
}