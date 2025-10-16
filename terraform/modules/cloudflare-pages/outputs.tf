output "pages_url" {
  description = "Cloudflare Pages URL"
  value       = "https://${cloudflare_pages_project.nextjs_app_production.subdomain}"
}

output "pages_domain" {
  description = "Cloudflare Pages domain"
  value       = cloudflare_pages_project.nextjs_app_production.subdomain
}

output "project_name" {
  description = "Project name"
  value       = cloudflare_pages_project.nextjs_app_production.name
}

output "project_name_staging" {
  description = "Staging project name"
  value       = cloudflare_pages_project.nextjs_app_staging.name
}