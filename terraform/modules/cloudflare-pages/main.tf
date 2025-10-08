resource "cloudflare_pages_project" "nextjs_app" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = var.production_branch

  build_config {
    build_command   = var.build_config.build_command
    destination_dir = var.build_config.destination_dir
    root_dir        = var.build_config.root_dir
  }

  source {
    type = "github"
    config {
      owner                         = split("/", var.github_repo)[0]
      repo_name                     = split("/", var.github_repo)[1]
      production_branch             = var.production_branch
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
    }
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