variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
  type        = string
}

variable "project_name_staging" {
  description = "Name of the Cloudflare Pages staging project"
  type        = string
}

variable "production_branch" {
  description = "Git branch for production deployments"
  type        = string
}

variable "production_branch_staging" {
  description = "Git branch for staging deployments"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format"
  type        = string
}

variable "build_config" {
  description = "Build configuration"
  type = object({
    build_command   = string
    destination_dir = string
    root_dir        = string
  })
}

variable "environment_vars" {
  description = "Environment variables"
  type        = map(string)
  default     = {}
}