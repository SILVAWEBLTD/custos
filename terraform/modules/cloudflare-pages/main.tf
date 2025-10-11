terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36"
    }
  }
}

resource "cloudflare_pages_project" "nextjs_app" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = var.production_branch

  build_config {
    build_command   = var.build_config.build_command
    destination_dir = var.build_config.destination_dir
    root_dir        = var.build_config.root_dir
  }

  deployment_configs {
    production {
      environment_variables = var.environment_vars
      compatibility_date    = "2024-01-01"
      compatibility_flags   = ["nodejs_compat"]
    }

    preview {
      environment_variables = var.environment_vars
      compatibility_date    = "2024-01-01"
      compatibility_flags   = ["nodejs_compat"]
    }
  }
}
