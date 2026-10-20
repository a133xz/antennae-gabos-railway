#!/usr/bin/env node
/** Push SEED_EMAIL / SEED_PASSWORD from .env to the Railway web service. */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')

function fail(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

function parseDotEnv(filePath) {
  if (!existsSync(filePath)) return {}
  const env = {}
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return env
}

try {
  execSync('npx railway whoami', { cwd: root, stdio: 'pipe' })
} catch {
  fail('Not logged in. Run: npm run railway:login')
}

const env = parseDotEnv(envPath)
const seedEmail = env.SEED_EMAIL
const seedPassword = env.SEED_PASSWORD
if (!seedEmail || !seedPassword) fail('Set SEED_EMAIL and SEED_PASSWORD in .env')

const names = JSON.parse(
  execSync('npx railway service list --json', { cwd: root, encoding: 'utf8' }).trim(),
)
const list = Array.isArray(names) ? names : names?.services ?? []
const webName =
  list.map((s) => s.name).find((n) => /^gabos$/i.test(n)) ||
  list.map((s) => s.name).find((n) => !/postgres|redis|mysql|mongo/i.test(String(n)))

if (!webName) fail('No web service found. Link project or run npm run railway:setup')

const set = (key, value) => {
  execSync(
    `npx railway variable set ${JSON.stringify(`${key}=${value}`)} --service ${JSON.stringify(webName)}`,
    { cwd: root, stdio: 'inherit' },
  )
}

set('SEED_EMAIL', seedEmail)
set('SEED_PASSWORD', seedPassword)
console.log(`✓ Railway web service "${webName}": SEED_EMAIL + SEED_PASSWORD updated`)
