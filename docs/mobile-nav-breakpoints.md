# Mobile nav & shop layout breakpoints

Quick reference for responsive nav and shop tweaks. When you want a change, say the **breakpoint (px)**, **what** (hide shop, font scale, etc.), and **where** (shop header, home hero, all pages).

## Summary

| Viewport | Behavior |
|----------|----------|
| **≤ 758px** | **shop** hidden only in **shop / cart / PDP / about headers** (`StoreNav`, `SiteHeader`). **Home hero always keeps shop.** |
| **≤ 500px** | Menu, book, contact, **shop** (home hero), and **cart** text **30% smaller** (70% of base size). |
| **≤ 767px** | `/shop` product grid stacks **vertically** (same breakpoint family as home mobile nav). |

Base nav sizes (above 500px):

- Shop / cart / PDP header links: **21px** (`StoreNav`, `CartLink`).
- About-style header (`SiteHeader`): **19px**.

---

## Hide **shop** at 758px (headers only — not home)

**Do not hide shop on the home page.** Home nav is `src/components/gabos-hero.tsx` + mobile stack rules in `globals.css` (≤767px); **shop** stays in the stack (order 5: logo → book → menu → contact → shop).

**Shop / about headers (Tailwind only)**

- `src/components/store-nav.tsx` — `max-[758px]:hidden` when `item.label === 'shop'`.
- `src/components/site-header.tsx` — same class on the shop `GabosNavLink`.

**To change:** Replace `758` / `max-[758px]` in those two files only. Do **not** add hide rules to `.gabos-hero-nav-shop`.

---

## Smaller Menu / book / contact / shop / cart at 500px

**CSS (main place to edit scale or breakpoint)**

`src/app/(frontend)/globals.css` — block `@media screen and (max-width: 500px)`:

- `.gabos-page-shop header nav a:not([href='/shop'])` and `.gabos-page-shop header .gabos-cart-link` → `calc(21px * 0.7)`.
- `.gabos-page-white header nav a:not([href='/shop'])` and `.gabos-page-white header .gabos-cart-link` → `calc(19px * 0.7)` (cart page uses `gabos-page-white` + `GabosStoreHeader`; cart must use the same rule as nav or it stays at 21px from Tailwind).
- `.gabos-hero-nav-menu`, `.gabos-hero-nav-shop`, `.gabos-hero-nav-book`, `.gabos-hero-nav-contact` → `font-size: 70%;`

Cart link class: `src/components/cart-link.tsx` → `.gabos-cart-link`.

**To change breakpoint:** Rename `500px` in that `@media` rule.

**To change amount smaller:** `0.7` = 30% smaller. Use `0.8` for 20% smaller, etc. For hero, match with `%` (e.g. `80%`).

**To include or exclude links:** Adjust selectors (e.g. drop `:not([href='/shop'])` on store headers if shop should scale when visible).

---

## Shop product column at 767px

`src/app/(frontend)/globals.css` — `@media screen and (max-width: 767px)`:

- `.shop-product-row` → `flex-direction: column`
- `.shop-product-row--fits-viewport` layout overrides on `.gabos-page-shop`

Not nav-related; listed here because it was set with the same mobile pass as home.

---

## Store header layout **≤ 758px only** (desktop unchanged)

**≥ 759px:** Exact 3-column grid as always — `grid-cols-[1fr_auto_1fr]`, three siblings: **gabos** | centered `StoreNav` | **cart** in `justify-end` column. **No `display: contents`**, no `lg` breakpoint on this layout.

**≤ 758px:** `grid-cols-[1fr_auto]`; desktop nav + cart rows are `max-[758px]:hidden`; a second block (same links, hidden on desktop) groups nav + cart on the **right** with **`gap-4`**.

Files: `src/components/gabos-store-header.tsx`, `src/components/store-nav.tsx` (optional `className` on nav).

---

## Nav always visible (no 1024px hide)

Center nav is **not** gated on `lg` anymore:

- `src/components/store-nav.tsx` — `flex` at all widths (wrap + tighter gaps on small screens).
- `src/components/site-header.tsx` — same.

There is **no** hamburger overlay on shop; `src/components/mobile-nav.tsx` is unused unless wired again.

---

## Prompt cheat sheet (for you or the agent)

Examples:

- “At **600px** hide shop on **shop header only**” → update **758** → **600** in `store-nav.tsx` and `site-header.tsx` only — **not** `gabos-hero.tsx`.
- “Below **480px** make menu/book/contact/cart **40% smaller**” → `@media (max-width: 480px)` and `calc(21px * 0.6)` / hero `60%`.
- “Show shop on mobile shop header again” → remove `max-[758px]:hidden` from store-nav / site-header.
- “Stack products at **800px**” → change `767px` in `.shop-product-row` media query.
