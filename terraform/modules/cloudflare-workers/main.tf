terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36"
    }
  }
}

resource "cloudflare_workers_script" "api" {
  account_id = var.account_id
  name       = var.worker_name
  content    = file(var.worker_script)
  module     = true

  d1_database_binding {
    name        = "DB"
    database_id = var.d1_database_id
  }

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

resource "cloudflare_workers_route" "api_route" {
  zone_id     = var.zone_id
  pattern     = "${var.subdomain}.${data.cloudflare_zone.main.name}/*"
  script_name = cloudflare_workers_script.api.name
}

data "cloudflare_zone" "main" {
  zone_id = var.zone_id
}