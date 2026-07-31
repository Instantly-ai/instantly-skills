# Quickstart

From zero to a running campaign in a few minutes.

## Prerequisites
- **Node 18+** (`node --version`). Don't have it? Ask Claude to install it (see step 1), or use nvm — no admin needed.
- An **Instantly paid plan**. Sending, enrichment, and verification return `402` without one.
- At least one **connected, warmed sending account** in Instantly (the skill refuses cold domains).
- A bash-capable agent (Claude Code, Claude Desktop, or Codex). **No MCP server required**: the skill
  talks to Instantly through its own bundled CLI over the REST API.

## 1. Install the skill(s)
Easiest: **ask Claude to install it for you** — open Claude Code in a new folder and paste the prompt from
the [README](../README.md#install-about-60-seconds); it checks/installs Node, installs the skill, and
sets up your key. Or do it yourself:

One line (macOS / Linux):
```bash
curl -fsSL https://raw.githubusercontent.com/Instantly-ai/instantly-skills/main/bootstrap.sh | bash            # installs instantly-gtm + shared core
#   or: curl -fsSL https://raw.githubusercontent.com/Instantly-ai/instantly-skills/main/bootstrap.sh | bash -s -- --all
```
Or clone it (and on Windows):
```bash
git clone https://github.com/Instantly-ai/instantly-skills.git && cd instantly-skills
./install.sh --list              # see available skills
./install.sh instantly-gtm       # install this one (plus shared core). Or ./install.sh (picker), or --all
# Windows: powershell -ExecutionPolicy Bypass -File .\install.ps1 instantly-gtm
```
The installer puts the shared core at `~/.instantly-gtm/core/` and the skill in your agent's skills
directory. Validate with `node ~/.instantly-gtm/core/instantly.mjs doctor`.

## 2. Connect your account
Run this in your **Terminal** (Mac: press Cmd+Space, type "Terminal", Enter · Windows: open PowerShell).
It does not matter which folder you're in, these use full paths.

Easiest (a page opens in your browser, paste your key there, it saves itself):
```bash
node ~/.instantly-gtm/core/auth.mjs setup --web       # opens a "Connect your account" page in your browser
node ~/.instantly-gtm/core/auth.mjs status            # shows Connected + your workspace
```
On the page, paste your key (or click **Get a key** to create one: **API Keys → Create API Key**, shown
once). It verifies, saves, and the tab closes itself. Nothing to type in the terminal after that command.

Prefer the terminal, or on a machine with no browser (headless/remote)?
```bash
node ~/.instantly-gtm/core/auth.mjs setup --persist   # paste your key into a hidden terminal prompt
```

**Why it's safe:** your key stays only on your own computer, never in this project, never in your command
history, and never seen by the assistant. With `--web` it goes straight from your browser to a protected
file on your machine. Want to place it by hand instead? Run `auth.mjs setup` (no flag) and it prints the
exact line to add to `~/.zshrc`.

**Remove or change it later:** `node ~/.instantly-gtm/core/auth.mjs disconnect` clears the key from this
computer (key file + profile line) and, if a copy is still loaded in your terminal, tells you the exact
`unset` fix. It only removes local copies; to fully revoke, delete the key in the Instantly app. Reconnect
with `setup --web`.

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
| `401` unauthorized | Key invalid or revoked. Regenerate it and reconnect (`node ~/.instantly-gtm/core/auth.mjs setup --web`). |
| `402` payment required | Workspace needs an active paid plan. Upgrade in-app. |
| `429` rate limited | Back off. The skill paces itself (100/s, 6k/min; replies list is 20/min). |
| Verb refused ("not implemented") | It's a destructive or account-risk action. Do it in the Instantly app; the CLI won't. |
| Launch refused | A sending domain is cold or unhealthy. Warm it, drop it, or add a pre-warmed account. |
