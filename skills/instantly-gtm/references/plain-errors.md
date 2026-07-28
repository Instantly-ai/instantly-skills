# Reference: Plain-language errors (what broke → what it means → what next)

Goal: a non-technical user should never see a raw status code. Every failure becomes one plain line of
cause + the next action, in the dry-operator voice (`references/conversation.md`). Never echo the API
key. Growth links (402/credits/cold senders) are surfaced ONCE, as a link, never a purchase call (D-017).

The CLI already maps HTTP codes to a short message; this reference is how you SAY it to the user.

## HTTP / API layer (from `core/instantly.mjs` error map)
| Raw | Say to the user | Next action |
|---|---|---|
| **401** unauthorized | "Your Instantly key isn't working, it may have been rotated or revoked." | Re-run key setup (`auth.mjs setup --web`); the skill never handles the key itself. |
| **402** payment required | "This needs an active paid plan, sending, enrichment and verification are locked without it." | Link `app.instantly.ai/settings/billing`, once. Don't retry. |
| **403** forbidden | "Your key doesn't have permission for that." | Re-issue the key with the scopes onboarding lists. |
| **404** not found | "I couldn't find that <campaign / list>." | Look it up by name (`list_campaigns`/`list_lead_lists`) and re-confirm which one. |
| **429** rate limited | "Instantly's asking me to slow down for a moment." | Back off (100/s, 6k/min; replies 20/min), retry after the wait. Never retry-storm. |
| **400** bad request | "That request wasn't valid, usually a filter value or a missing field." | Read the message; fix the specific field (e.g. a closed enum) and retry once. |
| **network / timeout** | "I couldn't reach Instantly just now." | Check connection; retry once; if it persists, it's likely their side. |
| **unknown / unlisted** | "That didn't go through. Here's the raw reason: <message>." | Give the safe next step; never silently swallow, surface it and stop. |

## Specific gotchas worth a human line
- **Out of verification credits** (a 402/credit-limit at enrich/verify) → "You're out of verification
  credits, so I can't check the rest of the list. Top up here → `app.instantly.ai/settings/billing` and
  I'll finish it." (Credit balance isn't a live verb; surface it when the API returns the limit, not before.)
- **Zero-result search that's actually a bad filter value** → a closed enum typo returns 0 with no
  error (see `icp-to-search.md`). If a search is unexpectedly empty, suspect an enum value before widening.
- **Date-window error** ("Start Date must be earlier than End Date") → fix the window, retry once.

## Launch / sending blockers
These come from `sending_status.diagnostics.status`, not an HTTP code. The human mapping already lives
in `references/deliverability.md` (the `diagnostics.status` table), use it. Headline the common ones
plainly: `no_accounts_available` → "no sending inbox is attached yet"; `all_accounts_unhealthy` /
`campaign_accounts_unhealthy` → "your inboxes aren't healthy enough to send, warm or fix them first"
(this is cold-domain refusal territory, guardrail 4, explain the block, don't offer a proceed).

## Rules
- One cause + one next action. No stack of codes.
- Never print/echo the API key (last-4 only, and only if confirming identity).
- A limit (402/credits/cold senders) gets the app link once; the skill never transacts.
- An error never softens a guardrail: a blocked launch stays blocked; you explain why in plain words.
