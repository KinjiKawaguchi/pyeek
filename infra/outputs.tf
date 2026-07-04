output "web_fqdn" {
  description = "公開 URL の host (https で配信)。"
  value       = local.web_fqdn
}

output "vercel_project_id" {
  description = "Vercel project id。dashboard URL: https://vercel.com/dashboard で参照。"
  value       = vercel_project.web.id
}
