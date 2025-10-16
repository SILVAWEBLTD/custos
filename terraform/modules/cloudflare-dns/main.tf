terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36"
    }
  }
}

resource "cloudflare_record" "root" {
  zone_id         = var.zone_id
  name            = "@"
  content         = var.pages_domain
  type            = "CNAME"
  proxied         = true
  comment         = "Managed by Terraform - Points to Cloudflare Pages"
  allow_overwrite = true
}

resource "cloudflare_record" "www" {
  zone_id         = var.zone_id
  name            = "www"
  content         = var.domain
  type            = "CNAME"
  proxied         = true
  comment         = "Managed by Terraform - WWW redirect"
  allow_overwrite = true
}

resource "cloudflare_record" "staging" {
  zone_id         = var.zone_id
  name            = "staging"
  content         = var.pages_domain_staging
  type            = "CNAME"
  proxied         = true
  comment         = "Managed by Terraform - Points to Cloudflare Pages Staging"
  allow_overwrite = true
}

resource "cloudflare_record" "api" {
  zone_id         = var.zone_id
  name            = var.api_subdomain
  content         = var.domain
  type            = "CNAME"
  proxied         = true
  comment         = "Managed by Terraform - API Worker endpoint"
  allow_overwrite = true
}