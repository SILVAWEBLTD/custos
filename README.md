https://custos.space

# Project Structure:

- **cloudflare**: Secure serverless hosting
- **cloudflare workers**: Running the Hono rest API
- **cloudflare pages - NextJS Frontend**: NextJS15 frontend
- **cloudflare D1**: SQLite's database for pages and workers to query

```
custos/
├── README.md
├── database/
│   └── init.sql
├── frontend/
│   └── (Next.js application files)
├── workers/
│   └── api/
│       ├── package.json
│       ├── wrangler.toml
│       ├── src/
│       │   └── index.js
│       └── dist/
│           └── (compiled worker files)
└── terraform/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    ├── terraform.tfvars
    └── modules/
        ├── cloudflare-pages/
        │   ├── main.tf
        │   ├── variables.tf
        │   └── outputs.tf
        ├── cloudflare-workers/
        │   ├── main.tf
        │   ├── variables.tf
        │   └── outputs.tf
        ├── cloudflare-d1/
        │   ├── main.tf
        │   ├── variables.tf
        │   └── outputs.tf
        └── cloudflare-dns/
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
```

## Repository layout

| Path           | Purpose                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------- |
| `terraform/`   | Root Terraform configuration plus modules for D1, Workers, Pages, and DNS.                  |
| `frontend/`    | Next.js application bundled with `@opennextjs/cloudflare` for Pages.                        |
| `workers/api/` | Hono API worker targeting D1 and exposing `/api/users`, `/api/posts`, and health endpoints. |
| `database/`    | Cloudflare D1 assets and supporting SQL files.                                              |
| `steps.md`     | Field notes and caveats gathered during manual setup—mirrored throughout this README.       |

## Prerequisites

- Active Cloudflare account with a domain delegate-able to Cloudflare DNS.
- Terraform ≥ 1.0.
- Node.js 20+ (or Bun) for the frontend and worker builds.
- Wrangler CLI (installed via `bun install --global wrangler` or using the project-local dependency).
- GitHub repository containing the frontend code (required for Pages deployment).

## Provisioning workflow

1. **Delegate DNS to Cloudflare**

   - Add your domain to Cloudflare, update registrar nameservers, and wait until the zone status is **Active**.
   - Record the zone ID (`cloudflare_zone_id`) and account ID (`cloudflare_account_id`).

2. **Create a scoped API token**

   - Minimum scopes: Zone:Read, Zone:DNS:Edit, Account:Workers Scripts:Edit, Account:D1 Databases:Edit (or Write), Account:Cloudflare Pages:Edit, Account Settings:Read.
   - Export it for Terraform (`export TF_VAR_cloudflare_api_token="<token>"`) or populate `terraform/terraform.tfvars` (avoid committing secrets).

3. **Wire Cloudflare Pages to GitHub**

   - Install the Cloudflare Pages GitHub App and grant access to the repository referenced by `github_repo`.
   - Ensure the `production_branch` (default `production`) builds locally with the configured command (`build_config.build_command`).

4. **Local preparation**

   - **API worker**

     ```bash
     cd workers/api
     bun install
     bun run build:bundle   # produces dist/worker.js for validation
     ```

     The Terraform module expects `api_worker_script_path` to point at the compiled module (default `./workers/api/src/index.js`). Adjust the variable if you relocate the bundle.

   - **Frontend**
     ```bash
     cd frontend
     bun install
     bun run build
     ```
     Development uses Turbopack (`next dev --turbopack`), but keep the production build command as plain `next build`—do not enable Turbopack for the build script OpenNext deployments on cloudflare break with the turbopack flag enabled.

5. **Configure Terraform variables**

   - Edit `terraform/terraform.tfvars` and set:
     ```hcl
     cloudflare_account_id = "..."
     cloudflare_zone_id    = "..."
     domain                = "custos.space"
     project_name          = "custos-frontend-production"
     project_name_staging  = "custos-frontend-staging"
     github_repo           = "owner/repo"
     production_branch     = "production"
     production_branch_staging = "staging"
     api_subdomain         = "api"
     ```
   - Add optional maps for `frontend_environment_vars` and `api_environment_vars`.

