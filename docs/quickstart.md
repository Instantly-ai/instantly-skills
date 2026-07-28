# Quickstart

From zero to a running campaign in a few minutes.

## Prerequisites
- **Node 18+** (`node --version`).
- An **Instantly paid plan**. Sending, enrichment, and verification return `402` without one.
- At least one **connected, warmed sending account** in Instantly (the skill refuses cold domains).
- A bash-capable agent (Claude Code, Claude Desktop, or Codex). **No MCP server required**: the skill
  talks to Instantly through its own bundled CLI over the REST API.

## 1. Install the skill(s)
One line (macOS / Linux):
```bash
curl -fsSL <RAW_BOOTSTRAP_URL> | bash            # installs instantly-gtm + shared core
#   or: curl -fsSL <RAW_BOOTSTRAP_URL> | bash -s -- --all
```
Or clone it (and on Windows):
```bash
git clone <REPO_URL> && cd instantly-skills
./install.sh --list              # see available skills
./install.sh instantly-gtm       # install this one (plus shared core). Or ./install.sh (picker), or --all
# Windows: powershell -ExecutionPolicy Bypass -File .\install.ps1 instantly-gtm
```
The installer puts the shared core at `~/.instantly-gtm/core/` and the skill in your agent's skills
directory. Validate with `node ~/.instantly-gtm/core/instantly.mjs doctor`.

## 2. Set your API key (env var only, never stored by the skill)
```bash
node ~/.instantly-gtm/core/auth.mjs setup     # opens the API-keys page and shows how to set INSTANTLY_API_KEY safely
node ~/.instantly-gtm/core/auth.mjs status    # verifies the key and prints your workspace
```
Create the key at **app.instantly.ai → Settings → Integrations → API Keys** (it's shown once). Put it
in a shell profile or secrets manager. Avoid an inline `export` (it lands in shell history) and never
commit it to a repo `.env`. Recommended least-privilege scopes are printed by `setup`.

## 3. One-time onboarding (recommended)
Tell the skill your website ("set me up, my site is acme.com"). It reads the site, asks a couple of
questions, and builds your business profile in `~/.instantly-gtm/profile/` (company, ICP, personas,
offer, tone, booking links). Skippable and re-runnable ("update my business profile").

## 4. Run your first loop
> "Find 200 Series-A fintech VPs of Sales and run outbound for my [offer]."

The skill walks you through find, verify, write, draft, and launch, pausing at the launch confirm. Or
jump in anywhere: *"any replies?"*, *"why is campaign X underperforming?"*.

## 5. Optional: make it always-on
The skill activates the moment you say anything outbound-shaped ("find leads", "write a cold email",
"grow my pipeline") and then orients you with a menu, so you never memorize commands. To also have
Claude greet you as your GTM co-pilot at the start of every session in a project, drop this into that
project's `.claude/CLAUDE.md` (a skill can't self-greet at startup, but a CLAUDE.md can):
```markdown
You are my GTM co-pilot. Use the instantly-gtm skill for any outbound/pipeline work. At the start of
a session, briefly offer to help with outbound (find leads, write sequences, launch, triage replies,
report) and ask what I'm trying to achieve. Proactively suggest the next best step from current state.
```

## 6. Optional: auto mode
Skip per-action confirmations by creating `~/.instantly-gtm/config.json`:
```json
{ "auto": { "replies": true, "interest": true, "campaign_edits": false, "launch": false } }
```
Auto mode only skips the prompt. The safety gates still run and the skill still reports what it did.
`launch` stays off unless you explicitly set it to `true` (it's the one irreversible action), and
spending credits always asks regardless. Check current settings: `node ~/.instantly-gtm/core/config.mjs show`.

## Troubleshooting
| Symptom | Fix |
|---|---|
| "not connected" / no data | Run `node ~/.instantly-gtm/core/instantly.mjs doctor`. It validates the map and pings the API. |
| `401` unauthorized | Key invalid or revoked. Regenerate and re-set `INSTANTLY_API_KEY` (`node ~/.instantly-gtm/core/auth.mjs setup`). |
| `402` payment required | Workspace needs an active paid plan. Upgrade in-app. |
| `429` rate limited | Back off. The skill paces itself (100/s, 6k/min; replies list is 20/min). |
| Verb refused ("not implemented") | It's a destructive or account-risk action. Do it in the Instantly app; the CLI won't. |
| Launch refused | A sending domain is cold or unhealthy. Warm it, drop it, or add a pre-warmed account. |
