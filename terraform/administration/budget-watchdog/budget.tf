data "google_project" "project" {
  provider   = google
  project_id = var.project
}

resource "google_billing_budget" "budget" {
  provider        = google
  billing_account = var.billing_account
  display_name    = "Watchdog Billing Budget"

  budget_filter {
    projects               = ["projects/${data.google_project.project.number}"]
    credit_types_treatment = "EXCLUDE_ALL_CREDITS"
  }

  amount {
    specified_amount {
      currency_code = "EUR"
      units         = var.budget
    }
  }

  threshold_rules {
    threshold_percent = 0.8
  }

  threshold_rules {
    threshold_percent = 1.0
  }

  threshold_rules {
    threshold_percent = 1.0
    spend_basis       = "FORECASTED_SPEND"
  }

  all_updates_rule {
    pubsub_topic                   = "projects/${var.project}/topics/${google_pubsub_topic.budget_topic.name}"
    disable_default_iam_recipients = false
  }
}