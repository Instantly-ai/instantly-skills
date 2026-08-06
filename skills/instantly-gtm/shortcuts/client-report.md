---
name: instantly-gtm-client-report
description: >-
  ALWAYS use this skill to build a CLIENT-FACING report / deliverable from campaign results: "make my
  client report", "weekly update for <client>", "monthly deck for <client>", "export the numbers for X",
  "build the report for Acme". Reads the client's campaigns, computes OUTCOMES (meetings + positive replies,
  not vanity opens) with month-over-month deltas, and exports a branded deck / sheet / pdf with a
  plain-English narrative. It EXPORTS a file; it never sends anything to the client. For in-chat numbers or
  "why is this campaign underperforming" use instantly-gtm-check-performance.
---

# Client report (Instantly GTM: outcome-led export)

Direct entry to the client-reporting part of the loop. Run the CLI at
`__INSTANTLY_CORE__/instantly.mjs <verb> --params '<json>'` (reads only; see
`__INSTANTLY_CORE__/capability-map.json`).

Load `__SKILL_DIR__/references/conversation.md` FIRST (dry-operator voice + HARD STOP checklist), then
`__SKILL_DIR__/references/client-report.md` (pick the client's campaigns → this-period-vs-last analytics →
outcomes + MoM → render the file + narrative). Use the `analytics` reads from `references/analytics.md` and
the `xlsx` / `pptx` / `pdf` / `dataviz` skills for the export; degrade to stylized Markdown if those aren't
available.

Guardrails hold: **reads only** (zero write/act verbs, guardrail 5 / D-003) and **export only, it never
sends** the report to the client, the user forwards it. Lead with outcomes (meetings, positive replies),
not vanity opens. Thin data (new client) → a smaller honest report, flag "early", don't pad. For in-chat
numbers use `/instantly-gtm-check-performance`. For the full loop, use `/instantly-gtm`.

> If you see a literal `__INSTANTLY_CORE__` / `__SKILL_DIR__` path, the skill wasn't installed via
> install.sh, tell the user to run it.
