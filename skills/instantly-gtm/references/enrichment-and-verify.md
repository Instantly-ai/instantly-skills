# Reference: Enrich + verify (Step 2)

Goal: turn confirmed filters into a verified, sendable list, and **never let an unverified row reach
a campaign** (guardrail 3, non-skippable). Verbs: `enrich`, `get_background_job`, `verify_stats`,
`verify_email`, `verify_status`.

## 1. Enrich (import into a lead list)
Call `enrich` with the confirmed `search_filters` + `limit` (required, 1–1,000,000), plus:
- `work_email_enrichment: true`, get work emails.
- **email verification requested as part of enrichment** (email-verification enrichment / the list's
  `has_enrichment_task`), so verification runs on import, not as a manual afterthought.
- `skip_rows_without_email: true`, don't import rows with no email.
- `skip_owned_leads: true`, dedup against leads already in the workspace.
- `list_name` derived from the ICP (e.g. `"Series-A fintech VPs, 2026-07"`).

Capture from the response: `resource_id` (the new list) and `background_job_id` (may be **null**, a
job isn't always spawned). This is asynchronous.

## 2. Poll to completion (import + enrichment are background work)
Poll with light backoff (~5s → 15s), reporting progress to the user:
- If `background_job_id` is set → `get_background_job`: `status` ∈ `pending | in-progress | success |
  failed | draining | paused | cancelled`, `progress` 0–100.
- Also check the enrichment status on the resource → `in_progress` (still running), `has_no_leads`
  (search produced nothing).
Handle both branches (job id present or null).

## 3. Verify gate (non-skippable: the heart of Step 2)
Read `verify_stats` on the list → `{ verified, invalid, risky, catch_all, job_change,
verification_job_pending_leadfinder, verification_job_pending_user, total_leads }`.

Lead-level `verification_status`: `1` Verified · `11` Pending · `12` Pending-job · `-1` Invalid ·
`-2` Risky · `-3` Catch-all · `-4` Job-change.

**Policy:** only **Verified (1)** rows enter the send set. `invalid / risky / catch_all / job_change`
are dropped and REPORTED with counts, never sent, never silently kept. `Pending` → keep polling.
Fallback for small/manually-added lists with no enrichment verification: per-email `verify_email`
(async, if it takes >10s it returns `pending`, then poll `verify_status`). Either path, the gate
keys on Verified only.

## 4. List-quality gate (chunk 3C) + credits
- Run `references/list-quality-scorecard.md` on the verified set → grade + top issues + go/fix/no-go.
  It SUGGESTS; the verify gate is the only hard block.
- Surface credits: verification responses expose `credits` / `credits_used`, report spend so the
  user trusts the tool. **Growth touchpoint (contextual, once):** if the target exceeds available
  credits or they run low, say so plainly and offer a top-up LINK to the Instantly app (never a buy call).

## 5. Hand-off to Step 4 ("Ready" contract)
Pass forward: `list_id` (= `resource_id`) · verified count · the drop report (invalid/risky/etc.) ·
the scorecard grade. Step 4 attaches only the verified leads.

## Errors + edge cases
- **Count/preview was 0** (Step 1) → don't enrich; widen the ICP first.
- **Job `failed` / `paused` / stuck** (no progress after several polls) → surface the job status +
  reason; suggest retry or a smaller `limit`; never blindly re-fire (double credit spend).
- **`has_no_leads: true`** → explain and return to widening (Step 1).
- **All rows unverifiable** → stop with the stats table; offer re-ICP. Never "send anyway".
- **402** (no paid plan) → paid-plan message + upgrade link. **429** → back off (100 req/s, 6k/min).
- **User-supplied CSV** instead of SuperSearch → import via the add-leads path (Step 4) but apply the
  SAME verify gate here first.

## Why the gate matters
Unverified sends bounce; bounces wreck domain reputation; wrecked domains = the campaign (and future
ones) underdeliver. The verify gate is the single highest-leverage protection in the whole loop, it
is not optional, in any mode.
