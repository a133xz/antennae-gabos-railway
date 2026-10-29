# WordPress production (post-transition)

The public site runs on **WordPress** with theme **`gabos-2026/`**.

The **Next.js app** under `src/` is legacy / reference. Do not treat it as production unless we explicitly revive it.

## Deploy

```bash
npm run deploy:theme
```

- Uploads **only** files under `gabos-2026/` (git-changed by default; use `--all` for full theme sync).
- Does **not** deploy `src/`, `globals.css`, or any React components.

Credentials: `.env` (see `.env.example`).

## Where to change things

| Area | Location |
|------|----------|
| Shop grid, PDP, coming soon, catalog | `gabos-2026/inc/shop.php`, `page-shop.php`, `page-shop-product.php`, `template-parts/shop-*`, `assets/shop/cropped/` |
| Shop on/off & products | **Pages → Add New** (or edit **Shop**): template **Shop**, permalink slug **shop-settings**. Tabs Product 1–4. If all four slots empty → theme default catalog. Public URL stays **/shop/** |
| `/shop/{slug}` | Product URLs when shop is live (see `gabos_2026_shop_url()`) |
| Cart (future) | `gabos_2026_cart_url()` → `/cart/` — see **`docs/woocommerce-stripe.md`** for Woo + Stripe plan |
| Breakpoints | `docs/mobile-nav-breakpoints.md`, `gabos-2026/style.css` |

## Cursor

Project rule **wordpress-production** (`.cursor/rules/wordpress-production.mdc`) tells agents to default to WordPress-only edits.
