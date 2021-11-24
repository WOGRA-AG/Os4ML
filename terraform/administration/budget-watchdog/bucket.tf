resource "google_storage_bucket" "bucket" {
  name                        = "budget-watchdog-bucket"
  project                     = var.project
  location                    = "EU"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "archive" {
  bucket = google_storage_bucket.bucket.name
  name   = "index.zip"
  source = "./code/index.zip"
}