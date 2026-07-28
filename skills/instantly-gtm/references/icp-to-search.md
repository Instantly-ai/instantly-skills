# Reference: ICP → SuperSearch filters (Step 1: Find)

Goal: turn what the user said into precise SuperSearch filters, show the **count**, and never spend a
credit before they confirm. Verbs: `find_count`, then `find_preview`. Values below are CLOSED enums, 
a typo silently returns the wrong people, so copy them exactly.

## The flow (count-before-spend)
1. Build `search_filters` from the ask (+ the profile's `icp.md`/`personas.md` if present, confirm,
   don't assume).
2. `find_count` → `{number_of_leads}` (clamped at 1,000,000). Zero or absurd → adjust one filter, recount.
3. `find_preview` → a free sample (`leads[]` are camelCase and have **no emails**; trial workspaces
   see `number_of_redacted_results`). Show the user the count + a few sample names/titles/companies.
4. User confirms the target `limit` → hand to Step 2 (enrich). No enrichment spend happens before this.

## Mapping the user's words → filters

**Seniority → `level`** (choose from, verbatim): `Owner`, `Partner`, `Executive`, `Director`,
`Senior`, `Manager`, `Associate`, `Entry level`, `Mid-Senior level`, `Vice President (VP)`,
`Chief X Officer (CxO)`, `Internship`, `Unpaid / Internship`. ("VP of Sales" →
`["Vice President (VP)"]`; C-suite → `["Chief X Officer (CxO)"]`.) NOTE: the `-Level`-suffixed
values (`C-Level`, `VP-Level`, `Director-Level`, `Manager-Level`) and `Staff` are accepted by the
schema (no error) but match ZERO leads, verified live against the v2 API. Never use them.

**Role/function → `department`** (9, verbatim): `Engineering`, `Finance & Administration`,
`Human Resources`, `IT & IS`, `Marketing`, `Operations`, `Sales`, `Support`, `Other`.

**Job title → `title` `{include:[], exclude:[]}`**, free-text titles (e.g. `"VP of Sales"`,
`"Head of Sales"`, `"CRO"`). Use `exclude` to drop lookalikes (e.g. exclude `"assistant"`).

**Company size → `employeeCount`**, ALWAYS an array (verified live: a bare value/object returns
`400 … employeeCount must be array`). Exact strings (mind the spacing): `["0 - 25"]`, `["25 - 100"]`,
`["100 - 250"]`, `["250 - 1000"]`, `["1K - 10K"]`, `["10K - 50K"]`, `["50K - 100K"]`, `["> 100K"]`. Or a
custom range object, still array-wrapped: `[{op: "between"|"gte"|"lte", min, max}]`.

**Revenue → `revenue`** (verbatim): `"$0 - 1M"`, `"$1 - 10M"`, `"$10 - 50M"`, `"$50 - 100M"`,
`"$100 - 250M"`, `"$250 - 500M"`, `"$500M - 1B"`, `"> $1B"`.

**Funding stage → `funding_type`** (array): `angel`, `seed`, `pre_seed`, `series_a` … `series_j`,
and `pre_series_a` … `pre_series_j`. ("Series A" → `["series_a"]`.)

**Industry → `industry` `{include:[], exclude:[]}`** (20, verbatim): `Agriculture & Mining`,
`Business Services`, `Computers & Electronics`, `Consumer Services`, `Education`, `Energy & Utilities`,
`Financial Services`, `Government`, `Healthcare, Pharmaceuticals, & Biotech`, `Manufacturing`,
`Media & Entertainment`, `Non-Profit`, `Other`, `Real Estate & Construction`, `Retail`,
`Software & Internet`, `Telecommunications`, `Transportation & Storage`,
`Travel, Recreation, and Leisure`, `Wholesale & Distribution`.
Finer targeting → `subIndustry {include,exclude}` (~147 LinkedIn-style values, e.g. `Computer Software`,
`Internet`, `Financial Services`, `Marketing and Advertising`). Ask the user / expand for niche ones.

**Geography → `locations` `{include:[], exclude:[]}`**, items are `{place_id}` (Google Maps ID) or
`{city?, state?, country?}` (≥1 of the three). `location_mode`: `"contact"` (default) or `"company"`.

**Buying signals →** `news` (27 company events, e.g. `receives_financing`, `hires`,
`expands_offices_to`, `goes_public`, `acquires`) or `signals` (string category, or
`{key, period_days=30, keywords}`). Named accounts → `company_name {include,exclude}`, `domains[]`,
or `look_alike` (single seed domain). Free-text → `keyword_filter {include, exclude}` (single strings).
Hygiene: `skip_owned_leads: true` (skip leads you already own), `show_one_lead_per_company` when you
want one contact per company.

## Worked example: "Find 200 Series-A fintech VPs of Sales"
```
title:        { include: ["VP of Sales", "Head of Sales", "Chief Revenue Officer"] }
level:        ["Vice President (VP)"]
department:   ["Sales"]
industry:     { include: ["Financial Services"] }         # + subIndustry for true "fintech" nuance
funding_type: ["series_a"]
```
→ `find_count` → confirm the number is sane → `find_preview` → user approves `limit: 200` → Step 2.

## Widen / narrow (change ONE filter at a time, then recount)
- **Too few / zero:** drop `subIndustry` → widen `employeeCount` band → widen `level` → drop `signals`/`news`.
- **Too many / loose:** add a tighter `level`, a narrower size band, a geography, or a disqualifier in
  an `exclude` list.
Never enrich an empty or absurd search, fix the filters first.

## Gotchas
- Enums are closed and case/spacing-sensitive, a near-miss returns wrong or zero results silently.
- Preview leads have NO emails and are camelCase; don't promise emails until enrichment (Step 2).
- `find_preview`'s `number_of_leads` is an approximate sample count and can differ slightly (~few %)
  from `find_count` for the same filters, quote `find_count` as the authoritative number.
- `count` is capped at 1,000,000; a giant count usually means the filters are too loose.
- SuperSearch pricing isn't in the local docs, do NOT quote credit costs; count/preview is the free
  cost-control gate. Credit spend happens only at enrich (Step 2), which surfaces credits used.
