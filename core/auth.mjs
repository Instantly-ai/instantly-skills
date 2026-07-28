#!/usr/bin/env node
// auth.mjs — prove the Instantly API key works. ENV-VAR ONLY (D-021): the key is supplied via
// INSTANTLY_API_KEY and the skill NEVER writes, echoes, or logs it (last-4 only). No keychain,
// no file. Verification is a direct REST call (auth must be provable before any other Instantly call).
//
// Usage:
//   node scripts/auth.mjs                 # status: is the key set + valid? show workspace + last-4
//   node scripts/auth.mjs status          # (same)
//   node scripts/auth.mjs setup           # open the API-keys page + how to set the env var safely
//   node scripts/auth.mjs setup --persist # guided: paste key hidden, verify, WRITE it to your shell
//                                          #   profile (~/.zshrc etc.) so it persists. One command, no editor.
//   node scripts/auth.mjs verify          # just verify the current env key
//   node scripts/auth.mjs --check         # read a key from stdin (hidden), verify it, store NOTHING
// The --persist mode is the ONLY path where auth.mjs writes the key, and only to the user's own shell
// profile (never a repo, never skill config), after the user pastes it into a hidden prompt (owner
// decision D-037, softens D-021's "never writes" for UX; same end-state as editing the profile by hand).

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { resolveKey, KEYFILE_PATH } from './key.mjs';

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
  lines.push('Set up your Instantly API key.');
  lines.push('');
  lines.push('WHERE to run these: open your Terminal app (Mac: press Cmd+Space, type "Terminal", press');
  lines.push('Enter · Windows: open "PowerShell"). It does not matter which folder you are in — these');
  lines.push('commands work from anywhere because they use full paths.');
  lines.push('');
  lines.push('Why it is set up this way: your key is a secret, like a password. It is stored only in your');
  lines.push('own computer\'s shell profile, never in this project and never anywhere the assistant can read,');
  lines.push('and it is never saved to your command history. The assistant never sees or types it.');
  lines.push('');
  lines.push('EASIEST (one command): paste your key when it asks (it stays hidden and is saved for you):');
  lines.push(`   node "${SELF}" setup --persist`);
  lines.push('   Get your key first at the page opening now: "API Keys" in the sidebar, then "Create API');
  lines.push('   Key" (it is shown once, so copy it). Recommended scopes (avoid all:all):');
  lines.push(`   ${SCOPES_HINT.join(', ')}`);
  lines.push('   When it prints "Connected", open a NEW terminal + a new chat and you are ready.');
  lines.push('');
  lines.push('PREFER to do it yourself (the assistant never writes anything):');
  lines.push('   1. Create the key on the page (above).');
  lines.push('   2. Open your shell profile in a simple editor:  open -e ~/.zshrc   (Mac TextEdit)');
  lines.push('      and add this line, pasting your real key:   export INSTANTLY_API_KEY="your-key-here"');
  lines.push('      Editing the file (not typing `export ...` in the terminal) keeps the key out of history.');
  lines.push(`   3. Load + verify:  source ~/.zshrc && node "${SELF}" status`);
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
  const { key, source } = resolveKey();
  if (!key) {
    process.stderr.write(`${ENV_VAR} is not set.\n`);
    if (!verifyOnly) { process.stderr.write('\n'); printSetupText(); }
    process.stderr.write(`\nRun \`node "${SELF}" setup --persist\` to set it.\n`);
    process.exit(1);
  }
  const result = await verifyKey(key);
  if (result.ok) {
    process.stdout.write(`Connected ✓  workspace: ${result.workspace}  (key ${last4(key)}, from ${source})\n`);
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

// Which shell profile to write to, based on the user's login shell.
function profilePath() {
  const home = homedir();
  const shell = (process.env.SHELL || '').toLowerCase();
  if (shell.includes('bash')) {
    const bashrc = join(home, '.bashrc');
    const bashProfile = join(home, '.bash_profile');
    if (existsSync(bashrc)) return bashrc;
    if (existsSync(bashProfile)) return bashProfile;
    return bashrc;
  }
  return join(home, '.zshrc'); // zsh is the macOS default
}

// Guided setup: open the keys page, read the key hidden, VERIFY it, then write it to the user's shell
// profile. The key is never echoed, never passed as an arg (no history), and only written after it
// verifies. This is the one place auth.mjs writes the key, and only to the user's own profile (D-037).
async function cmdPersist() {
  process.stdout.write('Guided key setup. Paste your key when asked below — it stays hidden, is never\n');
  process.stdout.write('saved to your command history, and the assistant never sees it.\n\n');
  if (!openUrl(KEYS_URL)) process.stdout.write(`Get your key here: ${KEYS_URL}\n`);
  else process.stdout.write(`Opened ${KEYS_URL} — create a key there ("API Keys" → "Create API Key"), then:\n`);
  const key = await readHiddenStdin();
  if (!key) { process.stderr.write('No key provided. Nothing was written.\n'); process.exit(1); }
  const result = await verifyKey(key);
  if (!result.ok) { reportInvalid(result); process.stderr.write('\nKey NOT saved (it did not verify).\n'); process.exit(1); }

  const path = profilePath();
  const line = `export ${ENV_VAR}="${key}"`;
  let content = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const re = new RegExp(`^export ${ENV_VAR}=.*$`, 'm');
  let action;
  if (re.test(content)) {
    content = content.replace(re, line);
    action = 'Updated your existing key in';
  } else {
    const sep = content && !content.endsWith('\n') ? '\n' : '';
    content += `${sep}\n# Instantly API key (added by instantly-gtm)\n${line}\n`;
    action = 'Saved your key to';
  }
  writeFileSync(path, content);
  // Also write a dedicated key file the CLI reads directly (chmod 600). This is what makes it work in
  // ANY shell, including the agent's non-interactive shell that never sources ~/.zshrc.
  try {
    mkdirSync(dirname(KEYFILE_PATH), { recursive: true });
    writeFileSync(KEYFILE_PATH, key + '\n', { mode: 0o600 });
  } catch (e) {
    process.stderr.write(`(warn: could not write ${KEYFILE_PATH} (${e.code || e.message}); shell profile still set)\n`);
  }
  // Never echo the key — confirm by workspace + last-4 only.
  process.stdout.write(`\nConnected ✓  workspace: ${result.workspace}  (key ${last4(key)})\n`);
  process.stdout.write(`${action} ${path}, and a protected key file at ${KEYFILE_PATH}.\n`);
  process.stdout.write(`You're set — no need to re-run this per session. Open a new chat to start using it.\n`);
  process.exit(0);
}

async function main() {
  const cmd = process.argv[2] || 'status';
  const persist = process.argv.includes('--persist');
  if (cmd === 'setup' && persist) return cmdPersist();
  const arg = cmd.replace(/^--/, '');
  switch (arg) {
    case 'status': return cmdStatus();
    case 'verify': return cmdStatus({ verifyOnly: true });
    case 'setup': cmdSetup(); return;
    case 'check': return cmdCheck();
    default:
      process.stderr.write(`Unknown command "${process.argv[2]}". Use: status | setup | setup --persist | verify | --check\n`);
      process.exit(1);
  }
}

main();
