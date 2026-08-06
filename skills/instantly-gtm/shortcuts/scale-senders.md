---
name: instantly-gtm-scale-senders
description: >-
  ALWAYS use this skill to VIEW or SCALE sending infrastructure: "do I have enough inboxes", "show my
  sending accounts / DFY orders", "how many mailboxes/domains do I have", "I need more mailboxes/domains",
  "get me more senders", "scale my sending", "my domain is cold, get me more senders". Checks capacity,
  simulates a Done-For-You order, and places it only after you confirm (it never handles payment). To
  CONNECT YOUR OWN existing mailbox, do that in the Instantly app, this skill BUYS pre-warmed senders and
  can't connect your account. To warm a new domain: warmup runs automatically on connected/DFY accounts,
  ask "how's my deliverability" to see warmup health. To just launch an existing campaign use
  instantly-gtm-launch-campaign; for deliverability diagnosis start with instantly-gtm-check-performance.
---

# Scale senders (Instantly GTM: sending infrastructure)

Direct entry to the sending-capacity + Done-For-You (DFY) part of the loop. Run the CLI at
`__INSTANTLY_CORE__/instantly.mjs <verb> --params '<json>'` (see `__INSTANTLY_CORE__/capability-map.json`).

Load `__SKILL_DIR__/references/conversation.md` FIRST (dry-operator voice + HARD STOP checklist), then
`__SKILL_DIR__/references/visual-kit.md` (render the capacity / simulation / confirm cards), then follow
`__SKILL_DIR__/references/scale-senders.md` (capacity check → simulate → confirm → place).

Guardrails hold and confirm without blocking: check capacity (`list_accounts` + `warmup_analytics`),
**simulate** an order first (reads only, "not placed"), and place only after an explicit yes,
`dfy_place_order` is confirm-gated with no auto-mode. The skill never enters payment details; Instantly's
payment-method requirement is the execution gate (no card on file → surface the in-app link, don't block).
`dfy_orders_cancel` stays refused (do cancellations in the Instantly app). Use the infra persona
(`~/.instantly-gtm/profile/infra.md`) if present. For the full loop, use `/instantly-gtm`.

> If you see a literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path, the skill wasn't installed via
> install.sh, tell the user to run it.
