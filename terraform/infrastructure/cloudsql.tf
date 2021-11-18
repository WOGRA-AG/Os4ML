# Cloud SQL instances cannot reuse names within one week of each other, so this
# allows the name to have a randomized suffix.
resource "random_id" "db_name_suffix" {
  byte_length = 4
}

# : On newer versions of the provider, you must explicitly set deletion_protection=false
# (and run terraform apply to write the field to state) in order to destroy an instance.
# It is recommended to not set this field (or set it to true) until you're ready to destroy the instance and its databases.
# A Cloud SQL instance to used for the metadata of pipelines.
resource "google_sql_database_instance" "metadata_db_instance" {
  project             = var.project
  name                = "${var.cluster_name}-${random_id.db_name_suffix.hex}"
  database_version    = "MYSQL_8_0"
  region              = var.cluster_region
  deletion_protection = false

  lifecycle {
    prevent_destroy = false
  }

  settings {
    backup_configuration {
      enabled            = true
      binary_log_enabled = true
      start_time         = "08:00"
    }


    user_labels = {
      "application"              = "kubeflow"
      "env"                      = var.env_label
      "cloudsql-instance-suffix" = random_id.db_name_suffix.hex
    }

    tier = "db-f1-micro"

    location_preference {
      zone = var.cluster_zone
    }
  }
}

# Terraform deletes the default root user with no password that Cloud SQL
# creates, so we create a custom user with (strong!) password and restricted host
#resource "google_sql_user" "root_user" {
#  name     = "root"
#  instance = google_sql_database_instance.metadata_db_instance.name
#  password = ""
#  host     = "%"
#}

resource "google_sql_user" "read_only_user" {
  name     = "read_only"
  instance = google_sql_database_instance.metadata_db_instance.name
  password = var.mysql_read_only_user_password
  host     = "%"
}

resource "google_sql_user" "developer" {
  name     = "developer"
  instance = google_sql_database_instance.metadata_db_instance.name
  password = var.mysql_developer_password
  host     = "%"
}
