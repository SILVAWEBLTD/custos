terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# D1 Database Module
module "cloudflare_d1" {
  source = "./modules/cloudflare-d1"

  account_id = var.cloudflare_account_id
  db_name    = var.db_name
  init_sql   = var.db_init_sql
  seeds_sql  = var.db_seed_sql
}

# Workers API Module
module "cloudflare_workers" {
  source = "./modules/cloudflare-workers"

  account_id       = var.cloudflare_account_id
  worker_name      = var.api_worker_name
  worker_script    = var.api_worker_script_path
  d1_database_id   = module.cloudflare_d1.database_id
  d1_database_name = "DB" # Set as a string as it binds the worker to the database name as 
  environment_vars = var.api_environment_vars
  subdomain        = var.api_subdomain
  zone_id          = var.cloudflare_zone_id

  depends_on = [module.cloudflare_d1]
}

# Pages Module (Next.js)
module "cloudflare_pages" {
  source = "./modules/cloudflare-pages"

  account_id        = var.cloudflare_account_id
  project_name      = var.project_name
  production_branch = var.production_branch
  github_repo       = var.github_repo
  build_config      = var.build_config
  environment_vars = merge(
    var.frontend_environment_vars,
    {
      NEXT_PUBLIC_API_URL = "https://${var.api_subdomain}.${var.domain}"
    }
  )
}

# DNS Module
module "cloudflare_dns" {
  source = "./modules/cloudflare-dns"

  zone_id       = var.cloudflare_zone_id
  domain        = var.domain
  pages_domain  = module.cloudflare_pages.pages_domain
  api_subdomain = var.api_subdomain
  worker_route  = module.cloudflare_workers.worker_route

  depends_on = [module.cloudflare_pages, module.cloudflare_workers]
}