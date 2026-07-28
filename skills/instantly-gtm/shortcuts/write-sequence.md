---
name: instantly-gtm-write-sequence
description: >-
  Shortcut into the Instantly GTM loop, write a cold-email sequence: subject lines, bodies,
  follow-ups, and timing, in the user's voice, emitted in campaign shape. Trigger on "write a cold
  email", "write a sequence", "draft outreach", "follow-ups".
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
