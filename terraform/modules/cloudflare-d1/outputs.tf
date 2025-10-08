output "database_id" {
  description = "D1 Database ID"
  value       = cloudflare_d1_database.main.id
}

output "database_name" {
  description = "D1 Database Name"
  value       = cloudflare_d1_database.main.name
}