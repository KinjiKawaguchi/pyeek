locals {
  web_fqdn = "${var.web_subdomain}.${var.cloudflare_zone}"
}

resource "vercel_project" "web" {
  name      = "pyeek"
  framework = "nextjs"

  git_repository = {
    type              = "github"
    repo              = var.github_repo
    production_branch = var.production_branch
  }

  # `pnpm build` を明示。デフォルトの `next build` だと prebuild
  # (scripts/copy-pyodide.mjs) が走らず public/pyodide, public/py が
  # 生成されない(lol-draft-ai/infra で踏んだのと同種の教訓)。
  build_command = "pnpm build"
}

resource "vercel_project_domain" "web" {
  project_id = vercel_project.web.id
  domain     = local.web_fqdn
}
