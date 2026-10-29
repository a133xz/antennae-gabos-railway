# WooCommerce + Stripe (plan A — full integration)

Handoff doc for when you are ready to wire **real cart and checkout** on the live WordPress site. Production theme: **`gabos-2026/`** only. Deploy theme changes with `npm run deploy:theme`.

**Goal:** WooCommerce owns products, cart, checkout, and orders. **Stripe** handles payments via the official WooCommerce gateway. **Visitors keep the custom Gabos shop UI** at **`/shop/`** and **`/shop/{slug}/`** (theme templates), not the default Woo storefront look.

**Not in scope for this doc:** Reviving the Next.js app (`src/`) or its Stripe Checkout + Price ID model. Woo uses product prices in WP; you do not need per-product Stripe Price IDs unless you build something custom.

---

## What exists today

| Piece | Behavior |
|--------|----------|
| Public shop | Theme rewrites in `gabos-2026/functions.php` → `page-shop.php` (grid) and `page-shop-product.php` (PDP) |
| Catalog | `gabos-2026/inc/shop.php` — ACF fields on a **Page** (template **Shop**, slug **`shop-settings`**) or theme default assets in `assets/shop/cropped/` |
| Shop on/off | ACF **`shop_available`** on that page — off = coming soon on `/shop/`, cart link hidden |
| Cart | `gabos_2026_cart_url()` → `/cart/`; PDP “add to cart” is a **link**, not a real cart |
| Stripe | Not configured in WordPress |

Key files to know before you start:

- `gabos-2026/inc/shop.php` — catalog helpers, URLs, `gabos_2026_shop_available()`
- `gabos-2026/inc/fields.php` — ACF **Shop catalog** group
- `gabos-2026/template-parts/shop-*.php`, `store-header.php`, `shop-product-detail.php`
- `gabos-2026/style.css` — store/cart styling (including `.cart-empty`)

---

## Recommended approach (plan A)

1. Install **WooCommerce** + **WooCommerce Stripe Payment Gateway** on staging (then production).
2. Create **variable products** in Woo (size variations) with slugs that match your current PDP URLs (e.g. `f1-shorts-1`).
3. Change **`gabos_2026_shop_catalog()`** to load products from Woo while keeping the **same PHP array shape** templates already expect (`title`, `slug`, `price`, `description`, `sizes`, `image`, `gallery`, etc.).
4. Replace the PDP stub with a **real add-to-cart** (variation + size).
5. Add **Cart** and **Checkout** pages that use Woo shortcodes/blocks inside the Gabos store layout (or Woo template overrides under `gabos-2026/woocommerce/`).
6. Keep **`shop_available`** as the master switch for “coming soon” vs live shop + cart in the header.
7. After migration, **retire ACF product tabs** (optional: keep only **Shop live** + maybe “grid order” meta).

---

## Before you touch production

- [ ] Full backup (files + database).
- [ ] Staging site or local copy with the same theme and ACF.
- [ ] Stripe account; use **test mode** until one full test order works.
- [ ] Decide shipping: flat rate, free shipping, pickup only, etc. (Woo **Settings → Shipping**).

---

## Step 1 — Install plugins (WP admin)

1. **Plugins → Add New**
   - **WooCommerce** — run the setup wizard but **do not** rely on its default shop design; you will keep theme URLs.
   - **WooCommerce Stripe Payment Gateway** (by WooCommerce/Automattic).

2. After install: **Settings → Permalinks → Save** (flush rules).

---

## Step 2 — Permalinks and URL strategy (important)

You already have:

| URL | Purpose |
|-----|---------|
| `/shop/` | Public catalog (theme rewrite, **not** a normal Page) |
| `/shop/{slug}/` | PDP (theme rewrite) |
| `/shop-settings/` | Admin-only **Page**, template **Shop**, ACF settings |

WooCommerce wants a **Shop page** and usually uses **`/product/{slug}/`** for products. **Do not** assign Woo’s “Shop page” to `/shop/` without a plan — it will fight the theme rewrite.

**Recommended:**

