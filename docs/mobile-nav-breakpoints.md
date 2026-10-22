# Responsive breakpoints

When requesting a change: **token or px**, **what**, **file**.

| Token / px | Role |
|------------|------|
| **500** (`globals.css`) | Header/cart link type → 70% on very small phones (not home hero layout). |
| **`max-md` / ≤767** | Mobile layout: home stack, shop grid, empty cart, store header burger + cart bar with links in overlay (`store-mobile-menu.tsx`), curtain JS (`gabos-curtain.ts` = 767). Home hero **shop** stays visible. |
| **`md` / ≥768** | Desktop-ish: hero monogram, cart/footer grids, nav `gap-x-8`, contact 2-col. |
| **`max-lg` / ≤1023** | Stacked store pages (cart, PDP, footer rhythm). |
| **`lg` / ≥1024** | PDP 2-col, about header grid, nav `gap-x-12`. |
| **1350** | Home + contact drapes 35%; contact link stack (`globals.css`). |
| **1469 / 1470** | Cart line columns ↔ PDP copy inset (`cart-view.tsx`, `globals.css`). |
| **1920 / 1921+** | Curtain `.wrapper` cap vs ultrawide edge drapes — not `lg`/`xl`/`2xl`. |

**Tailwind unused here:** `sm` (640), `xl` (1280), `2xl` (1536). In CSS, **1023/1024** = **`max-lg` / `lg`**. Prefer `md`/`lg` in components; raw px in `globals.css` is fine.

**Find usages:** grep `@media`, `max-md`, `max-lg`, `min-[`, `max-[`, `md:`, `lg:` under `src/`.
