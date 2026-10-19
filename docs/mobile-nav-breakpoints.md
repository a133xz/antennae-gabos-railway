# Mobile nav & shop layout breakpoints

Quick reference for responsive nav and shop tweaks. When you want a change, say the **breakpoint (px)**, **what** (hide shop, font scale, etc.), and **where** (shop header, home hero, all pages).

## Summary

| Viewport | Behavior |
|----------|----------|
| **≤ 758px** | **shop** link hidden in nav (Menu, book, contact, cart stay visible). |
| **≤ 500px** | Menu, book, contact, and **cart** text **30% smaller** (70% of base size). |
| **≤ 767px** | `/shop` product grid stacks **vertically** (same breakpoint family as home mobile nav). |

Base nav sizes (above 500px):

- Shop / cart / PDP header links: **21px** (`StoreNav`, `CartLink`).
- About-style header (`SiteHeader`): **19px**.

---

## Hide **shop** at 758px

**Shop header & about header (Tailwind)**

- `src/components/store-nav.tsx` — `max-[758px]:hidden` when `item.label === 'shop'`.
- `src/components/site-header.tsx` — same class on the shop `GabosNavLink`.

**Home hero**

- `src/components/gabos-hero.tsx` — `max-[758px]:hidden` on the shop link.
- `src/app/(frontend)/globals.css` — `@media (max-width: 758px)` sets `.gabos-hero-nav-shop { display: none !important; }` so the **767px** mobile stack CSS does not force shop visible.

**To change:** Replace `758` / `758px` / `max-[758px]` everywhere above with your new width (keep Tailwind arbitrary value and CSS media query in sync).

---

## Smaller Menu / book / contact / cart at 500px

**CSS (main place to edit scale or breakpoint)**

`src/app/(frontend)/globals.css` — block `@media screen and (max-width: 500px)`:

- `.gabos-page-shop header nav a:not([href='/shop'])` → `font-size: calc(21px * 0.7);`
- `.gabos-page-shop .gabos-cart-link` → same (cart uses class on `CartLink` in `src/components/cart-link.tsx`).
- `.gabos-page-white header nav a:not([href='/shop'])` → `calc(19px * 0.7)`.
- `.gabos-hero-nav-menu`, `.gabos-hero-nav-book`, `.gabos-hero-nav-contact` → `font-size: 70%;`

**To change breakpoint:** Rename `500px` in that `@media` rule.

**To change amount smaller:** `0.7` = 30% smaller. Use `0.8` for 20% smaller, etc. For hero, match with `%` (e.g. `80%`).

**To include or exclude links:** Adjust selectors (e.g. drop `:not([href='/shop'])` if shop should scale too when visible).

---

## Shop product column at 767px

`src/app/(frontend)/globals.css` — `@media screen and (max-width: 767px)`:

- `.shop-product-row` → `flex-direction: column`
- `.shop-product-row--fits-viewport` layout overrides on `.gabos-page-shop`

Not nav-related; listed here because it was set with the same mobile pass as home.

---

## Nav always visible (no 1024px hide)

Center nav is **not** gated on `lg` anymore:

- `src/components/store-nav.tsx` — `flex` at all widths (wrap + tighter gaps on small screens).
- `src/components/site-header.tsx` — same.

There is **no** hamburger overlay on shop; `src/components/mobile-nav.tsx` is unused unless wired again.

---

## Prompt cheat sheet (for you or the agent)

Examples:

- “At **600px** hide shop” → update **758** → **600** in files under [Hide shop](#hide-shop-at-758px).
- “Below **480px** make menu/book/contact/cart **40% smaller**” → `@media (max-width: 480px)` and `calc(21px * 0.6)` / hero `60%`.
- “Show shop again on mobile” → remove `max-[758px]:hidden` and the `.gabos-hero-nav-shop` 758px CSS block.
- “Stack products at **800px**” → change `767px` in `.shop-product-row` media query.
