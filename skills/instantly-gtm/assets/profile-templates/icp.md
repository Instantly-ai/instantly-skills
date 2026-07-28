<!-- TEMPLATE → ~/.instantly-gtm/profile/icp.md. Who we target. Used by Step 1 (find) to build
     SuperSearch filters, phrase values so they map onto Instantly's filter enums. -->

# Ideal Customer Profile (ICP)

- **Industries:** <e.g. B2B SaaS, fintech> → maps to `industry` / `subIndustry`
- **Company size:** <e.g. 50–200 employees> → maps to `employeeCount`
- **Revenue (optional):** <e.g. $1–10M> → maps to `revenue`
- **Funding / stage (optional):** <e.g. Series A> → maps to `funding_type`
- **Geography:** <e.g. US + Canada> → maps to `locations` (+ `location_mode`)
- **Tech / signals (optional):** <hiring SDRs, uses Salesforce, recently funded> → `signals` / `news`

## Disqualifiers (who to EXCLUDE)
- <e.g. agencies, sub-10-employee companies, students> → filter `exclude` lists

## Notes
- <anything nuanced about fit the filters can't capture; the agent asks before assuming>
