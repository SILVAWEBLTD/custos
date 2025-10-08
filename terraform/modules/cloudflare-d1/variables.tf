variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "db_name" {
  description = "Name of the D1 database"
  type        = string
}

variable "init_sql" {
  description = "Path to SQL initialization file"
  type        = string
  default     = ""
}