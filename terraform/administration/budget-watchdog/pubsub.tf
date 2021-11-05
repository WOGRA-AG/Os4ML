resource "google_pubsub_topic" "budget_topic" {
  name = "budgetTop"

  labels = {
    app = "${var.project_name}-budget-topic"
  }
}

resource "google_pubsub_subscription" "budget_subscription" {
  name  = "budgetSub"
  topic = google_pubsub_topic.budget_topic.name

  ack_deadline_seconds = 20

  labels = {
    app = "${var.project_name}-budget-subscription"
  }

  push_config {
    push_endpoint = "https://${var.project}.appspot.com/_ah/push-handlers/pubsub/projects/sincere-song-328914/topics/${google_pubsub_topic.budget_topic.name}?pubsub_trigger=true"

    attributes = {
      x-goog-version = "v1"
    }
  }
}