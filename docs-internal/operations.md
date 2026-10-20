# Gabos — deploy, content modes, Railway, Vercel

Internal runbook. Not for client handoff.

## Content modes

Same codebase; behavior is controlled by env vars (`src/content/static-content.ts` → `src/content/site.ts`).

| Mode | When | Data source |
|------|------|-------------|
| **Static preview** | `GABOS_STATIC_PREVIEW=true` **or** no `PAYLOAD_SECRET` | `src/content/records.ts` + `public/` |
| **CMS** | `PAYLOAD_SECRET` set and static preview off | Postgres via Payload `/admin` |

### Local dev (your machine)

Typical `.env`:

- `PAYLOAD_SECRET` + `DATABASE_URL` → **`npm run dev` uses local Postgres**, not `records.ts`.
- `GABOS_USE_LIVE_DATABASE=true` + `DATABASE_URL_LIVE` (from `npm run railway:sync-env`) → dev reads **Railway** DB.
- `GABOS_STATIC_PREVIEW=true` → forces `records.ts` even with Payload env set (rare locally).

## Two hosts (recommended)

| Host | Role | Env |
|------|------|-----|
| **Vercel** | Static UI preview for design / stakeholders | `GABOS_STATIC_PREVIEW=true` |
| **Railway** | Client site + `/admin` + Postgres | `PAYLOAD_SECRET`, `DATABASE_URL`, **no** `GABOS_STATIC_PREVIEW` |

Public Railway URL (this project): **https://gabos-production.up.railway.app**  
Admin: **https://gabos-production.up.railway.app/admin**

### Git push vs Railway CLI

| Action | Vercel | Railway |
|--------|--------|---------|
| `git push` | Redeploys if GitHub connected. Static when `GABOS_STATIC_PREVIEW=true`. | Redeploys only if GitHub is connected on the `gabos` service. |
| `npm run push:railway` | — | Uploads this folder (`railway up`), CMS mode. **No GitHub required.** |

Railway does not store git history; it runs builds from uploads or from a connected repo.

Typical workflow:

1. Design preview: edit `records.ts` or export from CMS → `git push` → Vercel.
2. Client CMS: edit `/admin` on Railway, or code change → `npm run push:railway`.

Optional: connect GitHub on Railway so one `git push` updates both hosts (keep `GABOS_STATIC_PREVIEW=true` on Vercel only).

## Vercel (static preview)

Project → Settings → Environment Variables (Production + Preview):

```env
GABOS_STATIC_PREVIEW=true
```

Simplest: do **not** set `PAYLOAD_SECRET` or `DATABASE_URL` on Vercel.  
Or set them but keep `GABOS_STATIC_PREVIEW=true` so the site still reads `records.ts`.

### Editing static preview content

| What | Where |
|------|--------|
| Site copy, nav, contact, hero | `src/content/records.ts` → `settings` |
| Shop products (demo) | `src/content/records.ts` → `products` |
| Images | `public/media`, `public/brand` (commit for Vercel) |

### Export CMS → `records.ts` (sync Vercel with DB)

```bash
npm run export:records        # current DB target from .env (local when GABOS_USE_LIVE_DATABASE=false)
npm run export:records:live   # Railway Postgres
```

Overwrites `src/content/records.ts`. Images export as `/media/...` paths; files must exist under `public/media` for Vercel.

Then: commit, push, Vercel redeploys.

### Static preview limitations

| Route / feature | Behavior |
|-----------------|----------|
| `/admin` | Needs Payload (not on Vercel static) |
| `POST /api/checkout` | 503 without Stripe |
| Live CMS edits | Not on Vercel until exported to `records.ts` or CMS host used |

Build: root `not-found.tsx` is `force-dynamic` so static Vercel builds do not require Postgres.

## Railway (CMS + Postgres)

### Cost (~2k visits/month)

Hobby **$5/mo** includes **$5 usage credit**. App + Postgres often totals **~$8–15/mo** depending on idle RAM. Fine for performance; budget slightly above $5.

### CLI

```bash
npm run railway:login
npx railway whoami
npm run railway:link      # if needed
npm run railway:setup     # Postgres + web env vars
npm run railway:seed      # seed live DB (uses DATABASE_URL_LIVE from .env)
npm run push:railway      # deploy
npm run railway:open      # dashboard
npm run railway:sync-env  # DATABASE_URL_LIVE + PAYLOAD_SECRET_LIVE → .env
npm run railway:sync-seed # SEED_* from .env → Railway
```

### Web service variables

Set **before first deploy**:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Reference from Postgres service |
| `PAYLOAD_SECRET` | `npm run railway:secret` or `openssl rand -base64 32` |
| `NODE_ENV` | `production` |
| `SEED_EMAIL` / `SEED_PASSWORD` | Admin login (sync with `railway:sync-seed`) |

Do **not** set `GABOS_STATIC_PREVIEW` on Railway.

### Deploy sources

- **CLI:** `npm run push:railway` (current default).
- **GitHub:** connect repo on the `gabos` service; `git push` deploys.

Build: `npm run build` · Start: `npm run start` · Config: `railway.toml`  
**Domain port:** Railway sets `PORT` (often **8080**). Public domain must target that port (`railway domain update … --port 8080` if you get 502).

### Internal vs public URLs

| URL | Use |
|-----|-----|
| `https://gabos-production.up.railway.app` | Browser, client |
| `gabos.railway.internal` | Service-to-service inside Railway only |
| `postgres.railway.internal` | DB from app on Railway |
| `DATABASE_URL_LIVE` in `.env` | Local dev → live DB via TCP proxy (`railway:sync-env`) |

### Media on Railway

Uploads go to `public/media`. Filesystem is ephemeral unless you add a **volume** at `/app/public/media`, or S3/R2 later.

### Railway troubleshooting

| Issue | Check |
|-------|--------|
| Site shows seed copy | `PAYLOAD_SECRET` on web service? No `GABOS_STATIC_PREVIEW`? |
| `/admin` or DB errors | Postgres up? `DATABASE_URL` referenced? |
| Build fails | `PAYLOAD_SECRET` present at build time |
| 502 | Domain port vs `PORT` (8080) |
| Uploads vanish | Volume or remote storage |

## Checklists

**Vercel static**

- [ ] `GABOS_STATIC_PREVIEW=true`
- [ ] Content in `records.ts` + assets in `public/`

**Railway CMS**

- [ ] Postgres + `DATABASE_URL` on web service
- [ ] `PAYLOAD_SECRET`
- [ ] Deploy OK · `npm run railway:seed` once · `/admin` login
- [ ] Volume for `/app/public/media` if editors upload

**Shop + payments**

- [ ] [stripe-setup.md](./stripe-setup.md)
