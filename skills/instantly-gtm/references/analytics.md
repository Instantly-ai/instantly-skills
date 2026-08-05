# Reference: Report + charts (Step 7)

Goal: explain how campaigns are doing, chart it, flag winners and losers, and SUGGEST the next move.
**Guardrail 5: analytics reads, charts, and suggests, it never changes a campaign.** This step calls
only read verbs. Verbs: `analytics`, `analytics_overview`, `analytics_steps`, `analytics_daily`,
`sending_status`, `list_campaigns`.

**This is the front door for "why is it failing" panic phrasings** ("going to spam", "nobody's replying",
"open rate tanked", "campaign is dead"): DIAGNOSE first from the numbers. If the drop is a **deliverability
/ sender** problem (low inbox/open rate, sending health poor, cold domain), hand off to
`references/scale-senders.md` (view infra → warmup health → DFY only if senders are the cause). If it's a
**reply/copy** problem (opens fine, replies low), route to the sequence writer. Name the ONE fix; don't
push more senders when the real problem is the copy.

## Fetch recipe (by the question asked)
- **Portfolio / "how's everything?"** → `analytics` with no id (all campaigns) + `exclude_total_leads_count=true`
  (much faster) → a comparison table.
- **One campaign / "why is X underperforming?"** →
  - `analytics` (that id), the headline counts,
  - `analytics_overview`, the CRM funnel (interested → meeting → closed),
  - `analytics_steps`, per step/variant,
  - `analytics_daily`, the trend,
  - `sending_status`, is it even sending? (reuse the Step 5 diagnostics table).
- Date window is `YYYY-MM-DD`; a 400 "Start Date must be earlier than End Date" → fix the range, retry once.

## The north-star: positive-reply rate (headline this)
Per `references/outbound-rhythm.md` (3C): report **positive-reply rate = positive replies / emails
sent** ABOVE vanity metrics. Positive comes from `analytics_overview` (`total_interested`,
`total_meeting_booked`, `total_meeting_completed`, `total_closed`) + the Step-6 classification.

## Derived metrics (define once, from exact fields: never invent a field)
- **Reply rate** = (`reply_count_unique` − `reply_count_automatic_unique`) / `new_leads_contacted_count`.
- **Open rate** = `open_count_unique` / `contacted_count`, flag as UNRELIABLE if open tracking is off.
- **Bounce rate** = `bounced_count` / `emails_sent_count`.
- **Opportunity value** = `total_opportunity_value` (+ `total_opportunities`).
- Step view uses `sent`, `unique_opened`, `unique_replies`, `unique_clicks`; `variant` is `"0"`=A,
  `"1"`=B, `"2"`=C; `step` can be null (undeterminable), say so rather than guessing.

## Benchmarks (skill policy: anchor to the user's own baseline when known)
- Positive-reply rate ≥ ~1% is healthy for cold; raw reply rate ≥ ~2–3%.
- Bounce < 3% is fine; **> 5% = stop and clean** the list/domains.
- A high raw reply rate that's mostly "not interested"/"unsubscribe" is a bad sign, not a good one.

## Charts (inline widget where available, else Markdown + Mermaid)
Render the report IN the chat. Where an inline visual-widget tool exists (claude.ai), use it: a Chart.js
report = a metric-card strip (2–4 KPIs) + a custom legend + the reply-rate/funnel chart, per
`references/inline-visuals.md` (CSS-variable theming, Instantly hex dataset colors, one y-axis, aria).
Otherwise fall back to stylized **Markdown** (bold hero number, metric table, `▓▓▓░░` funnel bars) + a
**Mermaid** funnel where it renders. **Never build a file / HTML dashboard / artifact for a report**
(that side-panels it), inline widget or Markdown only. Lead with the number that matters, then the shape,
then one flat suggestion (voice: `conversation.md`).

**The report layout (in this order):**
1. **Hero, positive-reply rate.** The north-star as one large number + a small trend sparkline
   (`analytics_daily`). This is the headline; vanity metrics go below it. Render it in the "good"
   status color (green), it is the one positive metric, not a series.
2. **Metric strip**, contacted · open rate · reply rate · meetings, as small tiles.
3. **Drop-off funnel**, Contacted → Opened → Replied → Interested → Meetings as decreasing bars
   (`analytics` + `analytics_overview` + Step-6 classification). One entity narrowing = **one hue**
   (brand), every stage direct-labeled with its count.
4. **Which email earns the replies**, per-step contribution bars (`analytics_steps`,
   `unique_replies` by step), winner emphasized. This is the visual that drives the suggestion.
5. (Still available) **Daily trend**, **A/B variants** (label 0/1/2 as A/B/C), **portfolio comparison**.

**Chart rules (so it reads as one system, not decoration):**
- Magnitude = ONE hue, never hue-by-rank; green is reserved for the good/north-star metric, never a
  series color. Every bar direct-labeled, identity never rests on color alone (CVD/print safe).
- ≥2-series charts carry a legend; thin marks; recessive grid; values in text tokens, not the mark color.
- Theme-aware (light/dark from the host). Render and eyeball for label collisions before calling it done.

## Suggestion playbook (SUGGEST → the user applies; never auto-act)
Each item: symptom → likely diagnosis → suggested action, ending "want me to draft the change? You'd
apply it." Frame every change as a **single-variable experiment** (3C: list-only OR copy-only, one
hypothesis, hold the rest constant).

| Symptom | Likely cause | Suggested action (routed to its step) |
|---|---|---|
| Low reply, decent opens | copy/CTA weak | rework copy (Step 3, sequence-writer), copy-only experiment |
| Low reply, low/unknown opens | targeting or deliverability | tighten ICP (Step 1) or check senders (Step 5), list-only experiment |
| High bounce (>5%) | list hygiene | re-verify / clean the list (Step 2); consider pausing until clean |
| Zero sends | not sending | read `sending_status`; fix per the Step-5 diagnostics table |
| Big drop after step 1 | follow-up timing/angle | adjust delay or the follow-up angle (Step 3) |
| One variant clearly wins |, | promote the winner (the user applies it in Step 4, confirm-gated) |

Applying any change happens in its owning step behind that step's confirm, this step only proposes.

## Flag winners too (growth: D-017)
Rank the portfolio by positive-reply rate. For a WINNER, suggest scaling: add more leads (Step 1),
add senders, or clone the campaign, "this is working; want to pour more into it?" Volume on what
already converts is the honest growth lever. (More warmed senders needed → the Step-5 pre-warmed link.)

## Capture what worked (results memory: chunk 17)
After a report, if the campaign has enough signal (~10+ replies or a clear margin), distill what won, 
angle, segment, subject/length style, confirm it in one line, and write it to
`~/.instantly-gtm/profile/results.md` (template in `assets/profile-templates/`). Below the threshold:
say "not enough signal yet," save nothing. **This is a NOTE, not an action:** writing results.md calls
ZERO write verbs and never touches a live campaign (guardrail 5). The sequence writer (Step 3) then
leads from these instead of a blank page; the user's explicit preferences always override a saved pattern.

## Edge cases
- Campaign too young / zero sends → "no data yet"; check `sending_status`, don't chart noise.
- Open tracking off → suppress open-based diagnoses and say why.
- 404 (bad id) → `list_campaigns` to find it by name, re-ask.
- Huge portfolio → summarize top/bottom N, offer drill-down (keep the response readable).
- User says "just fix it" → the fix routes to its owning step (3/4/5) with that step's confirm;
  this step changes nothing (guardrail 5).
