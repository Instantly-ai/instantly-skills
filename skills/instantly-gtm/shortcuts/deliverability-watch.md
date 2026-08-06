---
name: instantly-gtm-deliverability-watch
description: >-
  ALWAYS use this skill for SENDING HEALTH across your accounts/domains: "is my sending ok", "are my
  domains/inboxes healthy", "is anything burning", "should I pause anything", "check my deliverability",
  "watch my sending". Reads warmup score, bounce trend, and send volume per sender, flags domains that are
  quietly degrading BEFORE the reply rate craters, and recommends pause or scale. Can run daily on a
  schedule. It reads and recommends; it pauses a sender only after you confirm. For ONE campaign's numbers
  or a "going to spam" symptom use instantly-gtm-check-performance; to BUY more senders use
  instantly-gtm-scale-senders.
---

# Deliverability watch (Instantly GTM: standing sender-health monitor)

Direct entry to the sender-health part of the loop. Run the CLI at
`__INSTANTLY_CORE__/instantly.mjs <verb> --params '<json>'` (see `__INSTANTLY_CORE__/capability-map.json`).

Load `__SKILL_DIR__/references/conversation.md` FIRST (dry-operator voice + HARD STOP checklist), then
`__SKILL_DIR__/references/visual-kit.md` (render the one-liner + watch/burning rows), then follow
`__SKILL_DIR__/references/deliverability-watch.md` (batch read → green/watch/burning scoring →
pause/scale recommendation → optional daily schedule → end-of-run autopilot card).

Guardrails hold: read-and-recommend only. `account_pause` / `account_resume` are confirm-gated (run with
`--confirm` only after an explicit yes); a burning domain is *recommended* for pause, never auto-paused
(guardrail 5). Batch the roster 100/req, 2s apart (rate limit); on no signal (0 accounts / warmup off)
say so, never fabricate a score. This owns sender-health + pause/scale; a single campaign's numbers or a
"going to spam" symptom belong to `/instantly-gtm-check-performance`; buying senders belongs to
`/instantly-gtm-scale-senders`. For the full loop, use `/instantly-gtm`.

> If you see a literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path, the skill wasn't installed via
> install.sh, tell the user to run it.
