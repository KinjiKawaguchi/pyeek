# infra

Vercel + Cloudflare の deploy を Terraform で管理する(lol-draft-ai/infra と同じ構成)。

## 構成

| file | 内容 |
|------|------|
| `main.tf` | Terraform / provider 設定 |
| `vercel.tf` | Vercel project + custom domain attach |
| `cloudflare.tf` | DNS (zone lookup + CNAME → Vercel) |
| `variables.tf` | 入力変数 |
| `outputs.tf` | 公開 URL 等 |
| `terraform.tfvars.example` | 値の雛形 (実際は `terraform.tfvars` を別途用意、gitignore) |

## セットアップ

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# tfvars を編集して cloudflare_zone を実値に書き換え

export VERCEL_API_TOKEN=...        # vercel.com/account/tokens
export CLOUDFLARE_API_TOKEN=...    # dash.cloudflare.com/profile/api-tokens
                                   # 必要 scope: Zone:Read, DNS:Edit (該当 zone のみ)

terraform init
terraform plan
terraform apply
```

## state

当面 local state (`terraform.tfstate`, gitignore)。紛失すると `import` し直しで
復旧可だが、複数環境を持つようになったら HCP Terraform free tier に移行する。

## scope 外

以下は手動で続ける:

- Vercel account 作成 + API token 発行
- Cloudflare zone 登録 + API token 発行
- GitHub repo 作成
