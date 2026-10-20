# Railway deploy (CMS + Postgres) + Vercel (static preview)

Use **two hosts** from the same repo:

| Host | Purpose | Content mode |
|------|---------|--------------|
| **Vercel** | Fast UI preview for design / stakeholders | Static from `src/content/records.ts` |
| **Railway** | Client demo with `/admin`, live CMS, Postgres | Payload + Postgres |

No code fork: mode is chosen only by **environment variables** (see [design-preview-deploy.md](./design-preview-deploy.md)).

## Is ~$5/month on Railway enough?

For **~2,000 visits/month** (~65/day), compute is tiny. What matters is Railway billing model:

- **Hobby** is **$5/month subscription** and includes **$5 of usage credit** on that plan.
- You run **two services**: the Next.js app + **PostgreSQL**. Postgres always consumes some RAM/storage, so total usage often lands around **~$8–15/month** depending on size and idle time—not catastrophic for a client site, but **not guaranteed to stay inside $5 credit alone**.
- If you need to minimize cost: keep one small web service, avoid extra replicas, and use a **volume** only if you upload media in `/admin` (see below).

For a restaurant marketing site at that traffic level, Railway is **more than enough** on performance; budget a little above the bare $5 if Postgres is on the same project.

## Vercel (unchanged — static)

In Vercel → Project → Settings → Environment Variables (Production + Preview):

```env
GABOS_STATIC_PREVIEW=true
```

Do **not** set `PAYLOAD_SECRET` or `DATABASE_URL` on Vercel (simplest), **or** set them but keep `GABOS_STATIC_PREVIEW=true` so the public site still reads `records.ts`.

Redeploy after changes.

## Railway CLI (login once)

From the repo root:

```bash
npm install
npm run railway:login
```

Browser opens; approve access. Check:

```bash
npx railway whoami
```

### Automated setup (Postgres + variables)

After login, one command creates/links the project, adds Postgres if missing, copies `DATABASE_URL` to the web service, and sets `PAYLOAD_SECRET`, `NODE_ENV`, and seed credentials:

```bash
npm run railway:setup
# after the web service has deployed successfully:
npm run railway:setup:seed
# or: npm run railway:seed
```

The script skips reusing `PAYLOAD_SECRET` from local `.env` when it contains `local-dev` and generates a production secret instead.

### Local dev against live Postgres

In `.env`:

```env
GABOS_USE_LIVE_DATABASE=false   # local Postgres
GABOS_USE_LIVE_DATABASE=true    # Railway Postgres (same data as production)
DATABASE_URL_LIVE=              # filled by npm run railway:sync-env
PAYLOAD_SECRET_LIVE=            # optional; filled by sync-env for /admin against live DB
```

```bash
npm run railway:sync-env    # pulls public DB URL (+ prod Payload secret) from Railway
npm run railway:sync-seed   # pushes SEED_EMAIL / SEED_PASSWORD from .env to Railway
```

Restart `npm run dev` after toggling `GABOS_USE_LIVE_DATABASE`.

Useful scripts (also in `package.json`):

```bash
npm run railway:login    # same as npx railway login
npm run railway:link     # link this folder to a Railway project
npm run railway:seed     # run seed in Railway's environment (after link + Postgres)
```

## One-time Railway project setup

### 1. Create project and link repo

**Dashboard (easiest for client sharing):**

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → select `gabos`.
2. Railway creates a **Web** service from the repo (`railway.toml` + Nixpacks build).

**CLI (alternative):**

```bash
npx railway init
# follow prompts: new project, name e.g. gabos-client
```

Then in the dashboard, connect the GitHub repo to the web service if it is not auto-connected.

### 2. Add PostgreSQL

In the same Railway project:

1. **+ New** → **Database** → **PostgreSQL**.
2. Open the **Web** service → **Variables** → **Add reference** (or “Connect”):
   - Reference **`DATABASE_URL`** from the Postgres service (Railway injects the URL).

### 3. Web service variables

