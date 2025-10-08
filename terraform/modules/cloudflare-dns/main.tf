resource "cloudflare_record" "root" {
  zone_id = var.zone_id
  name    = "@"
  value   = var.pages_domain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Points to Cloudflare Pages"
}

resource "cloudflare_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  value   = var.domain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - WWW redirect"
}

resource "cloudflare_record" "api" {
  zone_id = var.zone_id
  name    = var.api_subdomain
  value   = var.domain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - API Worker endpoint"
}