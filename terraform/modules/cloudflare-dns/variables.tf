variable "zone_id" {
  description = "Cloudflare Zone ID"
  type        = string
}

variable "domain" {
  description = "Custom domain"
  type        = string
}

variable "pages_domain" {
  description = "Cloudflare Pages domain to point to"
  type        = string
}

variable "pages_domain_staging" {
  description = "Cloudflare Pages staging domain to point to"
  type        = string
}

variable "api_subdomain" {
  description = "Subdomain for the API"
  type        = string
}

variable "worker_route" {
  description = "Worker route pattern"
  type        = string
}