On the **Web** service (not Postgres), set these **before the first deploy** (Payload reads `PAYLOAD_SECRET` at build time):

| Variable | Required | Value |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Reference from Postgres service (Variables → Add variable → Reference) |
| `PAYLOAD_SECRET` | Yes | Random secret — **this is the “Payload key”** (not Stripe, not an API key from payloadcms.com). Generate locally: `openssl rand -base64 32` |
| `NODE_ENV` | Yes | `production` |

Example (generate your own; do not reuse this exact value in production):

```bash
openssl rand -base64 32
# paste output into Railway as PAYLOAD_SECRET
```

**CLI** (after `npm run railway:link`, with the web service selected):

```bash
npx railway variables set PAYLOAD_SECRET="$(openssl rand -base64 32)"
```

**Do not set** `GABOS_STATIC_PREVIEW` on Railway (or set it to `false`). With `PAYLOAD_SECRET` + `DATABASE_URL`, the public site and `/admin` use Payload instead of `records.ts`.

Optional (seed defaults, only needed when running seed):

| Variable | Value |
|----------|--------|
| `SEED_EMAIL` | Admin email for `/admin` |
| `SEED_PASSWORD` | Admin password |

Stripe (later): same vars as [stripe-setup.md](./stripe-setup.md)—only when you enable checkout.

### 4. Deploy

Push to the connected branch or click **Deploy** in Railway. Build runs `npm run build`; start runs `npm run start` (see `railway.toml`).

Copy the public URL (e.g. `https://gabos-production.up.railway.app`) for the client.

### 5. Seed production database (once)

After the first successful deploy and Postgres is linked:

**From your machine** (with Railway CLI linked to the project):

```bash
npm run railway:seed
```

Or locally against the same DB:

```bash
# Use DATABASE_URL + PAYLOAD_SECRET from Railway web service variables
npm run seed
```

Then open `https://YOUR-RAILWAY-URL/admin` and log in with `SEED_EMAIL` / `SEED_PASSWORD`.

### 6. Media uploads (recommended for client CMS)

Payload stores uploads under `public/media`. On Railway the filesystem is **ephemeral** unless you add storage.

**Option A — Volume (simple for a client demo):**

1. Web service → **Settings** → **Volumes** → Add volume.
2. Mount path: `/app/public/media` (confirm mount path in deploy logs if your root differs).
3. Re-deploy. Seed images in git under `public/media` still ship with the image; **new** uploads persist on the volume.

**Option B — S3 / R2 / Blob** when you outgrow a single volume (see Payload storage adapter docs).

## Day-to-day workflow

| Change | Vercel | Railway |
|--------|--------|---------|
| Copy / layout in `records.ts` | Commit → auto deploy; client sees static preview | Only if you re-seed or edit in `/admin` |
| Content for client with CMS | — | Edit in `/admin` on Railway URL |
| Design-only review | Share Vercel URL | — |
| Client + editor | — | Share Railway URL + `/admin` |

## Troubleshooting

| Issue | Check |
|-------|--------|
| Public site shows seed copy, not CMS | `PAYLOAD_SECRET` set on Web service? `GABOS_STATIC_PREVIEW` absent or not `true`? |
| `/admin` 500 or DB errors | `DATABASE_URL` referenced from Postgres? Postgres service running? |
| Build fails on Payload | `PAYLOAD_SECRET` must be set at **build** time on Railway (add variable before first build). |
| Uploads disappear after redeploy | Add volume on `public/media` or remote storage. |

## Checklist

**Vercel (design static)**

- [ ] `GABOS_STATIC_PREVIEW=true`
- [ ] No CMS vars (or preview flag still true)

**Railway (client CMS)**

- [ ] GitHub repo connected
- [ ] Postgres service + `DATABASE_URL` reference on Web service
- [ ] `PAYLOAD_SECRET` on Web service
- [ ] First deploy green
- [ ] `npm run railway:seed` once
- [ ] `/admin` login works
- [ ] Volume on `/app/public/media` if editors upload images
