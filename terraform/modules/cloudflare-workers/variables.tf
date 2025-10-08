variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "worker_name" {
  description = "Name of the Worker"
  type        = string
}

variable "worker_script" {
  description = "Path to the Worker script"
  type        = string
}

variable "d1_database_id" {
  description = "D1 Database ID to bind"
  type        = string
}

variable "d1_database_name" {
  description = "Name to use for D1 binding in Worker"
  type        = string
}

variable "environment_vars" {
  description = "Environment variables for the Worker"
  type        = map(string)
  default     = {}
}

variable "subdomain" {
  description = "Subdomain for the Worker route"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare Zone ID"
  type        = string
}