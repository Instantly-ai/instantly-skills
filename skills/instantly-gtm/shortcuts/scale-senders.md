---
name: instantly-gtm-scale-senders
description: >-
  Shortcut into the Instantly GTM loop, scale your sending infrastructure: check if you have enough
  warmed mailboxes for a campaign, and buy pre-configured Done-For-You mailboxes/domains from Instantly
  without leaving chat. Trigger on "do I have enough inboxes", "I need more mailboxes/domains",
  "scale my sending", "my domain is cold, get me more senders".
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
