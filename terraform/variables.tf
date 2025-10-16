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
  default     = "custos-frontend-production"
}

variable "project_name_staging" {
  description = "Name of the Cloudflare Pages staging project"
  type        = string
  default     = "custos-frontend-staging"
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
  default     = "production"
}

variable "production_branch_staging" {
  description = "Git branch for staging deployments"
  type        = string
  default     = "staging"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo)"
  type        = string
  default     = "maxsilvaweb/custos"
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
  default     = "custos_api"
}

variable "api_worker_script_path" {
  type        = string
  description = "Entry JS for the API Worker"
  default     = "./workers/api/src/index.js"
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
  default     = "custos_db"
}

variable "db_init_sql" {
  description = "Path to SQL initialization file"
  type        = string
  default     = "./database/init.sql"
}

variable "db_seed_sql" {
  description = "Path to SQL seed data file"
  type        = string
  default     = "./database/seeds.sql"
}