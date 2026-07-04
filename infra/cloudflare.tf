data "cloudflare_zones" "primary" {
  filter {
    name = var.cloudflare_zone
  }
}

locals {
  cloudflare_zone_id = data.cloudflare_zones.primary.zones[0].id
}

resource "cloudflare_record" "web" {
  zone_id = local.cloudflare_zone_id
  name    = var.web_subdomain
  content = "cname.vercel-dns.com"
  type    = "CNAME"
  ttl     = 1     # 1 = auto
  proxied = false # Vercel が TLS 終端する。
}
