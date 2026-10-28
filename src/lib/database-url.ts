function trimEnv(value: string | undefined): string {
  return value?.trim() ?? ''
}

function withoutSslMode(url: string): string {
  return url.replace(/([?&])sslmode=[^&]*&?/g, '$1').replace(/[?&]$/, '')
}

export function getDatabaseUrl(): string {
  return withoutSslMode(trimEnv(process.env.DATABASE_URL))
}

export function getPayloadSecret(): string {
  return trimEnv(process.env.PAYLOAD_SECRET)
}

/** `pg` verifies the cert chain when `sslmode=require` is in the URL. Use pool SSL instead. */
export function getPostgresPoolExtras(): { ssl?: { rejectUnauthorized: boolean } } {
  const url = trimEnv(process.env.DATABASE_URL)
  if (!url.includes('sslmode=require')) return {}
  return { ssl: { rejectUnauthorized: false } }
}
