#!/usr/bin/env node
// auth.mjs — prove the Instantly API key works. ENV-VAR ONLY (D-021): the key is supplied via
// INSTANTLY_API_KEY and the skill NEVER writes, echoes, or logs it (last-4 only). No keychain,
// no file. Verification is a direct REST call (auth must be provable before any other Instantly call).
//
// Usage:
//   node scripts/auth.mjs            # status: is the key set + valid? show workspace + last-4
//   node scripts/auth.mjs status     # (same)
//   node scripts/auth.mjs setup      # open the API-keys page + how to set the env var safely
//   node scripts/auth.mjs verify     # just verify the current env key
//   node scripts/auth.mjs --check    # read a key from stdin (hidden), verify it, store NOTHING

import { spawn } from 'node:child_process';

const API_BASE = 'https://api.instantly.ai/api/v2';
const KEYS_URL = 'https://app.instantly.ai/app/settings/integrations';
const APP_UPGRADE_URL = 'https://app.instantly.ai/app/settings/billing';
const ENV_VAR = 'INSTANTLY_API_KEY';
// Real invocation path, so hints are copy-pasteable post-install (not a stale `scripts/` guess).
const SELF = process.argv[1] || 'auth.mjs';

const SCOPES_HINT = [
  'campaigns:all', 'leads:all', 'lead_lists:all', 'emails:all',
  'email_verifications:all', 'accounts:read', 'supersearch_enrichments:all',
  'background-jobs:read', 'workspaces:read',
];

const last4 = (k) => (k && k.length >= 4 ? `••••${k.slice(-4)}` : '••••');

function openUrl(url) {
  const cmd = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'cmd'
    : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  try {
    const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
    return true;
  } catch {
    return false;
  }
}

// Verify a key against the workspace-current endpoint. Returns a structured result; never logs the key.
async function verifyKey(key) {
  let res;
  try {
    res = await fetch(`${API_BASE}/workspaces/current`, {
      headers: { authorization: `Bearer ${key}` },
    });
  } catch (e) {
    return { ok: false, kind: 'network', message: `could not reach ${API_BASE} (${e.code || e.message})` };
  }
  if (res.status === 200) {
    let body = {};
    try { body = await res.json(); } catch { /* tolerate non-JSON */ }
    const workspace = body?.name || body?.workspace_name || body?.id || '(unnamed workspace)';
    return { ok: true, kind: 'valid', workspace };
  }
  if (res.status === 401) return { ok: false, kind: 'unauthorized', message: 'key is invalid or revoked' };
  if (res.status === 402) return { ok: false, kind: 'payment', message: 'workspace has no active paid plan' };
  if (res.status === 429) {
    const retry = res.headers.get('retry-after');
    return { ok: false, kind: 'ratelimited', message: `rate limited${retry ? `, retry after ${retry}s` : ''}` };
  }
  return { ok: false, kind: 'http', message: `unexpected HTTP ${res.status}` };
}

function printSetupText() {
  const lines = [];
  lines.push('Set up your Instantly API key (stored ONLY as an environment variable, never on disk):');
  lines.push('');
  lines.push(`  1. Opening ${KEYS_URL}`);
  lines.push('     Open "API Keys" in the sidebar, then "Create API Key". The key is shown ONCE, so copy it now.');
  lines.push('  2. Recommended least-privilege scopes (avoid all:all):');
  lines.push(`     ${SCOPES_HINT.join(', ')}`);
  lines.push('  3. Set it as an environment variable. Pick a SAFE, persistent home:');
  lines.push('       • a shell profile (~/.zshrc / ~/.bashrc):   export INSTANTLY_API_KEY="<your-key>"');
  lines.push('       • a secrets manager (1Password/op, doppler, etc.) that injects it, or');
  lines.push('       • a CI secret for automated runs.');
  lines.push('     Avoid typing `export INSTANTLY_API_KEY=<key>` straight into a terminal (it lands in');
  lines.push('     shell history). Never put it in a repo .env or commit it anywhere.');
  lines.push(`  4. Re-open your shell (or \`source\` the profile), then run:  node "${SELF}" status`);
  process.stdout.write(lines.join('\n') + '\n');
}

