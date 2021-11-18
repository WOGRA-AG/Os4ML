resource "google_storage_bucket" "bucket" {
  name     = "budget-watchdog-bucket"
  project  = var.project
  location = "EU"
}

resource "google_storage_bucket_object" "archive" {
  bucket = google_storage_bucket.bucket.name
  name   = "index.zip"
  source = "./code/index.zip"
}