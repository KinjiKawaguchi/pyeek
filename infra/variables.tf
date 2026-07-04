variable "vercel_team_id" {
  description = "Vercel team id。個人アカウントなら null。"
  type        = string
  default     = null
}

variable "github_repo" {
  description = "GitHub repo (owner/name)。"
  type        = string
  default     = "KinjiKawaguchi/pyeek"
}

variable "production_branch" {
  description = "Vercel が production deployment 扱いする branch。"
  type        = string
  default     = "main"
}

variable "cloudflare_zone" {
  description = "Cloudflare で管理している zone (例: example.tv)。"
  type        = string
}

variable "web_subdomain" {
  description = "Web app の subdomain (zone との組み合わせで FQDN)。"
  type        = string
  default     = "pyeek"
}
