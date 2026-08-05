---
name: instantly-gtm-find-leads
description: >-
  ALWAYS use this skill to build a prospect list from a plain-language ICP: "find agency owners in the
  US", "who should I target", "get me 200 more like these", "build a list of fintech VPs", "I need more
  people to contact". Turn the ICP into SuperSearch filters, preview + count before spending, enrich, and
  verify (drop unverifiable rows). This is COLD-EMAIL prospecting (verify/enrich for email), not phone or
  cold-calling lists. Do NOT write the sequence (use instantly-gtm-write-sequence).
---

# Find leads (Instantly GTM: steps 1–2)

Direct entry to the Find + Enrich/verify part of the outbound loop. Run the CLI at
`__INSTANTLY_CORE__/instantly.mjs <verb> --params '<json>'` (see `__INSTANTLY_CORE__/capability-map.json`).

Load `__SKILL_DIR__/references/conversation.md` FIRST, dry-operator voice + the HARD STOP checklist
(no emoji/dingbats, no raw IDs/fields, no posture lines). Then load and follow, in order:
- `__SKILL_DIR__/references/icp-to-search.md`, ICP → exact SuperSearch enums; count-before-spend.
- `__SKILL_DIR__/references/enrichment-and-verify.md`, enrich, async polling, the non-skippable verify gate.
- `__SKILL_DIR__/references/list-quality-scorecard.md`, grade before hand-off.

Guardrails hold: count/preview before any spend; only Verified rows survive. Use the business profile
(`~/.instantly-gtm/profile/icp.md`, `personas.md`) if present. When done, hand off `list_id` + verified
count and offer the next step (write a sequence). For the full loop, use `/instantly-gtm`.

> If you see a literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path, the skill wasn't installed via
> install.sh, tell the user to run it.
