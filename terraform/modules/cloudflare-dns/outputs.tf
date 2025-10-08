output "root_record_id" {
  description = "Root DNS record ID"
  value       = cloudflare_record.root.id
}

output "www_record_id" {
  description = "WWW DNS record ID"
  value       = cloudflare_record.www.id
}

output "api_record_id" {
  description = "API DNS record ID"
  value       = cloudflare_record.api.id
}