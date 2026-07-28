---
name: instantly-gtm-triage-replies
description: >-
  Shortcut into the Instantly GTM loop, triage the inbox: classify replies, set interest status,
  draft responses in the user's voice, and book meetings. Trigger on "any replies?", "handle my
  inbox", "triage replies", "book the meeting".
---

# Triage replies (Instantly GTM: step 6)

Direct entry to reply management. Run the CLI at `__INSTANTLY_CORE__/instantly.mjs`. Load `__SKILL_DIR__/references/conversation.md` FIRST, dry-operator voice + the HARD STOP checklist
(no emoji/dingbats, no raw IDs/fields, no posture lines). Then load and follow:
- `__SKILL_DIR__/references/reply-triage.md`, the 20-req/min fetch discipline, classification →
  interest-status enum, drafting patterns, and the send flow.

Guardrails hold: one filtered `list_replies` call; `send_reply` and `set_interest` require `--confirm`
after the user's yes (or the auto toggle); `set_interest` is async (202, report as queued). Draft in
the user's Reply voice (`~/.instantly-gtm/profile/tone.md`) and use the real booking link
(`booking-links.md`). For the full loop, use `/instantly-gtm`.

> Literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path visible? Not installed via install.sh, tell the user to run it.
