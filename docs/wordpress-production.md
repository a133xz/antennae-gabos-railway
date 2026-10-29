# WordPress production (post-transition)

The public site runs on **WordPress** with theme **`gabos-2026/`**.

The **Next.js app** under `src/` is legacy / reference. Do not treat it as production unless we explicitly revive it.

## Deploy

```bash
npm run deploy:theme
```

- Uploads **only** files under `gabos-2026/` (git-changed by default; use `--all` for full theme sync).
- Does **not** deploy `src/`, `globals.css`, or any React components.

Credentials: `.env` (see `.env.example`).

## Where to change things

| Area | Location |
|------|----------|
| Shop “coming soon”, cart empty, store layout | `gabos-2026/style.css`, `gabos-2026/page-*.php`, template parts |
| Breakpoints | `docs/mobile-nav-breakpoints.md`, `gabos-2026/style.css` |

## Cursor

Project rule **wordpress-production** (`.cursor/rules/wordpress-production.mdc`) tells agents to default to WordPress-only edits.
