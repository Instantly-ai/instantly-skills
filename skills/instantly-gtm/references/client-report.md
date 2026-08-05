# Client report — outcome-led export, not a screenshot

**Goal:** turn a client's campaign results into a file you can hand them — outcomes (meetings, positive
replies), month-over-month, one honest narrative. **Reads only; export only** — it never sends to the
client. The narrative is the deliverable; charts are evidence, not the point.

## The build
1. **Scope the client** — `list_campaigns` → the client's campaigns. If campaigns aren't clearly tagged to
   one client, ask which are this client's; don't guess across a mixed workspace.
2. **Read this period vs last** — `analytics` + `analytics_overview` + `analytics_daily` for the current
   window (week/month) AND the prior one, so every number has a month-over-month delta. Reads only
   (guardrail 5 / D-003) — see `references/analytics.md` for the read shapes + the positive-reply north-star.
3. **Compute outcomes (not vanity)** — lead with **meetings booked** and **positive replies**; then
   reply rate and deliverability context. Opens/clicks are supporting evidence, never the headline
   (a client should see in 30 seconds whether outbound is working).
4. **Render the file** — via the `xlsx` / `pptx` / `pdf` skills (+ `dataviz` for charts), branded: a cover,
   the 3 outcome numbers, the MoM trend, meetings booked, one line on what's next.
5. **Write the narrative** — plain English, in the user's voice: "replies up 22% MoM, 3 meetings booked,
   deliverability steady, next we double down on the fintech segment." Put it in chat AND in the file.

## Outcome-first framing (the differentiator — hold the line)
The story leads; the charts support it. Never open with an opens/clicks grid. If the only movement is a
vanity metric, say so honestly rather than dressing it up.

## Errors + edge cases
| Case | Handling |
|------|----------|
| New client / thin history | A smaller, honest report — flag "early, limited history"; don't pad with vanity metrics or invent a trend. |
| File skills (xlsx/pptx/pdf/dataviz) absent | Degrade to a **stylized Markdown** report with the same content; say the file export needs those skills; never fail. |
| "send it to the client" | Export only — produce the file; the skill never sends. The user forwards it. |
| Multiple clients in one workspace | Filter by the client's campaigns/tags; if ambiguous, ask which campaigns are theirs. |
| No campaigns for the named client | Say so plainly; don't fabricate numbers. |
| Vanity-metric temptation | Outcomes (meetings, positive replies) lead; opens are context. |

## Boundary
This owns the **exportable, client-facing deliverable** (a file + MoM narrative). In-chat numbers and
"why is this campaign underperforming" belong to `check-performance` (Step 7) — route there for those.

## Format (Markdown fallback, when no file skills)
```
<Client> — <Month> outbound report
Outcomes: 4 meetings booked · 18 positive replies (reply rate 6.1%, +1.4pt MoM)
Deliverability: steady (bounce 1.2%)
What worked: the fintech-VP segment (2 of 4 meetings)
Next: scale that segment, refresh email 2 (drop-off point)
```
No raw IDs/fields; dry-operator voice (`conversation.md`). No write/act verbs anywhere in this step.
