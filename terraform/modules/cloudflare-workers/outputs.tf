output "worker_name" {
  description = "Worker name"
  value       = cloudflare_workers_script.api.name
}

output "worker_route" {
  description = "Worker route pattern"
  value       = cloudflare_workers_route.api_route.pattern
}