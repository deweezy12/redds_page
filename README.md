# theredds.eu (GitHub Pages)

This repo now contains a plain static website for GitHub Pages.

## Files
- `index.html`: main website page
- `CNAME`: custom domain (`theredds.eu`)
- `.nojekyll`: serves files as-is (no Jekyll processing)

## Publish steps (GitHub)
1. Push this repo to GitHub.
2. Open `Settings -> Pages`.
3. Under `Build and deployment`, set:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` and folder `/ (root)`
4. Confirm `Custom domain` is `theredds.eu`.
5. Enable `Enforce HTTPS` after DNS is resolving.

## DNS on NETIM
Set these records for `theredds.eu`:
- `A` -> `185.199.108.153`
- `A` -> `185.199.109.153`
- `A` -> `185.199.110.153`
- `A` -> `185.199.111.153`
- `AAAA` -> `2606:50c0:8000::153`
- `AAAA` -> `2606:50c0:8001::153`
- `AAAA` -> `2606:50c0:8002::153`
- `AAAA` -> `2606:50c0:8003::153`

Optional for `www`:
- `CNAME` `www` -> `<your-github-username>.github.io`

Avoid wildcard DNS records like `*.theredds.eu`.

PowerShell DNS check:
- `Resolve-DnsName theredds.eu -Type A`
- `Resolve-DnsName theredds.eu -Type AAAA`

DNS propagation may take from minutes up to 24-48 hours.
