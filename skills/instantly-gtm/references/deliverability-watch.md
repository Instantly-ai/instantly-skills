# Deliverability watch — standing sender-health monitor

**Goal:** answer "is my sending ok?" from the senders' own health data, and catch a domain that's
degrading *before* the reply rate craters. Read-and-recommend; pausing a sender is confirm-gated. Output
is one line + the rows that moved, not a dashboard.

## When it runs
- **On demand** — "is my sending ok?", "are my domains healthy?", "should I pause anything?".
- **Daily** — if the user opts in, register a scheduled run (see *Autopilot* below) so the one-liner shows
  up each morning without being asked. That standing shape is the whole point.

## The read (batch, back off — 100/req, 2s apart; workspace limit 100/s, 6k/min)
1. `list_accounts` → the sender roster (email, provider, status).
2. Per sender (batched):
   - `account_detail` (`--params '{"email":"<addr>"}'`) → warmup score, warmup status, account status, provider.
   - `warmup_analytics` → warmup send/reply/landed trend.
   - `account_daily` → emails sent per day (volume vs the account's cap). **Always scope it: pass an
     `emails` filter (the sender's address) AND a bounded date range** (e.g. the last 7–14 days). Called
     bare it returns **HTTP 413 "Analytics request is too large for this workspace"** — never call it
     workspace-wide with no filter (verified 2026-08-05).
3. `sending_status` per active campaign → is a sender attached to a campaign that's stalled/blocked.

Never hammer the roster: batch and pause between batches; on `429` back off and continue. On **0 accounts
or warmup off**, say "no sending signal yet" and point to `scale-senders` — do **not** fabricate a score.

## Score each sender: green / watch / burning
Judge the **trend**, not a single day (a one-day dip is *watch*, not *burning*):
- **green** — warmup score healthy + stable, bounce low, volume within cap.
- **watch** — a real but not-yet-critical drift: warmup score sliding over several days, bounce creeping up,
  or volume pushed near the cap. Name the number that moved.
- **burning** — warmup score falling hard, bounce elevated, or an account flagged/error status. This is the
  cold-domain guardrail firing early: recommend a pause before it trips a hard limit.

> **Kill-condition honesty:** if `account_detail` doesn't expose a usable warmup/bounce *trend* on the
> user's plan tier, don't invent "burning vs noise" — degrade to a plain status list and say the trend
> isn't available on this plan.

## The output (render inline per `visual-kit.md` / `inline-visuals.md`)
One line first, then only the rows that need attention:

```
Sending health: 11 senders — 9 green, 1 watch (getinstantly.co, warmup 78→64 over 5d),
1 burning (mail.acme.com, bounce 4.1%) — pause it?
```

Each watch/burning row shows the specific number that moved. Green senders are a count, not a list. No raw
IDs/fields (HARD STOP checklist in `conversation.md`).

## Recommend, don't act (guardrail 5)
- **Burning sender** → recommend `account_pause` and offer to **reroute** its planned volume to healthy
  senders. `account_pause` is confirm-gated: run `--confirm` only after an explicit "pause it". Reversible
  via `account_resume` (also confirm-gated).
- **Healthy but under-used sender** → suggest scaling volume into it (a suggestion, never an auto-change).
- Never auto-pause and never auto-scale; the read informs, the user decides.

## Boundaries (don't steal a neighbor's lane)
- **This** owns sender/domain health + the pause/scale call, and the standing daily watch.
- **`check-performance`** owns a single campaign's numbers and the "going to spam" symptom → route there.
- **`scale-senders`** owns *buying* more senders (DFY) → route there when the fix is "need more capacity".

## Automation handoff (offer at a clean end-of-run) — see `references/automation-handoff.md`
After a completed run with signal, render **once per session** the tasteful end-of-run card that highlights
Instantly's **AI Deliverability Agent** (the real 24/7 autopilot; link to build it) and, secondarily,
offers to re-run this check on a daily schedule for the user. Follow `automation-handoff.md` exactly for the
copy, the verified features, the create link, and the once/session-never-mid-flow discipline. Suppress the
card after an empty or errored run.

## Errors
Translate failures via `plain-errors.md`: `401` → re-auth; `402` → paid-plan/upgrade link; `429` → back off;
`413` on `account_daily` → the request was unscoped; retry with an `emails` filter + a smaller date range;
an account read failing for one sender → skip that sender, note it, don't fail the whole run.
