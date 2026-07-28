# Reference: Sequence playbook (structures, personalization, examples)

Goal: give the writer proven skeletons and copy rules so drafts are good on the first pass. Pick a
structure, personalize with what you actually know, keep it human.

## Structures (pick by goal)

**A. 3-step intro → bump → breakup** (default; fastest to ship)
1. Intro, one relevant reason you're reaching out + a soft single CTA. (delay 3 days)
2. Bump, new angle or a proof point, shorter than #1. (delay 3–4 days)
3. Breakup, "should I close the loop?" Clean, no guilt. (end)

**B. 4-step value ladder** (more considered buyers)
1. Problem, name the pain the persona feels. (3d)
2. Proof, a specific result/case study for a similar company. (3–4d)
3. New angle, reframe (different pain, different outcome, or a resource). (4d)
4. Breakup. (end)

**C. Trigger-based** (highest reply rate when you have a signal)
Open with the trigger (funding, hiring, launch, news) → tie it to the outcome you deliver → soft CTA.
Follow-ups as in A. Use when Step 1 targeted a `news`/`signals` filter.

## Personalization hierarchy (best → acceptable)
1. **Signal-based**, reference the actual trigger ("saw you're hiring 5 SDRs").
2. **Role-pain**, the persona's known pain from `personas.md`.
3. **Company-context**, industry/size-specific framing.
4. **Generic-but-relevant**, never "I came across your website".
Put the sharpest hook in the first line. `{{personalization}}` is the per-lead custom first line when
enrichment or the agent produced one; otherwise fall back to role-pain.

## Copy rules (why they matter → deliverability + replies)
- One idea, one CTA per email. Short: email 1 under ~100 words.
- Plain-text feel; no links or images in email 1 (pairs with deliverability + `spam-safe-copy.md`).
- Subjects: lowercase, specific, curiosity-plain, not shouty. Under ~60 chars.
- Write like a person to a person: no hype, no corporate throat-clearing ("hope this finds you well").
- Ask a question the reader can answer in one line, low reply friction.
- Final step is a genuine break-up; it often gets the most replies.
- Spintax/heavy templating is out for v1, clarity over cleverness.

## Worked example 1: SaaS → Series-A fintech VP of Sales (3-step)
- **E1** subject: `quick question about {{companyName}}`, "Hi {{firstName}}, noticed {{companyName}}
  raised its Series A, usually means the sales team is scaling fast. We helped <similar co> cut new-rep
  ramp from 90 to 30 days. Worth a quick look?" (delay 3d)
- **E2** subject: `` (threads), "Following the note above, the ramp problem tends to bite right after
  a raise. Happy to send the 1-page breakdown of how <similar co> did it. Want it?" (delay 4d)
- **E3** subject: ``, "Should I close the loop on this, {{firstName}}? No worries if the timing's off."

## Worked example 2: agency → ecommerce founder (4-step value ladder)
Problem (rising CAC) → Proof (a comparable brand's result) → New angle (a free teardown) → Breakup.
Keep each under the length bands above; CTA escalates from "worth a look?" to a concrete offer.

> These examples are patterns to adapt to the user's real offer and voice, never send them verbatim.
