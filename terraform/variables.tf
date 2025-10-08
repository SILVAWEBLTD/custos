variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for DNS management"
  type        = string
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
  type        = string
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
}

variable "api_subdomain" {
  description = "Subdomain for the API (e.g., 'api' for api.example.com)"
  type        = string
  default     = "api"
}

variable "production_branch" {
  description = "Git branch for production deployments"
  type        = string
  default     = "main"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo)"
  type        = string
}

variable "build_config" {
  description = "Build configuration for Next.js"
  type = object({
    build_command   = string
    destination_dir = string
    root_dir        = string
  })
  default = {
    build_command   = "npm run build"
    destination_dir = ".vercel/output/static"
    root_dir        = "/"
  }
}

variable "frontend_environment_vars" {
  description = "Environment variables for the Next.js frontend"
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "api_worker_name" {
  description = "Name of the API Worker"
  type        = string
  default     = "api-worker"
}

variable "api_worker_script_path" {
  description = "Path to the Worker script file"
  type        = string
  default     = "../workers/api/dist/index.js"
}

variable "api_environment_vars" {
  description = "Environment variables for the API Worker"
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "db_name" {
  description = "Name of the D1 database"
  type        = string
  default     = "main-db"
}

variable "db_init_sql" {
  description = "Path to SQL initialization file"
  type        = string
  default     = "../database/init.sql"
}