6. **Apply Terraform**

   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

   The apply will:

   - Create the D1 database and attach it to the Worker.
   - Upload the API Worker, bind the D1 database, and register routes at `https://<api_subdomain>.<domain>/*`.
   - Create production and staging Cloudflare Pages projects, configure environment variables (including `NEXT_PUBLIC_API_URL`), and connect builds to GitHub.
   - Create DNS records for the Pages project and API subdomain.

7. **Verify the deployment**
   - **DNS**: In Cloudflare → DNS, ensure A/CNAME records exist for the domain and the API subdomain.
   - **Worker**: Hit `https://api.<domain>/api/health` (or `/api/healthcheck`) once DNS propagates.
   - **Pages**: Cloudflare → Pages → project → confirm the build succeeded and the site responds at `https://<domain>`.

## Environment configuration

### Terraform inputs

- `cloudflare_api_token` (sensitive)
- `cloudflare_account_id`, `cloudflare_zone_id`
- `domain`, `api_subdomain`
- `github_repo`, `production_branch`, `production_branch_staging`
- `build_config` (`build_command`, `destination_dir`, `root_dir`) – adjust if your build output differs from `.vercel/output/static`.
- `frontend_environment_vars`, `api_environment_vars` – maps merged into the Pages project and Worker respectively.

### Worker variables

- `CORS_ORIGIN` (comma-separated list). Production defaults to `https://custos.space`, development to `*`; update via Terraform's `api_environment_vars` for multiple origins.

### Frontend variables

- `NEXT_PUBLIC_API_URL` is injected automatically by Terraform.
- Wallet connectivity expects `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` referenced in `frontend/src/components/Providers/Web3ModalProvider`.

## Local development

### API worker

```bash
cd workers/api
bun install
bun run dev
```

### Frontend

```bash
cd frontend
bun install
bun run dev
```

When running locally, set `NEXT_PUBLIC_API_URL` (for example via `.env.local`) so the app points to the dev worker or production endpoint.

## Deployment tips

- Build the frontend for Cloudflare before deploying:
  ```bash
  cd frontend
  rm -rf .open-next
  npx opennextjs-cloudflare build
  bunx wrangler deploy -c wrangler.jsonc -e production
  ```
- Use `bun` for consistency across local development and CI (`bun install`, `bun run dev`).
- The Worker build script (`bun run build`) performs a dry-run deploy for validation; review the generated bundle in `dist/` if you change dependencies.

## GitHub Actions & branch protections

- **`deploy-production.yml`** auto-builds the frontend with Bun/OpenNext and deploys to the production worker on every push to the `production` branch.
- **`deploy-staging.yml`** runs for pushes and pull requests targeting `staging`, deploying to the staging worker and optionally creating preview aliases per branch.
- **`protect-production.yml`** fails any pull request into `production` unless the source branch is `staging`, enforcing the `staging → production` promotion flow.
- Protect the `production` branch in GitHub (required reviews, status checks) so merges only happen via approved PRs from `staging`. Similarly, protect `staging` to ensure features merge via pull requests before promotion.

## Troubleshooting

- **Frontend routing**: Confirm `wrangler.jsonc` lists the production routes:

  ```json
  {
    "env": {
      "production": {
        "name": "cloudflare-fullstack-frontend",
        "routes": ["custos.space/*", "www.custos.space/*"]
      }
    }
  }
  ```

- **Monitoring**: Tail production worker logs with `bunx wrangler tail -c wrangler.jsonc -e production --format pretty`.

- **API errors**: The Hono app logs to `console.error`; inspect the Wrangler tail output for stack traces and ensure `CORS_ORIGIN` includes the calling origin.

## Useful commands quick reference

```bash
# Terraform
terraform fmt && terraform validate
terraform apply -target=module.cloudflare_dns

# Wrangler
bunx wrangler deploy -c workers/api/wrangler.jsonc -e production
bunx wrangler tail -c workers/api/wrangler.jsonc -e production --format pretty

# Health checks
curl -I https://custos.space
curl -i https://api.custos.space/api/health
```

Keep `steps.md` updated alongside infrastructure changes so this README remains accurate.
