function trimEnv(value: string | undefined): string {
  return value?.trim() ?? ''
}

/** When `GABOS_USE_LIVE_DATABASE=true`, use `DATABASE_URL_LIVE` instead of `DATABASE_URL`. */
export function useLiveDatabase(): boolean {
  return process.env.GABOS_USE_LIVE_DATABASE === 'true'
}

export function getDatabaseUrl(): string {
  if (useLiveDatabase()) {
    const live = trimEnv(process.env.DATABASE_URL_LIVE)
    if (!live) {
      throw new Error(
        'GABOS_USE_LIVE_DATABASE=true but DATABASE_URL_LIVE is empty. Copy it from Railway Postgres variables.',
      )
    }
    return live
  }
  return trimEnv(process.env.DATABASE_URL)
}

/** Match Payload secret to the DB target when `PAYLOAD_SECRET_LIVE` is set. */
export function getPayloadSecret(): string {
  if (useLiveDatabase()) {
    const live = trimEnv(process.env.PAYLOAD_SECRET_LIVE)
    if (live) return live
  }
  return trimEnv(process.env.PAYLOAD_SECRET)
}
