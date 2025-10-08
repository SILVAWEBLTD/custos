output "worker_name" {
  description = "Worker name"
  value       = cloudflare_worker_script.api.name
}

output "worker_route" {
  description = "Worker route pattern"
  value       = cloudflare_worker_route.api_route.pattern
}