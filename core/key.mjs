// key.mjs — resolve the Instantly API key WITHOUT depending on the shell loading a profile.
// The agent's Bash tool runs a non-interactive shell that does NOT source ~/.zshrc, so an env-var-only
// key is invisible to agent-run commands (works in your own terminal, "not set" for the agent). This
// resolver checks, in order: (1) the environment, (2) a dedicated key file written by `auth.mjs setup
// --persist` (chmod 600, in the user's home), (3) an `export INSTANTLY_API_KEY=` line in the common
// shell profiles (back-compat for keys set the old way). It never writes or echoes the key.

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const ENV_VAR = 'INSTANTLY_API_KEY';
export const KEYFILE_PATH = join(homedir(), '.instantly-gtm', 'key');
// The shell profiles we read a key from (back-compat) and that `auth.mjs disconnect` strips it from.
// `.zshenv` is included because a key exported there loads into every shell's env before `.zshrc`,
// which is exactly the residual-env-var case cleanup must cover.
export const PROFILE_FILES = ['.zshrc', '.zprofile', '.zshenv', '.bashrc', '.bash_profile', '.profile'];

// Returns { key, source } — source is 'env' | 'keyfile' | 'profile:<file>' | null.
export function resolveKey() {
  if (process.env[ENV_VAR]) return { key: process.env[ENV_VAR], source: 'env' };

  try {
    if (existsSync(KEYFILE_PATH)) {
      const k = readFileSync(KEYFILE_PATH, 'utf8').trim();
      if (k) return { key: k, source: 'keyfile' };
    }
  } catch { /* ignore unreadable keyfile */ }

  const home = homedir();
  for (const f of PROFILE_FILES) {
    try {
      const p = join(home, f);
      if (!existsSync(p)) continue;
      const m = readFileSync(p, 'utf8').match(/^\s*export\s+INSTANTLY_API_KEY\s*=\s*["']?([^"'\n]+)["']?/m);
      if (m && m[1] && m[1].trim()) return { key: m[1].trim(), source: `profile:${f}` };
    } catch { /* ignore unreadable profile */ }
  }
  return { key: null, source: null };
}
