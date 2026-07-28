# Reference: Assemble the campaign as a draft (Step 4)

Goal: turn the verified list + the written sequence into a complete campaign that is **inactive**,
so the user reviews everything before a single email sends (guardrail 1). This step creates and
attaches; it NEVER activates (that's Step 5, behind the launch confirm). Verbs: `list_accounts`,
`create_campaign`, `add_leads`, `get_campaign`, `update_campaign`.

## Recipe (in order)

### 1. Choose sending accounts
`list_accounts` → candidate senders are `status == 1` (Active) and `setup_pending == false`. Let the
user pick, or confirm "use all N". Surface obvious reds here (paused/error accounts); the full
warmup/cold-domain health check is Step 5, don't launch-gate here, just don't offer a broken sender.

### 2. Build the schedule (`campaign_schedule`)
Default: Mon–Fri, 09:00–17:00, in the lead/user timezone. Shape:
```
campaign_schedule.schedules[0] = {
  name: "Default",
  timing: { from: "09:00", to: "17:00" },     // 24h HH:MM
  days: { "1": true, "2": true, "3": true, "4": true, "5": true, "0": false, "6": false },
  timezone: "<IANA zone FROM THE FIELD'S ENUM>"
}
```
- `days` keys are **string digits "0"–"6"**; `schedules` needs ≥1 item.
- **Timezone gotcha:** `timezone` is a CLOSED enum (~106 zones) that is **missing** common ones
  (`America/New_York`, `America/Los_Angeles`, `Europe/London`). Map the user's zone to a same-offset
  zone that IS in the enum, known-safe substitutions: US Eastern → `America/Detroit`, US Central →
  `America/Chicago`. Verify the exact enum from the field at wiring time; if you can't confidently map
  it, **ask the user to pick from the enum, never guess silently**.

### 3. Create the campaign (inactive by construction)
`create_campaign` with: `name`, `campaign_schedule`, `sequences` (the writer's JSON as
`sequences[0]`, only the first element is used), `email_list` (chosen sender emails), and
conservative, self-contained ramp defaults so the draft is valid on its own (D-011):
- `daily_limit` ≈ 30 × sender-count (safe cold default; Step 5 may refine via confirm-gated update),
- `stop_on_reply: true`, `insert_unsubscribe_header: true`, `open_tracking` per the user,
  `text_only`/first-email-text-only per the playbook, a sensible `email_gap`.
`status` is read-only → the campaign is created as **Draft (0)**. The request body is
`additionalProperties: false`, send only real fields; never invent keys.

### 4. Attach ONLY the verified leads
`add_leads` with `campaign_id` + the Verified-only set from Step 2, in **batches of ≤ 1000**:
- `skip_if_in_campaign: true`; `verify_leads_on_import: false` (already verified, don't re-spend).
Reconcile the response accounting and report a delta table: `leads_uploaded`, `in_blocklist`,
`duplicated_leads`, `invalid_email_count`, `duplicate_email_count`, `remaining_in_plan`.

### 5. Confirm the draft (assert, then summarize)
`get_campaign` → **assert `status == 0`**. If it isn't Draft, warn loudly and do NOT offer launch.
Then show the review summary: campaign name · N leads attached (with the skip/dup accounting) ·
sequence preview · schedule · sending domains · daily limit. **Present the sequence as an inbox-style
preview**, email 1 as it lands in the prospect's inbox (from/to/subject/body, variables shown resolved
with sample data), not raw JSON; the JSON stays the internal contract, and the preview is rendered FROM
it so the two can't drift (see `references/conversation.md`). Then state plainly: **"Created as a
DRAFT. Nothing sends until you approve launch (Step 5)."**

### 6. Post-create edits
User tweaks copy/schedule/limit → `update_campaign`. **Confirm-gated (D-002):** show the exact field
diff and get an explicit yes, unless auto mode `campaign_edits` is on (D-014), in which case apply
without the prompt but still show the diff applied.

## Errors + edge cases
- **No connected accounts** → stop: the user must connect senders in Instantly first (link); can't assemble.
- **Sequence JSON invalid** (missing subject/variants) → bounce back to the writer (Step 3); don't "fix" silently.
- **Timezone unmappable** → ask the user to pick from the enum; never guess.
- **`remaining_in_plan` exhausted** → report the shortfall + options (fewer leads / upgrade link, growth touchpoint); high `in_blocklist`/`duplicated_leads` → show the accounting, ask before proceeding.
- **`create_campaign` 400** (closed schema) → surface `message`, fix the payload, retry; **402** → paid-plan + upgrade link; **404 on list** → state was lost, re-lookup via `list_lead_lists`.
- **Draft assert fails** (`status != 0`) → warn; do NOT proceed to the launch offer.
- **Uploaded < verified count** → explain via the response fields (blocklist/dupes/invalid), don't hand-wave.

## Guardrail
Draft-first is both structural (status is read-only → always Draft on create) AND asserted here.
There is no `activate` call anywhere in this step, launching is Step 5, behind the confirm.
