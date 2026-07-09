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

  # OGP画像生成(/api/og)がgetSiteUrl()経由でVERCEL_URL/VERCEL_ENVを
  # 参照するため、Deploymentへの自動注入を有効化する(デフォルトOFF)。
  automatically_expose_system_environment_variables = true

  # SlackのOGP unfurlボット等、未認証アクセスからPreview Deploymentへの
  # 到達を許可するため、Deployment Protectionを無効化する。
  # publicなOSSでコード自体に秘匿性が無いため許容している判断。
  vercel_authentication = {
    deployment_type = "none"
  }
}

resource "vercel_project_domain" "web" {
  project_id = vercel_project.web.id
  domain     = local.web_fqdn
}
