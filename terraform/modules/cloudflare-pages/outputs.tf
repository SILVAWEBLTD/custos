output "pages_url" {
  description = "Cloudflare Pages URL"
  value       = "https://${cloudflare_pages_project.nextjs_app.subdomain}"
}

output "pages_domain" {
  description = "Cloudflare Pages domain"
  value       = cloudflare_pages_project.nextjs_app.subdomain
}

output "project_name" {
  description = "Project name"
  value       = cloudflare_pages_project.nextjs_app.name
}