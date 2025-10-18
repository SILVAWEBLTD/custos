# Cloudflare Full-Stack (Custos)

This monorepo provisions a Cloudflare-native stack consisting of a D1 database, a Workers-based REST API built with Hono, and a Next.js 15 frontend deployed via Cloudflare Pages. Terraform configures all infrastructure, DNS records, bindings, and environment variables so the system can be stood up repeatably.

## Architecture

```
┌──────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐
│ Cloudflare Pages │◀────▶│  Next.js 15 Frontend    │      │  Wallet integrations │
└──────┬───────────┘      └──────────┬──────────────┘      └──────────────────────┘
       │ NEXT_PUBLIC_API_URL          │
┌──────▼───────────┐      ┌───────────▼───────────┐
│ Cloudflare Worker│◀────▶│  Hono REST API        │
└──────┬───────────┘      └───────────┬───────────┘
       │ D1 binding                    │
┌──────▼───────────┐                   │
│ Cloudflare D1    │◀──────────────────┘
└──────────────────┘
```

## Repository layout

| Path | Purpose |
| ---- | ------- |
| `terraform/` | Root Terraform configuration plus modules for D1, Workers, Pages, and DNS. |
| `frontend/` | Next.js application bundled with `@opennextjs/cloudflare` for Pages. |
| `workers/api/` | Hono API worker targeting D1 and exposing `/api/users`, `/api/posts`, and health endpoints. |
| `database/` | Cloudflare D1 assets and supporting SQL files. |
| `steps.md` | Field notes and caveats gathered during manual setup—mirrored throughout this README. |

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
     Development uses Turbopack (`next dev --turbopack`), but keep the production build command as plain `next build`—do not enable Turbopack for the build script per the caveat in `steps.md`.

5. **Configure Terraform variables**
   - Edit `terraform/terraform.tfvars` and set:
     ```hcl
     cloudflare_account_id = "..."
     cloudflare_zone_id    = "..."
     domain                = "silvaweb.org"
     project_name          = "custos-frontend-production"
     project_name_staging  = "custos-frontend-staging"
     github_repo           = "owner/repo"
     production_branch     = "production"
     production_branch_staging = "staging"
     api_subdomain         = "api"
     ```
   - Add optional maps for `frontend_environment_vars` and `api_environment_vars` (keep secrets out of version control by using Terraform variables or environment exports).

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

- `CORS_ORIGIN` (comma-separated list). Production defaults to `https://silvaweb.org`, development to `*`; update via Terraform’s `api_environment_vars` for multiple origins.

### Frontend variables

- `NEXT_PUBLIC_API_URL` is injected automatically by Terraform.
- Wallet connectivity expects `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (and the legacy spelling `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` referenced in `frontend/src/components/Providers/Web3ModalProvider`). Ensure at least one of these variables is defined in the Pages environment.

## Local development

### API worker

```bash
cd workers/api
bun install
bun run dev            # Wrangler dev on http://127.0.0.1:8771
```

### Frontend

```bash
cd frontend
bun install
bun run dev          # http://localhost:3000
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

- **DNS propagation**: If `curl https://api.<domain>` fails with `NXDOMAIN`, reapply just the DNS module and query authoritative nameservers:
  ```bash
  terraform apply -target=module.cloudflare_dns
  dig @jean.ns.cloudflare.com api.silvaweb.org A
  dig api.silvaweb.org A @1.0.0.1
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  ```
  As a temporary workaround, pin the resolve target: `curl -i --resolve api.silvaweb.org:443:104.21.49.95 https://api.silvaweb.org/api/health`.

- **Frontend routing**: Confirm `wrangler.jsonc` lists the production routes:
  ```json
  {
    "env": {
      "production": {
        "name": "cloudflare-fullstack-frontend",
        "routes": [
          "silvaweb.org/*",
          "www.silvaweb.org/*"
        ]
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
curl -I https://silvaweb.org
curl -i https://api.silvaweb.org/api/health
```

Keep `steps.md` updated alongside infrastructure changes so this README remains accurate.
