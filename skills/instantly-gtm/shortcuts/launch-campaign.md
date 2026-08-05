---
name: instantly-gtm-launch-campaign
description: >-
  ALWAYS use this skill to assemble a campaign as a draft and launch it safely: "set it up as a draft",
  "assemble the campaign", "launch it", "take it live", "ok send it", "turn on the campaign". Attaches
  verified leads + sequence, creates it INACTIVE, preflights sender health, confirms, then activates. If
  the sending domain is COLD it refuses and points you to instantly-gtm-scale-senders. Do NOT buy senders
  here (use instantly-gtm-scale-senders).
---

# Assemble + launch (Instantly GTM: steps 4–5)

Direct entry to campaign assembly and the confirmed launch. Run the CLI at
`__INSTANTLY_CORE__/instantly.mjs`. Load `__SKILL_DIR__/references/conversation.md` FIRST, dry-operator voice + the HARD STOP checklist
(no emoji/dingbats, no raw IDs/fields, no posture lines). Then load and follow:
- `__SKILL_DIR__/references/assemble-campaign.md`, create as DRAFT, attach only Verified leads, assert status 0.
- `__SKILL_DIR__/references/deliverability.md`, warmup/cold-domain preflight, the 4-part confirm, activate + status mapping.

Guardrails hold and are NOT skippable here: draft-first; verify re-check; cold-domain refusal;
`activate` (and `update_campaign`) require `--confirm` after the user's explicit yes (or the auto
toggle). Show the launch summary (N leads · sequence · daily ramp · sending domains) before activating.
For the full loop, use `/instantly-gtm`.

> Literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path visible? Not installed via install.sh, tell the user to run it.
