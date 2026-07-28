# Reference: Outbound rhythm & the metric that matters

Goal: keep the user focused on the ONE metric that predicts revenue, and give them a simple cadence
so outbound compounds instead of fizzling. Used by Step 7 (report) and the orchestrator's growth posture.

## The north-star: positive-reply rate

Replies tell you people noticed. **Positive** replies tell you they want what you're selling. Optimize
the second:

```
positive_reply_rate = positive_replies / emails_sent
```

- **Positive** = interested + soft-positive ("send info / reach out in Q3") + referral ("talk to X").
  Read these from Instantly `analytics_overview` (`total_interested`, `total_meeting_booked`,
  `total_meeting_completed`, `total_closed`) and the Step 6 reply classification.
- **Exclude** out-of-office and bounces from the numerator (and don't let them flatter reply rate).
- **Contrast with vanity metrics:** open rate is unreliable (tracking is often off/blocked); a high
  raw reply rate full of "not interested" / "unsubscribe" is a *bad* sign, not a good one.

Worked comparison: 1% reply / 70% positive = **0.70%** positive-reply rate beats 5% reply / 10%
positive = **0.50%**. Headline positive-reply rate above opens and raw replies in every report.

**Rule-of-thumb benchmarks (skill policy, refine with the user's own baseline):** positive-reply
rate ≥ ~1% is healthy for cold; bounce rate must stay < 3% (> 5% = stop and clean the list/domains).

## The operating rhythm (a playbook, not a cron)

Consistency is what separates people who get meetings from people who "tried cold email once." This is
a **pure playbook**, v1 sets no automatic reminders; the user puts these on their own calendar. Map
each ritual to the skill:

| Cadence | Ritual | In the skill |
|---------|--------|--------------|
| Each working session | Reply sweep, clear the inbox, book the meetings | Step 6 (`list_replies` → triage) |
| Weekly | Deliverability + performance review; flag under-performers | Step 7 (`analytics`, `warmup_analytics`, `sending_status`) |
| Weekly | Positive-reply retrospective, what copy/segment is converting? | Step 7 + Step 6 classification |
| Biweekly | Sender health / warmup + rotation check | `list_accounts`, `warmup_analytics` |
| Monthly | Refresh the list, add new leads, retire exhausted ones | Steps 1–2 |
| Quarterly | Experiment review, what did we actually learn? | this doc's experiment log |

Offer to help run the due ritual when the user checks in, and celebrate the wins (a booked meeting is
the habit's reward). Volume + consistency are the honest growth levers (D-017).

## Single-variable experiments (so you actually learn)

Changing the list, the copy, and the offer at once teaches nothing, you can't tell what moved the
number. Isolate ONE variable per experiment. Step 7 frames every suggested change this way.

1. **Hypothesis first, one sentence:** "Targeting <segment> will beat <baseline> on positive-reply
   rate, because <reason>."
2. **Pick the variable, hold the rest constant:**
   - *List-only*, change targeting; keep copy, offer, senders, timing fixed → learn about the segment.
   - *Copy-only*, change subject/body/variant; keep list, offer, infra fixed → learn about the message.
   - *Combined*, new ICP + new copy at once; use only to launch something new, and treat results as a
     hypothesis, not a conclusion.
3. **Judge on positive-reply rate** at a fair sample size; weight confidence by how cleanly the
   variable was isolated. Record the learning so the quarterly review compounds.

Because analytics only suggests (guardrail 5), the skill proposes the experiment and the change; the
user applies it (via the confirm-gated Step 4/5 flows).
