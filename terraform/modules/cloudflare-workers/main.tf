resource "cloudflare_worker_script" "api" {
  account_id = var.account_id
  name       = var.worker_name
  content    = file(var.worker_script)

  # Bind D1 database to worker
  d1_database_binding {
    name        = var.d1_database_name
    database_id = var.d1_database_id
  }

  # Plain text environment variables
  dynamic "plain_text_binding" {
    for_each = var.environment_vars
    content {
      name = plain_text_binding.key
      text = plain_text_binding.value
    }
  }

  compatibility_date  = "2024-01-01"
  compatibility_flags = ["nodejs_compat"]
}

resource "cloudflare_worker_route" "api_route" {
  zone_id     = var.zone_id
  pattern     = "${var.subdomain}.${data.cloudflare_zone.main.name}/*"
  script_name = cloudflare_worker_script.api.name
}

data "cloudflare_zone" "main" {
  zone_id = var.zone_id
}