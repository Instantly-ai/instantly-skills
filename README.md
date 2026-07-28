# Instantly Skills

Run Instantly by talking to your agent. A free, open-source collection of
[Claude Code / Claude Desktop skills](https://docs.anthropic.com/en/docs/claude-code/skills) that turn a
plain-language goal ("get me meetings with fintech VPs") into a real, verified, launched campaign,
without leaving your agent.

No MCP to register. The skills share one small CLI over the Instantly API: clone, set your key, install
the skills you want. Works in Claude Code, Claude Desktop, and any bash-capable agent (Codex included).

**In this collection**
- **`instantly-gtm`** — the full cold-email outbound loop: find, verify, write, launch, replies, report. *(Skill #1.)*
- More Instantly skills will land here over time. Install only the ones you want.

## Why you'd want it
- **The whole loop, end to end.** ICP to launched campaign to booked meetings, all from chat.
- **Safe by design.** The guardrails below have no off switch (see [Why it's safe](#why-its-safe)).
- **Sounds like you, not a bot.** It learns your business and your voice, and writes plain, spam-safe copy.
- **Won't break when the API changes.** Skills speak stable verbs; the real endpoints live in one map
  file, so a rename is a one-line patch, not a rewrite.
- **Free and open (MIT).** Bring your own Instantly key. Nothing else to buy.

---

# instantly-gtm: the outbound loop

Go from a plain-language ICP to a launched, verified campaign, then work the replies and read the
results, without leaving your agent.

## What it does (the 7-step loop)
1. **Find.** Turn "200 Series-A fintech VPs of Sales" into a SuperSearch, and see the count before you spend.
2. **Enrich and verify.** Import, enrich, verify emails, and drop the ones that would bounce (non-negotiable).
3. **Write.** Draft a sequence (subjects, bodies, follow-ups) in your voice, from your real offer.
4. **Assemble.** Create the campaign as a **draft** with your leads and sequence attached.
5. **Launch.** Preflight sender health, then activate **only after you confirm**, and never from a cold domain.
6. **Replies.** Triage the inbox, set interest, draft responses, book meetings.
7. **Report.** Pull the numbers, chart them, flag what's working, and suggest the one next change.

Run the whole loop ("run outbound for X") or jump to any single step ("any replies?", "why is
campaign Y underperforming?").

## Why it's safe
Guardrails that don't turn off:
- **Draft first.** Nothing goes live until you've reviewed the leads and the copy.
- **Confirmed launch.** Activation shows N leads · sequence · daily ramp · sending domains, then waits for your yes.
- **Verify is non-skippable.** Unverified addresses are never emailed.
- **Cold domains are refused.** It warns and stops rather than burning an un-warmed sender.
- **Analytics only suggests.** It never changes a campaign on its own.
- **Spend is gated.** Anything that costs credits (enrichment) asks first.
- **No destructive actions, ever.** The CLI has no endpoint for delete, billing, or purchase, so they can't run.
- **Your key never touches disk.** It lives only in the `INSTANTLY_API_KEY` environment variable.

Prefer speed? Turn on **auto mode** per action (replies, interest, campaign edits) to skip the prompt.
The safety gates still run and it still reports what it did. Launch stays confirm-only unless you opt in.

## It learns your business
A one-time setup reads your website and asks a couple of questions to build a reusable profile: what you
sell, your ICP, personas, offer, voice, and booking links. So the emails are specific, not generic. It
also learns your tone from your edits and stops re-asking what you've already decided.

## Install (about 60 seconds)
One line (macOS / Linux):
```bash
curl -fsSL <RAW_BOOTSTRAP_URL> | bash                    # installs instantly-gtm + shared core
#   or: curl -fsSL <RAW_BOOTSTRAP_URL> | bash -s -- --all    # every skill in the collection
```
Prefer to clone (or on Windows):
```bash
git clone <REPO_URL> && cd instantly-skills
./install.sh instantly-gtm          # or: --list (see all) · no args (picker) · --all
# Windows: powershell -ExecutionPolicy Bypass -File .\install.ps1 instantly-gtm
```
Then set your key:
```bash
node ~/.instantly-gtm/core/auth.mjs setup   # opens the API-keys page and shows how to set your key
```
That's the whole setup. No MCP server to register. Full walkthrough: [docs/quickstart.md](docs/quickstart.md).

Requires Node 18+, an Instantly **paid plan**, and at least one connected, warmed sending account.

## Structure
- **`core/`** is the shared Instantly plumbing every skill reuses (auth, the verb-to-REST CLI, config,
  capability map). Installed once to `~/.instantly-gtm/core/`.
- **`skills/<name>/`** is each skill's `SKILL.md`, `skill.json`, and references. `skills/instantly-gtm/`
  is the first.

## The clean verb layer
Skills speak stable internal verbs. `core/capability-map.json` maps each verb to its v2 REST endpoint,
and `core/instantly.mjs` calls it. Run `node ~/.instantly-gtm/core/instantly.mjs doctor` to validate the
map and ping the API. If an endpoint ever changes, it's a one-line map patch and nothing else moves.

## License
MIT, see [LICENSE](LICENSE). Inspired by the broader open-source cold-email community; all content here
is original.
