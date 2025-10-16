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

Staging branch test
