terraform {
  required_version = ">= 1.6"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # State は当面ローカル(lol-draft-ai/infra と同じ運用)。
  # cloud {
  #   organization = "..."
  #   workspaces { name = "pyeek" }
  # }
}

provider "vercel" {
  # VERCEL_API_TOKEN env var を参照。team 指定が要る場合のみ team_id を渡す。
  team = var.vercel_team_id
}

provider "cloudflare" {
  # CLOUDFLARE_API_TOKEN env var を参照。
  # 必要 scope: Zone:Read, DNS:Edit (該当 zone のみ)。
}