// Only `setup` opens a browser — a read-only `status` must never have that side effect.
function cmdSetup() {
  printSetupText();
  if (!openUrl(KEYS_URL)) process.stdout.write(`\n(Could not open a browser. Visit ${KEYS_URL})\n`);
}

async function readHiddenStdin() {
  // Read a single line. Mute echo when attached to a TTY; works with piped input too.
  return new Promise((resolve) => {
    const stdin = process.stdin;
    let data = '';
    const isTTY = stdin.isTTY;
    if (isTTY) { stdin.setRawMode(true); process.stdout.write('Paste API key (hidden): '); }
    stdin.resume();
    stdin.setEncoding('utf8');
    const finish = () => {
      stdin.removeListener('data', onData);
      if (isTTY) { stdin.setRawMode(false); process.stdout.write('\n'); }
      stdin.pause();
      resolve(data.trim());
    };
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '') { if (isTTY) stdin.setRawMode(false); process.stdout.write('\n'); process.exit(130); } // Ctrl-C
        if (ch === '\n' || ch === '\r') { finish(); return; }
        data += ch;
      }
    };
    stdin.on('data', onData);
  });
}

function reportInvalid(result) {
  // Human-readable reason + next action (SPEC §8). Growth nudge on 402 (D-017).
  process.stderr.write(`Not connected: ${result.message}.\n`);
  if (result.kind === 'unauthorized') {
    process.stderr.write(`Create or regenerate a key: ${KEYS_URL}, then re-set ${ENV_VAR}.\n`);
  } else if (result.kind === 'payment') {
    process.stderr.write(`A paid plan unlocks sending, enrichment, and verification. Upgrade: ${APP_UPGRADE_URL}\n`);
  } else if (result.kind === 'ratelimited') {
    process.stderr.write('Wait and retry.\n');
  } else if (result.kind === 'network') {
    process.stderr.write('Check your connection and retry.\n');
  }
}

async function cmdStatus({ verifyOnly = false } = {}) {
  const key = process.env[ENV_VAR];
  if (!key) {
    process.stderr.write(`${ENV_VAR} is not set.\n`);
    if (!verifyOnly) { process.stderr.write('\n'); printSetupText(); }
    process.stderr.write(`\nRun \`node "${SELF}" setup\` to open the API-keys page.\n`);
    process.exit(1);
  }
  const result = await verifyKey(key);
  if (result.ok) {
    process.stdout.write(`Connected ✓  workspace: ${result.workspace}  (key ${last4(key)})\n`);
    process.exit(0);
  }
  reportInvalid(result);
  process.exit(1);
}

async function cmdCheck() {
  const key = await readHiddenStdin();
  if (!key) { process.stderr.write('No key provided.\n'); process.exit(1); }
  const result = await verifyKey(key);
  // Never echo or store the key — report validity only.
  if (result.ok) {
    process.stdout.write(`Valid ✓  workspace: ${result.workspace}  (key ${last4(key)})\n`);
    process.stdout.write(`Now set it:  export ${ENV_VAR}="<the key you just checked>"  (in a shell profile / secrets manager)\n`);
    process.exit(0);
  }
  reportInvalid(result);
  process.exit(1);
}

async function main() {
  const arg = (process.argv[2] || 'status').replace(/^--/, '');
  switch (arg) {
    case 'status': return cmdStatus();
    case 'verify': return cmdStatus({ verifyOnly: true });
    case 'setup': cmdSetup(); return;
    case 'check': return cmdCheck();
    default:
      process.stderr.write(`Unknown command "${process.argv[2]}". Use: status | setup | verify | --check\n`);
      process.exit(1);
  }
}

main();
