#!/usr/bin/env node
/**
 * Writes DATABASE_URL_LIVE (+ optional PAYLOAD_SECRET_LIVE) into .env from Railway.
 * Does not overwrite SEED_* — edit those in .env yourself, then run railway:sync-seed.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')

function fail(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

try {
  execSync('npx railway whoami', { cwd: root, stdio: 'pipe' })
} catch {
  fail('Not logged in. Run: npm run railway:login')
}

function serviceNames() {
  const out = execSync('npx railway service list --json', { cwd: root, encoding: 'utf8' }).trim()
  const parsed = JSON.parse(out)
  const list = Array.isArray(parsed) ? parsed : parsed?.services ?? []
  return list.map((s) => s.name).filter(Boolean)
}

const names = serviceNames()
const postgresName = names.find((n) => /postgres/i.test(n))
const webName =
  names.find((n) => /^gabos$/i.test(n)) ||
  names.find((n) => !/postgres|redis|mysql|mongo/i.test(n))

if (!postgresName) fail('No Postgres service in linked Railway project')

function kv(service, key) {
  const out = execSync(`npx railway variable list --service ${JSON.stringify(service)} --kv`, {
    cwd: root,
    encoding: 'utf8',
  })
  for (const line of out.split('\n')) {
    if (line.startsWith(`${key}=`)) return line.slice(key.length + 1)
  }
  return ''
}

function liveDatabaseUrl() {
  const direct =
    kv(postgresName, 'DATABASE_PUBLIC_URL') ||
    kv(postgresName, 'DATABASE_URL') ||
    kv(postgresName, 'DATABASE_PRIVATE_URL')
  if (direct && !direct.includes('.railway.internal')) {
    return direct.includes('sslmode=') ? direct : `${direct}${direct.includes('?') ? '&' : '?'}sslmode=require`
  }

  let proxyJson
  try {
    proxyJson = execSync(`npx railway tcp-proxy list --service ${JSON.stringify(postgresName)} --json`, {
      cwd: root,
      encoding: 'utf8',
    }).trim()
  } catch {
    proxyJson = ''
  }
  let endpoint = ''
  if (proxyJson) {
    const parsed = JSON.parse(proxyJson)
    const proxy = parsed?.proxies?.[0] ?? parsed?.proxy
    endpoint = proxy?.endpoint || (proxy?.domain && proxy?.proxyPort ? `${proxy.domain}:${proxy.proxyPort}` : '')
  }
  if (!endpoint) {
    console.log('No public Postgres proxy — creating TCP proxy on port 5432…')
    execSync(`npx railway tcp-proxy create --port 5432 --service ${JSON.stringify(postgresName)}`, {
      cwd: root,
      stdio: 'inherit',
    })
    const again = execSync(`npx railway tcp-proxy list --service ${JSON.stringify(postgresName)} --json`, {
      cwd: root,
      encoding: 'utf8',
    }).trim()
    const parsed = JSON.parse(again)
    const proxy = parsed?.proxies?.[0]
    endpoint = proxy?.endpoint || ''
  }
  if (!endpoint) fail('Could not resolve a public Postgres endpoint for local dev')

  const user = kv(postgresName, 'PGUSER') || kv(postgresName, 'POSTGRES_USER') || 'postgres'
  const password = kv(postgresName, 'PGPASSWORD') || kv(postgresName, 'POSTGRES_PASSWORD')
  const database = kv(postgresName, 'PGDATABASE') || kv(postgresName, 'POSTGRES_DB') || 'railway'
  if (!password) fail('Could not read Postgres password from Railway variables')

  const [host, port] = endpoint.includes(':') ? endpoint.split(':') : [endpoint, '5432']
  const enc = encodeURIComponent(password)
  return `postgresql://${user}:${enc}@${host}:${port}/${database}?sslmode=require`
}

const databaseUrlLive = liveDatabaseUrl()

let payloadSecretLive = ''
if (webName) {
  payloadSecretLive = kv(webName, 'PAYLOAD_SECRET')
}

let lines = existsSync(envPath) ? readFileSync(envPath, 'utf8').split('\n') : []

function upsert(key, value) {
  const prefix = `${key}=`
  let found = false
  lines = lines.map((line) => {
    if (line.startsWith(prefix)) {
      found = true
      return `${prefix}${value}`
    }
    return line
  })
  if (!found) lines.push(`${prefix}${value}`)
}

upsert('DATABASE_URL_LIVE', databaseUrlLive)
if (payloadSecretLive) upsert('PAYLOAD_SECRET_LIVE', payloadSecretLive)

if (!lines.some((l) => l.startsWith('GABOS_USE_LIVE_DATABASE='))) {
  lines.push('GABOS_USE_LIVE_DATABASE=false')
}

writeFileSync(envPath, lines.filter((l, i, a) => l.length > 0 || i < a.length - 1).join('\n').replace(/\n?$/, '\n'))
console.log('✓ Updated .env: DATABASE_URL_LIVE' + (payloadSecretLive ? ', PAYLOAD_SECRET_LIVE' : ''))
console.log('  Toggle local vs live DB: GABOS_USE_LIVE_DATABASE=true|false')
