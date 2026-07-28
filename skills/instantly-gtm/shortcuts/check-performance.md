---
name: instantly-gtm-check-performance
description: >-
  Shortcut into the Instantly GTM loop, check campaign performance: pull analytics, chart them,
  headline positive-reply rate, flag winners/losers, and suggest the next change. Trigger on "how's
  my campaign doing", "why is campaign X underperforming", "check performance", "deliverability".
---

# Check performance (Instantly GTM: step 7)

Direct entry to reporting. Run the CLI at `__INSTANTLY_CORE__/instantly.mjs` (READ verbs only here).
Load `__SKILL_DIR__/references/conversation.md` FIRST, dry-operator voice + the HARD STOP checklist
(no emoji/dingbats, no raw IDs/fields, no posture lines). Then load and follow:
- `__SKILL_DIR__/references/analytics.md`, fetch recipe, exact metric fields, chart specs, the suggest-never-act playbook.
- `__SKILL_DIR__/references/outbound-rhythm.md`, positive-reply-rate north-star + single-variable experiments.

Guardrail 5 holds: analytics reads, charts, and SUGGESTS, it never changes a campaign (zero write
verbs). Headline positive-reply rate over vanity metrics; frame changes as single-variable experiments
and route them to their owning step. For the full loop, use `/instantly-gtm`.

> Literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path visible? Not installed via install.sh, tell the user to run it.
