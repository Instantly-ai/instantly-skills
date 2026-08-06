---
name: instantly-gtm-triage-replies
description: >-
  ALWAYS use this skill for the INBOX and INBOUND replies, one reply OR the whole inbox: "any replies?",
  "did anyone respond", "reply to this guy for me", "write a follow-up to this reply", "someone's
  interested, book the call", "handle my inbox", AND the proactive whole-inbox queue / daily brief: "catch
  me up on my inbox", "what came in overnight", "clear my inbox", "give me my morning brief", "sort my
  replies". Classifies each reply (interested / objection-by-type / not-now / OOO / wrong-person /
  unsubscribe / couldn't-classify), sets interest, and drafts voiced responses so you approve instead of
  hunting tabs; can run daily on a schedule. INBOUND reply handling: for campaign analytics use
  instantly-gtm-check-performance, for a cold sequence use instantly-gtm-write-sequence. Sending + setting
  interest are confirm-gated; unsubscribes/complaints never get an auto-reply; it never deletes (do that in the app).
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
