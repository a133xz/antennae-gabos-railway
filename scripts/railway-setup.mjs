#!/usr/bin/env node
/**
 * One-shot Railway bootstrap: Postgres + web env vars + optional seed.
 * Prerequisite: `npm run railway:login` (or RAILWAY_TOKEN in the environment).
 */
import { execSync, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const railway = (args, opts = {}) =>
  execSync(`npx railway ${args}`, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts })

function railwayJson(args) {
  const out = railway(`${args} --json`, { stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  if (!out) return null
  return JSON.parse(out)
}

function fail(msg) {
  console.error(`\n✗ ${msg}`)
  process.exit(1)
}

function ok(msg) {
  console.log(`✓ ${msg}`)
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
  railway('whoami')
  ok('Railway CLI authenticated')
} catch {
  fail('Not logged in. Run: npm run railway:login\n   Or export RAILWAY_TOKEN from https://railway.app/account/tokens')
}

let linked = true
try {
  railway('status')
} catch {
  linked = false
}

const projectName = process.env.RAILWAY_PROJECT_NAME || 'gabos'

if (!linked) {
  console.log(`Creating project "${projectName}" and linking this folder…`)
  railway(`init --name ${JSON.stringify(projectName).slice(1, -1)}`)
  ok(`Project linked`)
}

let services = []
try {
  const raw = railwayJson('service list')
  services = Array.isArray(raw) ? raw : raw?.services ?? []
} catch (e) {
  fail(`Could not list services: ${e.stderr?.toString() || e.message}`)
}

const byName = (re) => services.find((s) => re.test(String(s.name || '')))

let postgres = byName(/postgres/i)
if (!postgres) {
  console.log('Adding PostgreSQL…')
  railway('add --database postgres')
  const raw = railwayJson('service list')
  services = Array.isArray(raw) ? raw : raw?.services ?? []
  postgres = byName(/postgres/i)
  if (!postgres) fail('Postgres service was not found after add')
  ok(`Postgres service: ${postgres.name}`)
} else {
  ok(`Postgres already present: ${postgres.name}`)
}

let web =
  byName(/^gabos$/i) ||
  services.find((s) => s.id !== postgres.id && !/postgres|redis|mysql|mongo/i.test(String(s.name || '')))

if (!web) {
  console.log('Adding web service (empty shell — deploy with GitHub or `railway up`)…')
  railway('add --service gabos')
  const raw = railwayJson('service list')
  services = Array.isArray(raw) ? raw : raw?.services ?? []
  web = byName(/^gabos$/i) || services.find((s) => s.id !== postgres.id)
}

if (!web) fail('No web service found. Connect GitHub in the dashboard or run: railway up -y --detach')

ok(`Web service: ${web.name}`)
execSync(`npx railway service link ${JSON.stringify(web.name)}`, { cwd: root, stdio: 'inherit' })

function pgVar(key) {
  try {
    const out = execSync(`npx railway variable list --service ${JSON.stringify(postgres.name)} --kv`, {
      cwd: root,
      encoding: 'utf8',
    })
    for (const line of out.split('\n')) {
      if (line.startsWith(`${key}=`)) return line.slice(key.length + 1)
    }
  } catch {
    /* ignore */
  }
  return null
}

const databaseUrl = pgVar('DATABASE_URL') || pgVar('DATABASE_PRIVATE_URL')
if (!databaseUrl) fail(`Could not read DATABASE_URL from Postgres service "${postgres.name}"`)

const localEnv = parseDotEnv(path.join(root, '.env'))
const payloadSecret =
  process.env.RAILWAY_PAYLOAD_SECRET ||
  (localEnv.PAYLOAD_SECRET?.includes('local-dev') ? null : localEnv.PAYLOAD_SECRET) ||
  crypto.randomBytes(32).toString('base64')

const seedEmail = process.env.SEED_EMAIL || localEnv.SEED_EMAIL || 'editor@gabos.test'
const seedPassword = process.env.SEED_PASSWORD || localEnv.SEED_PASSWORD || 'gabos-local'

const setVar = (key, value) => {
  execSync(
    `npx railway variable set ${JSON.stringify(`${key}=${value}`)} --service ${JSON.stringify(web.name)}`,
    { cwd: root, stdio: 'inherit' },
  )
}

console.log('Setting web service variables…')
setVar('DATABASE_URL', databaseUrl)
setVar('PAYLOAD_SECRET', payloadSecret)
setVar('NODE_ENV', 'production')
setVar('SEED_EMAIL', seedEmail)
setVar('SEED_PASSWORD', seedPassword)
ok('Variables set (triggers redeploy)')

const doSeed = process.argv.includes('--seed')
if (doSeed) {
  console.log('Running seed against Railway Postgres…')
  const r = spawnSync('npx', ['railway', 'run', 'npm', 'run', 'seed'], { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) fail('Seed failed — deploy may still be building; retry: npm run railway:seed')
  ok('Database seeded')
} else {
  console.log('\nNext: wait for deploy, then run: npm run railway:seed')
}

console.log('\nOpen dashboard: npm run railway:open')
console.log('After deploy: visit your Railway URL and /admin')
