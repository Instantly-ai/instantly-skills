#!/usr/bin/env node
// instantly.mjs — the Instantly GTM CLI (D-023). Resolves a stable VERB to a v2 REST endpoint via
// capability-map.json and calls it with the INSTANTLY_API_KEY bearer. No MCP.
//
// Guarantees (code-level, not hooks):
//   • Destructive/account-risk verbs are simply NOT implemented — running one is refused.
//   • Confirm-gated verbs (activate/update_campaign/send_reply/set_interest) require --confirm.
//   • The API key is read from the env, never printed or stored.
//
// Usage:
//   node scripts/instantly.mjs <verb> [--params '<json>'] [--confirm]
//   node scripts/instantly.mjs list-verbs
//   node scripts/instantly.mjs doctor          # validate the map + ping the API (whoami)
// Params carry BOTH path params (e.g. {"id":"..."}) and query/body fields; the CLI routes them.
// Output: JSON on stdout. Exit 0 on success, 1 on error.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveKey } from './key.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const MAP_PATH = join(HERE, 'capability-map.json');
const ENV_VAR = 'INSTANTLY_API_KEY';
// Collection version, shown by `doctor` so a user can tell what they're running. Bump together with
// CHANGELOG.md, skills/instantly-gtm/skill.json, and the `version:` in skills/instantly-gtm/SKILL.md.
const VERSION = '1.1.0';
// Real, invocable paths (so error hints are copy-pasteable post-install, not a stale `scripts/` guess).
const SELF = process.argv[1] || join(HERE, 'instantly.mjs');
const AUTH = join(HERE, 'auth.mjs');

function loadMap() {
  try { return JSON.parse(readFileSync(MAP_PATH, 'utf8')); }
  catch { fail(`capability map unreadable at ${MAP_PATH}`); }
}
function out(obj) { process.stdout.write(JSON.stringify(obj, null, 2) + '\n'); }
function fail(msg) { process.stderr.write(`instantly: ${msg}\n`); process.exit(1); }

function parseArgs(argv) {
  const a = { verb: null, params: {}, confirm: false, base: null };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--confirm') a.confirm = true;
    else if (t === '--params') { try { a.params = JSON.parse(argv[++i] || '{}'); } catch { fail('--params must be valid JSON'); } }
    else if (t === '--base') a.base = argv[++i];
    else if (!t.startsWith('--') && !a.verb) a.verb = t;
  }
  return a;
}

function mapError(status, body) {
  const msg = (body && (body.message || body.error)) || '';
  if (status === 401) return `401 unauthorized — key invalid/revoked. Re-run: node "${AUTH}" setup`;
  if (status === 402) return `402 payment required — workspace needs an active paid plan. Upgrade: https://app.instantly.ai/app/settings/billing`;
  if (status === 429) return `429 rate limited — back off (100/s, 6k/min; list_replies is 20/min).`;
  if (status === 404) return `404 not found${msg ? ` — ${msg}` : ''}`;
  if (status === 400) return `400 bad request${msg ? ` — ${msg}` : ''}`;
  return `HTTP ${status}${msg ? ` — ${msg}` : ''}`;
}

async function callVerb(map, verb, params, confirm, baseOverride) {
  const spec = map.verbs[verb];
  if (!spec) {
    if ((map.never_call || []).includes(verb)) {
      fail(`"${verb}" is destructive/account-risk and is intentionally NOT implemented. Do it in the Instantly app if you must.`);
    }
    fail(`unknown verb "${verb}". Run: node "${SELF}" list-verbs`);
  }
  if (spec.confirm && !confirm) {
    fail(`"${verb}" changes state and is confirm-gated. Re-run with --confirm ONLY after the user has said yes (or the matching auto-mode toggle is on).`);
  }
  const { key } = resolveKey();
  if (!key) fail(`${ENV_VAR} is not set. Run: node "${AUTH}" setup --persist`);

  const base = baseOverride || map.$meta.base_url;
  // Fill {path params} from params; the rest go to query (GET) or body (POST/PATCH).
  const rest = { ...params };
  const path = spec.path.replace(/\{(\w+)\}/g, (_, name) => {
    if (rest[name] == null) fail(`"${verb}" needs path param "${name}" in --params`);
    const v = encodeURIComponent(String(rest[name])); delete rest[name]; return v;
  });
  let url = base + path;
  const opts = { method: spec.method, headers: { authorization: `Bearer ${key}` } };
  if (spec.method === 'GET') {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(rest)) {
      if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
      else if (v != null) qs.append(k, String(v));
    }
    const s = qs.toString(); if (s) url += `?${s}`;
  } else {
    opts.headers['content-type'] = 'application/json';
    opts.body = JSON.stringify(rest);
  }

  let res;
  try { res = await fetch(url, opts); }
  catch (e) { fail(`network error reaching ${base} (${e.code || e.message})`); }
  let body = null;
  const text = await res.text();
  if (text) { try { body = JSON.parse(text); } catch { body = { raw: text }; } }
  if (!res.ok) fail(mapError(res.status, body));
  out({ ok: true, verb, status: res.status, data: body });
}

function listVerbs(map) {
  const rows = Object.entries(map.verbs).map(([v, s]) =>
    `  ${v.padEnd(20)} ${s.method.padEnd(5)} ${s.path}${s.confirm ? '   [--confirm]' : ''}`);
  process.stdout.write(`Verbs (${rows.length}) — resolve to ${map.$meta.base_url}:\n${rows.join('\n')}\n` +
    `\nnever_call (not implemented): ${map.never_call.length} destructive/account-risk verbs are refused.\n`);
}

function doctor(map) {
  // Validate the map is well-formed and self-consistent.
  const problems = [];
  for (const [v, s] of Object.entries(map.verbs)) {
    if (!s.method || !s.path) problems.push(`${v}: missing method/path`);
    if ((map.never_call || []).includes(v)) problems.push(`${v}: verb also in never_call`);
  }
  for (const c of map.confirm_required || []) {
    if (!map.verbs[c]) problems.push(`confirm_required "${c}" is not a verb`);
    else if (!map.verbs[c].confirm) problems.push(`confirm_required "${c}" missing confirm:true`);
  }
  process.stdout.write(`instantly-gtm ${VERSION} (see CHANGELOG.md for what changed)\n`);
  process.stdout.write(problems.length ? `map issues:\n  ${problems.join('\n  ')}\n`
    : `capability map: valid ✓ (${Object.keys(map.verbs).length} verbs, ${map.never_call.length} refused)\n`);
  // Ping the API if a key is present (same call as auth.mjs).
  if (resolveKey().key) return callVerb(map, 'whoami', {}, false, null);
  process.stdout.write(`${ENV_VAR} not set — skipping API ping. Run: node "${AUTH}" setup --persist\n`);
  process.exit(problems.length ? 1 : 0);
}

async function main() {
  const map = loadMap();
  const a = parseArgs(process.argv);
  const cmd = a.verb;
  if (!cmd || cmd === 'help') { listVerbs(map); return; }
  if (cmd === 'list-verbs') { listVerbs(map); return; }
  if (cmd === 'doctor') { await doctor(map); return; }
  await callVerb(map, cmd, a.params, a.confirm, a.base);
}
main();