1. Create a **hidden** WordPress page, e.g. title “Store (Woo)”, slug **`store`** or **`woo-shop`**. In **WooCommerce → Settings → Products → General**, set **Shop page** to that page. Visitors should never need this URL if the theme continues to serve `/shop/`.
2. Keep theme rules **`^shop/`** in `functions.php` as they are.
3. Product **slugs** in Woo must match what you use in URLs: `gabos_2026_shop_url('f1-shorts-1')` → product slug `f1-shorts-1`.
4. Optional: In **WooCommerce → Settings → Products → Permalinks**, you can change the product base — still use theme PDP routes for the public site; Woo slugs are what `gabos_2026_shop_product($slug)` will resolve.

After any permalink or rewrite change: **Settings → Permalinks → Save** and bump `gabos_2026_rewrite` in theme if you change rewrite logic (today version `3` in `functions.php`).

---

## Step 3 — Products in WooCommerce

For each item (start with your four catalog pieces):

1. **Products → Add new**
2. **Variable product** (if sizes matter).
3. **Attributes → Add `Size`** (or `pa_size` via global attribute **Size** with values XS, S, M, L, XL). Check **Used for variations**.
4. **Variations** — generate from Size; set **price** per variation (or same price on all).
5. **Slug** — match existing PDP URL (e.g. `f1-tank-top-black`).
6. **Images** — featured + gallery (grid card, hover, PDP shots). You can upload the same assets as in `assets/shop/cropped/` or media library from ACF.
7. **Catalog visibility** — visible when shop is live; theme still hides entire shop when `shop_available` is off.

**Ordering on the grid:** Woo `menu_order` on products, or a custom meta `gabos_grid_order`, read in `gabos_2026_shop_products()` when building from WC.

**Migration from ACF slots:** For each Product 1–4 tab, copy title, slug, price, sizes, description, images into the matching Woo product, then verify `/shop/{slug}/` still resolves via theme after catalog reads from Woo.

---

## Step 4 — Stripe (WooCommerce, not `.env`)

1. **WooCommerce → Settings → Payments → Stripe**
2. Enable Stripe; paste **test** publishable and secret keys from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys).
3. Turn on **Test mode** in the gateway settings.
4. Complete **webhook** setup as the plugin instructs (often “Connect” or copy signing secret into Woo). Required for reliable paid order status.
5. Place a **test order** on staging: add to cart → checkout → card `4242 4242 4242 4242`.
6. When ready for live: disable test mode, use **live** keys, update webhook to live endpoint.

Keys live in the **WordPress database** (Woo settings), not in this repo’s `.env` unless you later add a mu-plugin to inject them from env.

---

## Step 5 — WordPress pages: Cart and Checkout

1. **Pages → Add New**
   - **Cart** — slug **`cart`** (matches `gabos_2026_cart_url()`).
   - Content: Woo block **Cart** or shortcode `[woocommerce_cart]`.
2. **Checkout** — slug **`checkout`** (Woo often creates this; confirm slug).
   - Content: **Checkout** block or `[woocommerce_checkout]`.
3. **WooCommerce → Settings → Advanced** — assign Cart and Checkout pages.

**Theme work:** Wrap cart/checkout in the same shell as the shop (`gabos-store-page`, `store-header.php`, `landing-footer.php`) — either:

- Custom page templates `page-cart.php` / `page-checkout.php`, or
- `woocommerce/` overrides for cart and checkout templates.

Reuse classes in `style.css` (`.gabos-store-page`, `.cart-empty`, etc.).

Update **`gabos_2026_cart_url()`** in `inc/shop.php` when Woo is active:

```php
function gabos_2026_cart_url() {
    if (function_exists('wc_get_cart_url')) {
        return wc_get_cart_url();
    }
    return trailingslashit(home_url('/cart'));
}
```

---

## Step 6 — Theme code changes (for you or Cursor)

Use this checklist when you implement. Order matters.

### 6.1 WooCommerce support

In `gabos-2026/functions.php` (or `inc/woocommerce.php` required from there):

- `add_theme_support('woocommerce');`
- Dequeue default Woo styles if you want full control: `add_filter('woocommerce_enqueue_styles', '__return_empty_array');` and style in `style.css`.
- Optionally declare image sizes to match grid/PDP.

### 6.2 Catalog from WooCommerce

