#!/usr/bin/env node
// save-profile.mjs — persist the business profile to disk (chunk 21). Onboarding's mirror moment is
// conversational; THIS is what makes it stick. The orchestrator pipes the profile sections it wrote
// (from the confirmed mirror) as JSON on stdin; this writes one .md per section and prints the saved
// paths, so "onboarding done" is a concrete, verifiable step — not a prose instruction the model skips.
//
// It writes NON-SECRET business content only. It never touches the API key. It creates the profile dir.
//
// Usage:
//   echo '{"company":"# Company...","icp":"...","gtm-plan":"..."}' | node save-profile.mjs
//   node save-profile.mjs --file profile.json          # same, from a file
//   node save-profile.mjs --project                    # write to ./.instantly-gtm/profile (per-project)
// Keys → files: profile, company, icp, personas, offer, tone, booking-links, gtm-plan (unknown keys rejected).

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const KNOWN = ['profile', 'company', 'icp', 'personas', 'offer', 'tone', 'booking-links', 'gtm-plan'];

function fail(m) { process.stderr.write(`save-profile: ${m}\n`); process.exit(1); }

function parseArgs(argv) {
  const a = { project: false, file: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--project') a.project = true;
    else if (argv[i] === '--file') a.file = argv[++i];
  }
  return a;
}

function readInput(file) {
  try { return readFileSync(file || 0, 'utf8'); }   // fd 0 = stdin
  catch (e) { fail(`could not read ${file ? file : 'stdin'} (${e.code || e.message})`); }
}

function main() {
  const a = parseArgs(process.argv);
  const raw = readInput(a.file);
  if (!raw || !raw.trim()) fail('no input — pipe a JSON object of profile sections on stdin.');
  let obj;
  try { obj = JSON.parse(raw); } catch { fail('input must be a JSON object {section: markdown, ...}'); }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) fail('input must be a JSON object.');

  const dir = a.project ? join(process.cwd(), '.instantly-gtm', 'profile')
                        : join(homedir(), '.instantly-gtm', 'profile');
  const bad = Object.keys(obj).filter((k) => !KNOWN.includes(k));
  if (bad.length) fail(`unknown section(s): ${bad.join(', ')}. Allowed: ${KNOWN.join(', ')}`);

  mkdirSync(dir, { recursive: true });
  const saved = [];
  for (const [key, content] of Object.entries(obj)) {
    if (typeof content !== 'string' || !content.trim()) { process.stderr.write(`  (skipped empty "${key}")\n`); continue; }
    const path = join(dir, `${key}.md`);
    writeFileSync(path, content.endsWith('\n') ? content : content + '\n');
    saved.push(path);
  }
  if (!saved.length) fail('nothing to save (all sections empty).');
  process.stdout.write(`Saved ${saved.length} profile file(s) to ${dir}:\n` + saved.map((p) => `  ${p}`).join('\n') + '\n');
}

main();
