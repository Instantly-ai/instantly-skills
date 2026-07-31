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

## Subject craft
Engineer the subject to look non-marketing: lowercase, a 2–4 word fragment, zero sales words (a
first-name prefix like `{{firstName}} - quick one` reads personal). Follow-ups carry NO subject so they
thread onto email 1 (continuity + deliverability). The subject's only job is to not look like an ad.

## Framework shapes (pick one, don't default to mush)
Choose the shape that fits the pain, then write to it:
| If the pain is… | Shape | The move |
|---|---|---|
| Quantifiable, ops buyer | Do the Math | trigger → back-of-napkin cost → CTA |
| You hold real intel | Permissionless Value | hand over the intel, no pitch |
| Founder pitched constantly | Ask Before Pitch | the question IS the CTA |
| High-volume SMB | Short Trigger | under ~30 words, soft close |
| Known industry-wide pain | Challenge of Similar Cos | "teams like yours hit X" (generic, never a named customer) |

## Cold CTA ladder (interest before calendar)
At the cold stage, interest asks out-pull calendar asks, so climb, don't lead with a meeting:
| Touch | Job | CTA |
|---|---|---|
| E1 | the observation (most of the effort) | soft interest ("worth exploring?"), no link |
| E2 | a NEW angle question, not a bump | still interest |
| E3 | offer the asset (only now) | "want me to send it?" |
| E4 | first calendar ask, link appears | the meeting (real booking link, or "reply to this email") |
| E5 | binary break-up | "1, 2, or 3?" |
Cap at ~5. Meeting-first still governs warm/reply stages; this ladder is the cold-stage exception.

## Proof discipline
Specificity = THEIR world, not your stats. Hold product proof to a later touch, framed as a pattern
("what we see across teams"), never a promise, a competitor's name, or a claim that a named company is a
customer. Anti-guarantee reads more credible than a guarantee ("nothing can guarantee X, here's what we
do about it").

## Worked example 1: SaaS → Series-A fintech VP of Sales (3-step)
- **E1** subject: `{{firstName}} - quick one`, "Hi {{firstName}}, noticed {{companyName}} just raised,
  which usually means reps get hired faster than they can ramp. Curious how you're handling that stretch,
  worth exploring?" (observation, no product claim; delay 3d)
- **E2** subject: `` (threads), "Following on, the ramp gap tends to bite hardest in a new rep's first 60
  days. How are you getting them productive today?" (new angle, still interest; delay 4d)
- **E3** subject: ``, "Last note from me, {{firstName}}, is fixing rep ramp a this-quarter thing or not
  right now?" (clean binary break-up, no passive close)

## Worked example 2: agency → ecommerce founder (4-step ladder)
E1 observation (their CAC math, no product claim) → E2 new-angle question → E3 offer a short teardown
("want me to send it?") → E4 clean binary break-up. Interest first; a calendar link only if it reaches a
meeting ask. Keep each under the length bands above.

> These examples are patterns to adapt to the user's real offer and voice, never send them verbatim.
