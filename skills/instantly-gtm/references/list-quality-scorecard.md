# Reference: List quality scorecard (grade before you send)

Goal: catch a bad list in a couple of minutes, before it burns sender reputation. Row count is a
vanity number, 5,000 rows can still be 5,000 wrong, duplicate, or unsendable contacts. Run this
after Step 2 (enrich + verify), before Step 4 (assemble). It **suggests**; the only hard block is
the verify gate, the user decides on the rest.

## What it uses (already in hand, no extra spend)
- `verify_stats` on the list → verified / invalid / risky / catch_all / job_change counts.
- The `add_leads` accounting from import → duplicates, blocklist hits, in-payload dupes.
- Lead fields (job_title, company_name, company_domain, first_name) via `list_leads` / `get_lead`.
- The business profile (`icp.md`, `personas.md`) for ICP-fit, when onboarding was done.

## The 7 dimensions (score each 0–100, then a weighted letter grade)

| # | Dimension | How to read it | Healthy |
|---|-----------|----------------|---------|
| 1 | **Verification coverage** (weight ×3) | verified ÷ total from `verify_stats` | ≥ 95% verified before send |
| 2 | **Catch-all density** (×2) | catch_all ÷ total | < 10% (catch-alls bounce unpredictably) |
| 3 | **Invalid/risky residue** (×2) | (invalid + risky) still in the send set | ≈ 0, these must be dropped, not sent |
| 4 | **Duplicate / blocklist rate** | duplicated_leads + in_blocklist ÷ total_sent | < 5% |
| 5 | **ICP fit** | sample titles/industries/sizes vs `icp.md` + `personas.md` | ≥ 80% match the declared ICP |
| 6 | **Title relevance** | share of generic/mismatched titles (assistant, student, intern, or a role absent from personas) | low; buyers/influencers dominate |
| 7 | **Data completeness** | rows missing first_name / company (personalization inputs) | < 10% missing |

Grade: A (all green) · B (one soft miss) · C (a weighting-3 or two weighting-2 dimensions weak) ·
D/F (verification or ICP badly off). Show the grade, the 0–100 per dimension, and the **top 3–5
issues** with the biggest reputation impact first.

## Recommendation (never silent)
- **Go**, grade A/B: proceed to assemble.
- **Fix first**, grade C: name the cheap wins (drop role-based/`info@`/`sales@` addresses; re-verify
  pending rows; tighten or widen the ICP filters in Step 1) and offer to apply them.
- **No-go**, grade D/F or unverified rows present: stop. Sending this burns domains. Route back to
  Step 1 (re-ICP) or re-verification. The verify gate is non-negotiable regardless of grade.

## Edge cases
- **No profile** → skip dimension 5 (ICP fit), grade the rest, and say ICP-fit wasn't checked.
- **Tiny list (< ~50)** → note low statistical confidence; still flag obvious problems (catch-alls,
  free-mail domains, missing names).
- **User wants to send a C/D list anyway** → surface the specific risks and the likely bounce/spam
  cost, then respect an informed decision, except unverified rows, which stay blocked (guardrail 3).
- Everything here is a suggestion (guardrail 5); the scorecard never deletes leads on its own.

## Why this helps the user win (and us)
Clean lists = inbox placement = replies = a user who keeps sending. Bad lists = bounces = blocked
domains = churn. The scorecard is the cheapest insurance against the most common, most expensive
outbound mistake.
