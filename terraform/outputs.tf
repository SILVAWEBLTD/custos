output "pages_url" {
  description = "Cloudflare Pages URL"
  value       = module.cloudflare_pages.pages_url
}

output "pages_url_staging" {
  description = "Cloudflare Pages Staging URL"
  value       = "https://${var.project_name_staging}.pages.dev"
}

output "custom_domain" {
  description = "Custom domain URL"
  value       = "https://${var.domain}"
}

output "api_url" {
  description = "API Worker URL"
  value       = "https://${var.api_subdomain}.${var.domain}"
}

output "database_id" {
  description = "D1 Database ID"
  value       = module.cloudflare_d1.database_id
}

output "database_name" {
  description = "D1 Database Name"
  value       = module.cloudflare_d1.database_name
}

output "worker_name" {
  description = "API Worker Name"
  value       = module.cloudflare_workers.worker_name
}

output "project_name_staging" {
  description = "Cloudflare Pages Staging Project Name"
  value       = module.cloudflare_pages.project_name_staging
}