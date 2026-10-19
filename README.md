# Gabos

Local Next.js site with Payload CMS for Gabo's (supper club & cocktail bar, Madrid). The public site reads from Postgres. Edit copy, hero, editorial image, and navigation in the admin.

The previous Shopify theme is preserved in **`gabos-shopify`**.

## Run

```bash
npm install
createdb gabos   # if needed
npm run seed
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Local login after seeding, from `.env`:

- Email: `editor@gabos.test`
- Password: value of `SEED_PASSWORD` in `.env`

Postgres must be running. `.env` should point at `postgres://antonio@localhost:5432/gabos` (adjust user/host as needed).

**Site settings** holds the statement, address, origin line, Instagram, hero and editorial images, and nav links (V2: Menu, shop, book, contact). **Products** powers `/shop` with Stripe Checkout. **Media** and **Users** are the other collections.

`npm run seed` creates the admin user, initial globals/media (first run), V2 nav links, and demo products. It does not overwrite existing product rows.

Stripe setup: see **[docs/stripe-setup.md](docs/stripe-setup.md)**. Deploy for design review without CMS: **[docs/design-preview-deploy.md](docs/design-preview-deploy.md)**.

## Where things live

| Path | What it is |
|---|---|
| `src/payload.config.ts` | Payload config |
| `src/collections` | Media, products, users |
| `src/app/(frontend)/shop` | Shop grid and product pages |
| `docs/stripe-setup.md` | Stripe keys, Price IDs, webhooks |
| `src/globals/SiteSettings.ts` | Landing copy, nav, imagery |
| `src/content/site.ts` | Payload → page data |
| `src/content/records.ts` | First seed only |
| `public/brand` | Monogram and wordmark SVGs |
| `public/media` | Seed hero and editorial images |

## Deploy later

Preview on Vercel without Payload: **[docs/design-preview-deploy.md](docs/design-preview-deploy.md)**.

Full stack: hosted Postgres, blob storage for uploads, a strong `PAYLOAD_SECRET`, seed once, then edit in `/admin`. Checkout: **[docs/stripe-setup.md](docs/stripe-setup.md)**.
