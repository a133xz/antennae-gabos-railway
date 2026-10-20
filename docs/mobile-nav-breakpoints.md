# Responsive breakpoints (full inventory)

Reference for **every** viewport threshold in the Gabos frontend: Tailwind presets, custom CSS `@media`, arbitrary Tailwind classes, layout caps, and JS. Use this when tuning nav, shop, cart, PDP, or home.

**How to request a change:** breakpoint (px), **what** should change, **where** (file or page).

---

## At a glance

| px | Kind | Role in the app |
|----|------|-----------------|
| **500** | CSS `max-width` | Shop / cart / about **header** link + cart text → 70% of 21px / 19px (not home hero). |
| **640** | Tailwind `sm` | Wider nav link gaps; contact form 2 columns. |
| **758** | Tailwind `max-[758px]` | **Custom only** — hide **shop** in store/about headers; shop header 2-column grid + nav/cart grouped right. |
| **767** | CSS `max-width` + JS | **Primary “mobile”** — home vertical nav, shop product stack, empty cart layout, curtain animation (`gabos-curtain.ts`). |
| **768** | Tailwind `md` + CSS `min-width: 768px` | Cart/footer 3-column grids, hero monogram swap, landing huellas offset, cart line desktop layout, empty-cart min-heights. |
| **1023** | CSS `max-width` | Stacked PDP/cart/footer vertical rhythm (`store-vertical-stack`, `.landing-footer` flex). |
| **1024** | Tailwind `lg` + CSS `min-width: 1024px` | PDP 2-column grid + sticky copy; about header 3-column grid; PDP copy top inset; unused `mobile-nav` would hide at `lg+`. |
| **1350** | CSS `max-width` | Side curtain width (35% each); contact/legacy link container typography. |
| **1469–1471** | Mixed | Cart line row: photo–detail–price grid variant (see [Cart width band](#cart-line-row-1469--1471)). PDP copy extra inset in CSS uses **1471**. |
| **1920** | CSS layout cap | `.wrapper` default `max-width: 1920px` (centered stage). |
| **1921** | CSS `min-width` | Ultrawide: wrapper uncapped; fixed curtains full viewport edges. |

Tailwind **xl** (1280) and **2xl** (1536) are **not used** in components today.

---

## Tailwind defaults (v4, `@import 'tailwindcss'`)

| Token | Min width | Used for |
|-------|-----------|----------|
| `sm:` | **640px** | `site-header.tsx`, `gabos-store-header.tsx` — `gap-x-8`; `contact-form.tsx` — 2-col grid. |
| `md:` | **768px** | Hero logo, landing footer/huellas, **entire cart desktop layout**. |
| `lg:` | **1024px** | About `SiteHeader` grid, PDP 2-col + sticky, home panel width, PDP add-to-cart spacing, cart min-height / actions margin. |
| `xl:` / `2xl:` | 1280 / 1536 | — |

**CSS vs Tailwind at the “tablet” edge:** many rules use **`max-width: 767px`** while Tailwind `md:` applies at **`min-width: 768px`**. They meet at one pixel (767 mobile / 768 desktop) and are intentional pairs, not duplicates—except where **758** is also used (see below).

---

## Overlap and consolidation (recommended targets)

These are the breakpoints that feel “one too many” today. No code change here—just what to align if you simplify later.

### 1. **758px vs 767px / `md` (768)** — highest priority

| Width | Home hero | Shop header (`GabosStoreHeader`) | Hide shop (store + about headers) |
|-------|-----------|----------------------------------|-----------------------------------|
| **≤758** | Mobile stack | 2-col, nav+cart right | Hidden |
| **759–767** | Mobile stack | **Still 3-col desktop**, shop **visible** | Visible |
| **≥768** | Mobile stack until… wait, home uses **767** max for stack | 3-col desktop | Visible |

Home flips at **767**; shop header layout + hide-shop flip at **758**. That leaves a **9px band (759–767)** where home is already “mobile” but the shop header still looks desktop and still shows **shop**.

**Likely fix:** pick one mobile nav width—usually **`767` / `max-md` (≤767)** or **`768` / `md` breakpoint**—and replace all `758` in:

- `src/components/gabos-store-header.tsx`
- `src/components/store-nav.tsx`
- `src/components/site-header.tsx`

### 2. **1023 vs 1024 vs `lg`**

CSS uses `max-width: 1023px` and `min-width: 1024px`; Tailwind `lg:` is **1024px**. Same boundary, two syntaxes. Safe to keep (CSS can’t use `lg:`), but document as **one “stacked store pages” breakpoint at 1024**.

### 3. **1469 / 1470 / 1471** — off by 1–2px

| Source | Rule |
|--------|------|
| `cart-view.tsx` | `md:max-[1469px]:…` and `min-[1470px]:…` |
| `globals.css` | `@media (min-width: 1024px) and (max-width: 1471px)` for PDP copy inset |

At **1470px** viewport, cart and PDP mid-band rules can disagree by a pixel. **Likely fix:** one constant (e.g. **1470**) for both cart Tailwind and PDP CSS.

### 4. **720 vs 767 (JS)**

- `public/curtain/curtain.js` (legacy theme): mobile at **≤720**.
- `src/lib/gabos-curtain.ts`: **≤767** (`CURTAIN_MOBILE_MAX_PX`).

Only matters if both scripts run on the same page; app port intentionally uses **767** to match CSS home nav.

### 5. **500px**

Standalone threshold only for shrinking **header** nav/cart type. Home hero already scales at **767** (`font-size: calc(1.3125rem * 0.75)` on `.gabos-home`, not at 500). Could merge into **`max-md`** with a smaller scale step, or keep as “very small phones only.”

### 6. **1350px and 1920/1921**

Layout/curtain concerns, not nav. Keep unless you redesign home/contact curtains.

### 7. **About header vs shop header**

- **Shop/cart/PDP:** `GabosStoreHeader` — compact layout at **758**, always flex/grid nav (no hamburger).
- **About-style:** `SiteHeader` — flex until **`lg` (1024)**, then 3-column grid; hide shop still at **758** only.

Different header components → different breakpoints for grid layout (**758** vs **1024**).

---

## By feature

### Hide **shop** (headers only — not home)

Home keeps **shop** in the vertical stack (`globals.css` ≤767; order: logo → book → menu → contact → shop).

**≤758px only (Tailwind arbitrary):**

- `src/components/store-nav.tsx` — `max-[758px]:hidden` when label is shop.
- `src/components/site-header.tsx` — same on shop link.

Do **not** hide shop on `.gabos-hero-nav-shop`.

---

### Shop / cart header layout (**758**)

**≥759px:** 3-column grid — gabos | centered `StoreNav` | cart.

**≤758px:** `grid-cols-[1fr_auto]`; primary nav + cart hidden; duplicate nav+cart block on the right (`gap-4`).

File: `src/components/gabos-store-header.tsx`.

Nav gaps: `gap-x-4` → `sm:gap-x-8` (640+) → `lg:gap-x-12` (1024+) on the desktop nav instance.

---

### Smaller header links (**500**)

`src/app/(frontend)/globals.css` — `@media (max-width: 500px)`:

- `.gabos-page-shop` header nav (except shop link) + `.gabos-cart-link` → `calc(21px * 0.7)`.
- `.gabos-page-white` same → `calc(19px * 0.7)`.

Cart class: `src/components/cart-link.tsx` → `.gabos-cart-link`.

**Home hero:** no 500px rule. At **≤767**, hero links use `1.3125rem` and `.gabos-home` body/h1 use **75%** scale in the same media block.

---

### Home hero + landing (**767**)

`globals.css` `@media (max-width: 767px)` (single large block):

- Vertical centered nav stack; hero photo hidden; burgundy mobile home background.
- Smaller huella width (70% of desktop token).
- `.landing-panel-inner` padding tied to huellas + `18vh` (pairs with `landing-huellas.tsx` `max-md:-translate-y-[calc(15%+18vh)]`).

`gabos-hero.tsx`: full wordmark **`md:hidden`**; monogram **`md:block`** (≥768).

JS: `src/lib/gabos-curtain.ts` — `innerWidth <= 767` for mobile curtain behavior.

---

### Shop product grid (**767**)

`globals.css` `@media (max-width: 767px)` (second block):

- `.shop-product-row` → column stack; centered cards.
- `.shop-product-row--fits-viewport` page height/centering overrides on `.gabos-page-shop`.

---

### Cart empty state (**767** / **768**)

- **≤767:** empty cart main/footer padding — in-flow center between header and footer.
- **≥768:** `.gabos-page-white .cart-line:only-child` min-height scaling.

---

### Stacked store pages: cart, PDP, footer (**1023** / **1024**)

`globals.css`:

- **≤1023:** `.store-vertical-stack`, `.landing-footer` flex column + gap tokens; PDP photos stack, crop nudge reset, main/footer edge gaps (`--store-vertical-edge-gap: 104px`).
- **≥1024:** `.shop-detail-copy` padding-top (`--shop-detail-text-offset`); footer brand group `display: contents`.
- **1024–1471:** PDP copy `--shop-detail-copy-inset-mid` on `.shop-detail-copy`.

Component: `store-vertical-stack.tsx` (classes only; behavior in CSS).

PDP page: `shop/[slug]/page.tsx` — `lg:grid-cols-2`, `lg:sticky` (≥1024).

---

### Cart desktop layout (`md` + width band)

`src/components/cart-view.tsx`:

- **&lt;768:** stacked line items; price inline; empty message flex-centered in main.
- **≥768:** parent grid `md:grid-cols-[1fr_auto_1fr]` (matches `LandingFooter`); line rows subgrid; actions row 2 with `lg:mt-[42px]`.

**Cart line row** ([Cart width band](#cart-line-row-1469--1471)):

- **768–1469:** `421px | 1fr | auto` — detail centered between photo and price.
- **≥1470:** `1fr | auto | 1fr` — detail viewport-centered (footer/checkout alignment).

---

### Cart line row (1469 / 1471)

| Viewport | Cart line columns (`cart-view.tsx`) | PDP copy inset (`globals.css`) |
|----------|-------------------------------------|--------------------------------|
| 768–1469 | `minmax(0,421px) 1fr auto` | — |
| 1024–1471 | — | Extra `--shop-detail-copy-inset-mid` |
| ≥1470 | `1fr auto 1fr` | Mid inset ends at 1471 in CSS |

Consider unifying on **1470** for both.

---

### Landing footer (`md`)

`src/components/landing-footer.tsx`:

- **&lt;768:** single column, centered.
- **≥768:** `md:grid-cols-[1fr_auto_1fr]`; logo left; legal right; place name tracking tweaks (`max-md` vs `md:`).

CSS **≤1023** also flex-stacks `.landing-footer` on stacked store pages (overrides grid behavior in that context via flex rules in the 1023 block).

---

### Curtains and wrapper width (**1350**, **1920**, **1921**)

- Default `.wrapper` **max-width 1920px**, centered.
- **≤1350:** curtain panels 35% width each; contact/link container max widths.
- **≥1921:** wrapper `max-width: none`; fixed curtains clamp to viewport sides; scroll wrapper curtain positioning tweak.

---

### Unused / legacy

- `src/components/mobile-nav.tsx` — `lg:hidden` hamburger shell; **not wired** (no overlay on shop).
- `public/curtain/curtain.js` — **720px** mobile; superseded by `gabos-curtain.ts` at **767** where the port is used.

---

## Base typography (headers)

Above **500px** (and where header rules apply):

| Context | Size |
|---------|------|
| Shop / cart / PDP header links | **21px** (`StoreNav`, `CartLink`) |
| About-style `SiteHeader` | **19px** |

---

## Prompt cheat sheet

Examples:

- “Use **767 everywhere** instead of **758** for shop header + hide shop” → replace `758` / `max-[758px]` in `gabos-store-header.tsx`, `store-nav.tsx`, `site-header.tsx`; test **759–767** band.
- “Below **480px**, header links **40% smaller**” → change `500px` media query and `0.7` multipliers in `globals.css`.
- “Show shop on small shop header again” → remove `max-[758px]:hidden` from store-nav / site-header.
- “Stack products at **800px**” → change `767px` in `.shop-product-row` media queries (and likely home hero block if they should match).
- “Align cart and PDP wide breakpoint” → use one px (e.g. **1470**) in `cart-view.tsx` and `globals.css` `1471` rule.

---

## File index (breakpoint definitions)

| File | Breakpoints |
|------|-------------|
| `src/app/(frontend)/globals.css` | 500, 767, 768, 1023, 1024, 1024–1471, 1350, 1921; wrapper 1920 cap |
| `src/components/gabos-store-header.tsx` | 758, sm, lg |
| `src/components/store-nav.tsx` | 758 |
| `src/components/site-header.tsx` | 758, sm, lg |
| `src/components/gabos-hero.tsx` | md (768) |
| `src/components/landing-footer.tsx` | md |
| `src/components/landing-huellas.tsx` | md / max-md |
| `src/components/cart-view.tsx` | md, lg, 1469, 1470 |
| `src/app/(frontend)/shop/[slug]/page.tsx` | lg |
| `src/app/(frontend)/page.tsx` | lg |
| `src/components/add-to-cart-form.tsx` | lg |
| `src/components/contact-form.tsx` | sm |
| `src/lib/gabos-curtain.ts` | 767 (JS) |
| `public/curtain/curtain.js` | 720 (legacy JS) |

*Last reviewed against repo: full grep of `@media`, `max-[` / `min-[`, Tailwind `sm`/`md`/`lg`, and `innerWidth` checks.*