In `gabos-2026/inc/shop.php`:

- Add something like `gabos_2026_shop_catalog_from_woocommerce()` that:
  - Queries published products (category/tag if you use them).
  - Maps each `WC_Product` / `WC_Product_Variable` into the existing array shape.
  - Builds `image` / `gallery` from Woo attachment IDs (fallback to theme crop URLs if you keep defaults).
  - Reads sizes from available variations or attributes.
- Change `gabos_2026_shop_catalog()` priority, e.g. **Woo → ACF slots → default theme catalog** during migration, then **Woo → default** once ACF products are retired.
- Extend `gabos_2026_shop_product($slug)` to resolve via `wc_get_product_id_by_sku()` or `get_page_by_path($slug, OBJECT, 'product')` / WP query by slug.

Store **`wc_product_id`** and **`variation map`** (size label → variation_id) in the product array for the PDP form.

### 6.3 PDP add to cart

In `template-parts/shop-product-detail.php`:

- Replace the cart `<a>` with Woo’s variable add-to-cart:
  - Hidden fields: product id, variation id (updated when size changes).
  - Size UI: wire clicks to select variation (small theme JS or Woo’s variation script enqueued on PDP).
- Use `woocommerce_template_single_add_to_cart` only if you add a WC product global on that template; custom markup is fine if you POST to `?add-to-cart=` correctly.

Only show add to cart when `gabos_2026_shop_available()` is true (same as `$show_cart` on `page-shop-product.php`).

### 6.4 Shop live toggle + Woo

When **`shop_available`** is off:

- Keep current behavior: `page-shop.php` loads `shop-coming-soon.php`; hide cart in `store-header.php`.
- Add Woo guards so direct URLs do not bypass you:
  - Filter `woocommerce_is_purchasable` → false when shop off, or
  - `template_redirect` on cart/checkout to redirect to `/shop/` when off.

When **on:** purchasable, cart visible, normal checkout.

### 6.5 Cart count in header (optional)

Use `WC()->cart->get_cart_contents_count()` in `store-header.php` when Woo is loaded and shop is live.

### 6.6 ACF fields (`inc/fields.php`)

After Woo is source of truth:

- Remove Product 1–4 tabs and slot fields from **Shop catalog**, **or** keep slots only as “override order / featured” if needed.
- Keep **`shop_available`** and dynamic instructions.

---

## Step 7 — Testing checklist

- [ ] Shop **off**: `/shop/` shows coming soon; no cart link; cart/checkout not usable.
- [ ] Shop **on**: grid matches expectations; each `/shop/{slug}/` loads; size selection required.
- [ ] Add to cart updates cart; `/cart/` matches design.
- [ ] Checkout test payment (Stripe test card); order appears in **WooCommerce → Orders**.
- [ ] Email receipts (Woo → Settings → Emails) — send test.
- [ ] Mobile: header, cart link, checkout (see `docs/mobile-nav-breakpoints.md`).
- [ ] Permalinks: no 404 on `/shop/` or product slugs after flush.
- [ ] LiteSpeed/cache: purge after go-live; exclude cart/checkout from aggressive cache if needed.

---

## Step 8 — Production go-live

1. Migrate products on production (or export/import Woo products).
2. Live Stripe keys + live webhook.
3. **Shop live** toggle: leave **off** until smoke test done, then **on**.
4. `npm run deploy:theme` for any theme changes.
5. **Settings → Permalinks → Save** once on production.

---

## When you come back to this (Cursor / agent prompt)

Paste something like:

> Implement plan A in `docs/woocommerce-stripe.md`: Woo-backed catalog in `inc/shop.php`, real variable add-to-cart on PDP, cart/checkout pages with store layout, `shop_available` guards, `gabos_2026_cart_url()` → Woo. Staging-first; do not change `src/`.

That doc is the source of truth for URLs, files, and checklist.

---

## Reference — legacy Next.js Stripe (ignore for WP)

The repo’s `src/app/api/checkout/` and `stripePriceId` on products were for the old Next storefront. WooCommerce Stripe charges from cart line items; no need to duplicate that API in the theme unless you explicitly want Stripe Checkout instead of Woo checkout (not plan A).
