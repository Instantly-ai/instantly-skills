---
name: sequence-writer
description: >-
  Write a cold-email sequence, subject lines, body copy, personalization variables, and follow-up
  timing, that sounds like the user and is ready to drop into an Instantly campaign. Trigger on
  "write a cold email", "write a sequence", "draft outreach", "follow-ups", "email copy", or as the
  Write step of the outbound loop. Produces a structured sequence, not prose.
---

# Sequence writer

Draft a complete email sequence and emit it in the exact shape a campaign expects. No API calls, this
is a copywriting module; the orchestrator writes the result into the campaign at Step 4.

## Intake (ask ONLY for what's missing: inherit the rest)
Pull from the business profile when present (`~/.instantly-gtm/profile/`): offer + proof points
(`company.md`/`offer.md`), ICP/personas (inherit Step 1 state or `personas.md`), voice (`tone.md`),
booking link (`booking-links.md`). Ask the user only for gaps (never ask for a name/sign-off, see below):
- The offer + one concrete proof point (never invent claims about their product).
- CTA type: book a meeting / reply / grab a resource.
- Sequence length (default 3–4 steps) and variants per step (default 1; add A/B on request).

## Start from what worked (results memory: chunk 17)
Before drafting, read `~/.instantly-gtm/profile/results.md` if present. Lead the sequence with the
proven angle + segment + subject/length style recorded there, don't start from a blank page. Say so
in one line ("leading with the pricing angle, it out-pulled the others last time"). The user's
explicit ask always overrides a saved pattern; treat results as "what worked here," not a rule.

## Voice (D-019)
Write in the user's Outbound voice from `tone.md`. If they edit a draft or state a rule
("shorter", "no exclamation marks", "sign off with X"), the orchestrator captures it back into
`tone.md`, apply it here and don't re-ask.

## Output contract (this is the important part)
Emit the sequence as a fenced `json` code block in the campaign sequence shape, plus a
human-readable rendering above it. Exact shape (the orchestrator places this at `sequences[0]`):

```json
{
  "steps": [
    { "type": "email", "delay": 3, "delay_unit": "days",
      "variants": [ { "subject": "quick question about {{companyName}}", "body": "Hi {{firstName}},\n\n..." } ] },
    { "type": "email", "delay": 3, "delay_unit": "days",
      "variants": [ { "subject": "", "body": "..." } ] },
    { "type": "email", "delay": 0, "delay_unit": "days",
      "variants": [ { "subject": "", "body": "..." } ] }
  ]
}
```

Rules for the shape:
- `type` is always `"email"` (the only supported step type).
- `delay` is the wait AFTER this email before the NEXT one (`delay_unit`: `days` default, or
  `hours`/`minutes`). Email 1 sends on launch; its `delay` is the gap to email 2. The last step's
  `delay` is irrelevant.
- Each step has ≥1 `variants` item; every variant needs `subject` + `body`. Disable a variant with
  `"v_disabled": true` (there is no "enabled" flag). Do NOT use `pre_delay` (subsequences only).
- **Follow-up subjects:** leave `subject: ""` on follow-ups so they thread as a reply to email 1
  (Instantly convention, verify against the current docs at wiring time; if unconfirmed, use
  `"Re: <original subject>"`). Only email 1 needs a real subject.

## Variables (must resolve, or they render literally in sent mail)
Recipient variables (exist on the leads): `{{firstName}}`, `{{lastName}}`, `{{companyName}}`,
`{{jobTitle}}`, `{{personalization}}`, plus any custom variables confirmed present on the list (check
the Step 2 lead payload keys). Sender variable for sign-offs: `{{sender_first_name}}` (Instantly fills
it per sending mailbox). An unknown variable is a hard error: substitute an available one or static
text and warn.

## Sign-offs are DYNAMIC: never a static name (D-033)
End every email with a plain closer ("Thanks," / "Best,") then `{{sender_first_name}}`. NEVER hardcode a
name and never use `[your name]`: a campaign rotates across many sending mailboxes, so a static name
mismatches whoever actually sends and reads as a mass blast. If `{{sender_first_name}}` can't be
confirmed against the account fields, use a NAMELESS closer ("Thanks,"), never a name, never a broken tag.

## No em dashes, no bot-phrasing (D-034)
Copy never uses em dashes (—); use a period, comma, or "and". Avoid AI-sounding filler. The spam-safe
scan (below) also enforces the full spam-word blocklist in `references/spam-safe-copy.md`.

## Self-check before handing off (all must pass)
- [ ] Every `{{variable}}` resolves against the list's fields.
- [ ] Email 1 subject ≤ ~60 chars, lowercase-plain, no hype.
- [ ] Bodies are short (email 1 ≈ under 100 words), one idea, one CTA.
- [ ] **Spam-safe scan** per `references/spam-safe-copy.md`: blocklist + no em dashes; rewrite anything flagged.
- [ ] Sign-off is `{{sender_first_name}}` (or a nameless closer), never a static name or `[your name]`.
- [ ] Follow-ups reference the original thread; the final step is a clean break-up.
- [ ] Meeting CTAs use the real booking link (or default to "reply to this email", never invent a URL).
- [ ] Reads in the user's voice (`tone.md`).

## Edge cases
- Missing offer detail → ask; don't fabricate. User pastes their own copy → run the self-check +
  format it into the contract, don't rewrite uninvited. Requested >6 steps → push back with the
  playbook rationale, comply if insisted. Non-email channel → out of scope (email only).

See `references/sequence-playbook.md` for structures, personalization, and worked examples.
