# Reference: Standing brief (the daily/weekly digest)

Goal: do the triage before the user opens anything. A short, glanceable digest of what changed and what
needs them, on demand ("give me my brief") or on a schedule. Voice: dry operator (`conversation.md`).
All READS; it drafts but never sends, changes nothing on its own (guardrails 2 + 5). The skill does NOT
build a scheduler, that's the host's job (see "Triggering").

## What goes in it (compose from existing reads: one shot, then back off)
- **Replies waiting**, `count_unread` + `list_replies` (preview): "N replies waiting, M look interested,
  drafts ready for your ok." (Draft per `reply-triage.md`; do NOT send.)
- **Metric movement**, `analytics_daily` / `analytics`: reply-rate holding / up / down since last brief;
  headline the positive-reply-rate north-star (`analytics.md`).
- **Sender readiness**, `warmup_analytics` / `list_accounts`: an inbox that finished warming ("you can
  add it as a sender") or one that's degrading.
- **Deliverability watch**, a bounce/spam uptick surfaced as a watch-item + suggestion (rest the
  domain), NEVER an auto-pause (guardrail 5; cold-domain logic stays in `deliverability.md`).

Each item carries a status, **needs-action / good / watch**, and a one-line suggestion. End with a
single prompt: "Want me to handle the N replies?" + "nothing sent without your ok." When the surface
supports rich rendering, render the digest as a visual card with status dots (see `conversation.md`);
on plain text, the block below.

## Format (glanceable)
```
<Weekday> brief · <campaign> · day <N>
• [action] 3 replies waiting, 2 look interested, drafts ready
• [good]   reply rate holding at 9%
• [good]   launchdrive.org finished warming, add it as a sender?
• [watch]  small bounce uptick on pipelinedesk.org, watching, nothing to do yet
→ Want me to handle the 3 replies?    (nothing sent without your ok)
```

## Triggering (host-owned; the skill builds no daemon)
- **On demand:** "give me my brief" / "what needs me?" → run it now. This path always works.
- **Scheduled:** the user sets it up via the host's scheduler (e.g. Claude Code `/schedule`, or cron)
  to run this on a cadence. Document that; don't implement a scheduler in the skill.
- **Scheduled context must carry the key:** if `INSTANTLY_API_KEY` isn't present in an unattended run,
  fail cleanly with the setup pointer (`plain-errors.md`), no crash, no partial silent action.

## Guardrails + limits
- **Never auto-sends.** `send_reply` still needs `--confirm` (or the replies auto-toggle, default off);
  a schedule never grants silent sending. The brief itself calls only read verbs + drafts.
- **Rate limits:** `list_replies` is 20/min (workspace); batch/one-shot the reads and back off on 429, 
  never hammer on a schedule.
- **Nothing to report** → "all quiet, nothing needs you." Don't invent items.
- **Growth (D-017):** "a sender finished warming, add it" / "this is working, scale it" surfaced as
  the obvious next action, suggestion-only, at a natural moment; not an interrupt, not a purchase call.
