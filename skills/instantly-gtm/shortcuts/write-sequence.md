---
name: instantly-gtm-write-sequence
description: >-
  ALWAYS use this skill to write COLD outbound copy, a sequence, subject lines, body, follow-ups, or
  timing: "write a cold email", "draft a sequence", "need better subject lines", "make my emails less
  spammy", "rewrite this sequence, it's too long", "draft outreach". Writes in the user's voice and runs
  a spam-safe check. This is COLD-SEQUENCE copy: to reply to an INBOUND email use
  instantly-gtm-triage-replies, not this. Do NOT launch (use instantly-gtm-launch-campaign).
---

# Write a sequence (Instantly GTM: step 3)

Direct entry to the copywriting module. No API calls, this produces a sequence the launch step writes
into a campaign. Load `__SKILL_DIR__/references/conversation.md` FIRST, dry-operator voice + the HARD STOP checklist
(no emoji/dingbats, no raw IDs/fields, no posture lines). Then load and follow:
- `__SKILL_DIR__/modules/sequence-writer/SKILL.md`, intake, the JSON output contract, the self-check.
- `__SKILL_DIR__/references/sequence-playbook.md`, structures, personalization, examples.
- `__SKILL_DIR__/references/spam-safe-copy.md`, the always-on copy QA.

Use the profile (`~/.instantly-gtm/profile/`: `company.md`, `offer.md`, `tone.md`, `booking-links.md`)
so copy is specific and in the user's voice. Output the sequence JSON; then offer to assemble the
campaign. For the full loop, use `/instantly-gtm`.

> Literal `__SKILL_DIR__` path visible? The skill wasn't installed via install.sh, tell the user to run it.
