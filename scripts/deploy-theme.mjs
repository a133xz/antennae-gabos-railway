#!/usr/bin/env node
/**
 * Upload changed gabos-2026 theme files over FTP.
 *
 *   npm run deploy:theme
 *   npm run deploy:theme -- --dry-run
 *   npm run deploy:theme -- --since HEAD~1
 *   npm run deploy:theme -- --all
 *
 * Credentials live in .env (see .env.example). Password is never printed.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'basic-ftp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME_DIR = 'gabos-2026';

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function lines(text) {
  return text ? text.split('\n').filter(Boolean) : [];
}

function parseArgs(argv) {
  const args = { dryRun: false, all: false, since: null, verbose: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--all') args.all = true;
    else if (arg === '--verbose') args.verbose = true;
    else if (arg === '--since') {
      args.since = argv[i + 1];
      if (!args.since) throw new Error('--since needs a git ref, for example HEAD~1');
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function themeFiles({ all, since }) {
  if (all) {
    const tracked = lines(git(['ls-files', '--', THEME_DIR]));
    const untracked = lines(git(['ls-files', '--others', '--exclude-standard', '--', THEME_DIR]));
    return { upload: unique([...tracked, ...untracked]), deleted: [] };
  }

  const ref = since || 'HEAD';
  const upload = lines(git(['diff', '--name-only', '--diff-filter=ACMRT', ref, '--', THEME_DIR]));
  const untracked = lines(git(['ls-files', '--others', '--exclude-standard', '--', THEME_DIR]));
  const deleted = lines(git(['diff', '--name-only', '--diff-filter=D', ref, '--', THEME_DIR]));
  return { upload: unique([...upload, ...untracked]), deleted };
}

function unique(items) {
  return [...new Set(items)].filter((file) => {
    const abs = path.join(root, file);
    return existsSync(abs) && statSync(abs).isFile();
  });
}

function remotePath(localRel, remoteDir) {
  const rel = localRel.slice(THEME_DIR.length + 1).split(path.sep).join('/');
  const base = remoteDir.replace(/\/$/, '');
  return `${base}/${rel}`;
}

function requireEnv() {
  const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD', 'FTP_REMOTE_DIR'].filter(
    (key) => !process.env[key],
  );
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(', ')} in .env. Copy .env.example to .env and fill in the FTP login.`,
    );
  }
}

function ftpSecure() {
  const value = (process.env.FTP_SECURE || 'false').toLowerCase();
  if (value === 'implicit') return 'implicit';
  if (value === 'true' || value === 'explicit') return true;
  return false;
}

async function uploadFiles(files, remoteDir, verbose) {
  const client = new Client(120000);
  client.ftp.verbose = verbose;
  const secure = ftpSecure();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT || (secure === 'implicit' ? 990 : 21)),
      secure,
    });
    const home = await client.pwd();

    for (const file of files) {
      const remote = remotePath(file, remoteDir);
      const remoteFolder = path.posix.dirname(remote);
      process.stdout.write(`upload ${file} -> ${remote}\n`);
      await client.cd(home);
      await client.ensureDir(remoteFolder);
      await client.uploadFrom(path.join(root, file), path.posix.basename(remote));
    }
  } finally {
    client.close();
  }
}

function printHelp() {
  process.stdout.write(`Upload changed files in ${THEME_DIR} to the WordPress theme directory.

Usage
  npm run deploy:theme
  npm run deploy:theme -- --dry-run
  npm run deploy:theme -- --since HEAD~1
  npm run deploy:theme -- --all

Default compares the working tree with HEAD, including new untracked files.
--since <ref> uploads files changed since that commit, including uncommitted edits.
--all uploads the whole theme.
Deleted local files are listed and left on the server.
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  loadEnv(path.join(root, '.env'));
  const { upload, deleted } = themeFiles(args);

  if (!upload.length && !deleted.length) {
    process.stdout.write('No theme changes to upload.\n');
    if (!args.since && !args.all) {
      process.stdout.write('Working tree matches HEAD. Use --since HEAD~1 for the last commit, or --all for the whole theme.\n');
    }
    return;
  }

  if (upload.length) {
    process.stdout.write(`${upload.length} file${upload.length === 1 ? '' : 's'} to upload:\n`);
    for (const file of upload) process.stdout.write(`  ${file}\n`);
  }
  if (deleted.length) {
    process.stdout.write('Left on the server (deleted locally):\n');
    for (const file of deleted) process.stdout.write(`  ${file}\n`);
  }

  if (args.dryRun) {
    process.stdout.write('Dry run. Nothing was uploaded.\n');
    return;
  }

  if (!upload.length) return;

  requireEnv();
  await uploadFiles(upload, process.env.FTP_REMOTE_DIR, args.verbose);
  process.stdout.write('Done.\n');
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
