resource "cloudflare_d1_database" "main" {
  account_id = var.account_id
  name       = var.db_name
}

# Initialize database with schema
resource "null_resource" "init_db" {
  count = var.init_sql != "" ? 1 : 0

  provisioner "local-exec" {
    command = <<-EOT
      wrangler d1 execute ${cloudflare_d1_database.main.name} \
        --file=${var.init_sql} \
        --remote
    EOT
  }

  depends_on = [cloudflare_d1_database.main]
}