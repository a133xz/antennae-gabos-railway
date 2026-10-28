# Gabos

Next.js site with [Payload CMS](https://payloadcms.com/).

## Requirements

- Node 22+

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Without `PAYLOAD_SECRET`, the site reads `src/content/records.ts`. With `PAYLOAD_SECRET` set, pages read the CMS. Set `GABOS_STATIC_PREVIEW=true` to force the static copy.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run generate:types` | Regenerate Payload types after schema changes |

## Structure

| Path | Purpose |
|------|---------|
| `src/payload.config.ts` | CMS config |
| `src/collections/` | Media, products, users |
| `src/globals/SiteSettings.ts` | Site copy and imagery |
| `src/content/site.ts` | CMS → frontend data |
| `src/content/records.ts` | Static copy |
| `src/app/(frontend)/` | Public pages |
| `public/` | Images, fonts, and brand files the site serves |

Content is edited in **Admin → Site Settings** and **Products** when the CMS is on. Shop checkout uses Stripe when keys and Price IDs are configured.
