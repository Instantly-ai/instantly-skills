#!/usr/bin/env node
// config.mjs — auto-mode configuration reader (D-014).
//
// Auto mode lets the user opt into skipping the per-call confirmation prompt for the four
// confirm-gated actions. It NEVER bypasses the safety gates (verify, cold-domain refusal,
// draft-first) and the agent still reports what it did — see docs/build/DECISIONS.md D-014.
//
// Config is NON-SECRET user preference data (never the keychain). Resolution order:
//   1. project-local  ./.instantly-gtm/config.json   (wins — supports agencies / per-project)
//   2. global         ~/.instantly-gtm/config.json
// Absent file / absent key => false. A toggle is ON only if it is exactly boolean true.
// `launch` is treated identically (off unless explicitly true) so it stays off even when other
// toggles are on (SPEC §7): enabling it is a distinct, explicit choice.
//
// Shape:
//   { "auto": { "replies": bool, "interest": bool, "campaign_edits": bool, "launch": bool } }
//
// Usage:
//   node scripts/config.mjs get     # resolved auto-mode as JSON (for the orchestrator)
//   node scripts/config.mjs show    # human-readable summary + config paths
// Or import { getAutoMode, configPaths } from './config.mjs'.

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const ACTIONS = ['replies', 'interest', 'campaign_edits', 'launch'];

export function configPaths() {
  return {
    project: join(process.cwd(), '.instantly-gtm', 'config.json'),
    global: join(homedir(), '.instantly-gtm', 'config.json'),
  };
}

function readJson(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    // Malformed config must never crash a flow; treat as absent (all defaults off).
    return null;
  }
}

// Resolve the effective auto-mode flags. Project-local overrides global, key by key.
export function getAutoMode() {
  const { project, global } = configPaths();
  const g = readJson(global) || {};
  const p = readJson(project) || {};
  const gAuto = (g && typeof g.auto === 'object' && g.auto) || {};
  const pAuto = (p && typeof p.auto === 'object' && p.auto) || {};
  const resolved = {};
  const source = {};
  for (const a of ACTIONS) {
    // ON only if explicitly boolean true. Project value wins when present.
    if (pAuto[a] === true || pAuto[a] === false) {
      resolved[a] = pAuto[a] === true;
      source[a] = 'project';
    } else if (gAuto[a] === true || gAuto[a] === false) {
      resolved[a] = gAuto[a] === true;
      source[a] = 'global';
    } else {
      resolved[a] = false;
      source[a] = 'default';
    }
  }
  return { auto: resolved, source };
}

function main() {
  const cmd = process.argv[2] || 'get';
  const { auto, source } = getAutoMode();
  if (cmd === 'get') {
    process.stdout.write(JSON.stringify({ auto }) + '\n');
    return;
  }
  if (cmd === 'show') {
    const { project, global } = configPaths();
    const lines = ['Auto mode (skips the confirm prompt, never the safety gates):'];
    for (const a of ACTIONS) {
      const tag = a === 'launch' && auto[a] ? ' (explicitly enabled)' : '';
      lines.push(`  ${a.padEnd(15)} ${auto[a] ? 'ON ' : 'off'}  [${source[a]}]${tag}`);
    }
    lines.push('');
    lines.push(`  project config: ${project}${existsSync(project) ? '' : '  (not present)'}`);
    lines.push(`  global config:  ${global}${existsSync(global) ? '' : '  (not present)'}`);
    lines.push('  All default OFF. Enable a key by setting it to true in either file.');
    process.stdout.write(lines.join('\n') + '\n');
    return;
  }
  process.stderr.write(`Unknown command "${cmd}". Use: get | show\n`);
  process.exit(1);
}

// Run only when invoked directly (not when imported).
import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
