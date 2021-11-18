resource "google_service_account" "budget-watchdog" {
  project      = var.project
  account_id   = "${var.project_name}-budget-watchdog"
  display_name = "Service Account for the budget watchdog"
}

resource "google_project_iam_member" "budget_watchdog-billing_projectManager" {
  project = var.project
  role    = "roles/billing.projectManager"
  member  = "serviceAccount:${google_service_account.budget-watchdog.email}"
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  member = "allUsers"
  role   = "roles/cloudfunctions.invoker"
}