# Gabos

Next.js site with [Payload CMS](https://payloadcms.com/) and PostgreSQL.

## Requirements

- Node 22+
- PostgreSQL

## Setup

```bash
npm install
cp .env.example .env
createdb gabos   # if needed
npm run seed
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Set `DATABASE_URL`, `PAYLOAD_SECRET`, `SEED_EMAIL`, and `SEED_PASSWORD` in `.env` before seeding. Admin login uses the seed email and password from `.env`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run seed` | Initial admin, site settings, demo products |
| `npm run generate:types` | Regenerate Payload types after schema changes |

## Structure

| Path | Purpose |
|------|---------|
| `src/payload.config.ts` | CMS config |
| `src/collections/` | Media, products, users |
| `src/globals/SiteSettings.ts` | Site copy, nav, imagery |
| `src/content/site.ts` | CMS → frontend data |
| `src/app/(frontend)/` | Public pages |
| `public/media`, `public/brand` | Static assets |

Content is edited in **Admin → Site Settings** and **Products**. Shop checkout uses Stripe when keys and Price IDs are configured in `.env` and the CMS.
