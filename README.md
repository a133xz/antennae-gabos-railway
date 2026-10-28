# Gabos

Next.js site for Gabo's.

## Requirements

- Node 22+

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)

Copy and the shop catalog live in `src/content/records.ts`. Images, fonts, and brand files live in `public/`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run deploy:theme` | Upload changed `gabos-2026` files over FTP |

Shop checkout uses Stripe when the keys in `.env` are set and each product has a Stripe Price ID.
