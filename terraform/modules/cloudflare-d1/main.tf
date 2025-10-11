terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
}

resource "cloudflare_d1_database" "main" {
  account_id = var.account_id
  name       = var.db_name
}

resource "null_resource" "init_db" {
  count = var.init_sql != "" ? 1 : 0

  triggers = {
    init_sql_hash = filemd5(var.init_sql)
  }

  provisioner "local-exec" {
    command = <<-EOT
      wrangler d1 execute ${cloudflare_d1_database.main.name} \
        --file=${var.init_sql} \
        --remote
    EOT
  }

  depends_on = [cloudflare_d1_database.main]
}

resource "null_resource" "seed_db" {
  count = var.seeds_sql != "" ? 1 : 0

  triggers = {
    seeds_sql_hash = filemd5(var.seeds_sql)
  }

  provisioner "local-exec" {
    command = <<-EOT
      wrangler d1 execute ${cloudflare_d1_database.main.name} \
        --file=${abspath(var.seeds_sql)} \
        --remote
    EOT
  }

  depends_on = [null_resource.init_db]
}