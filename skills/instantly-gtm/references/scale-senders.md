# Reference: Scale senders (sending infrastructure, DFY)

Goal: let the user grow sending capacity without leaving chat, do everything outbound from here. Check
what they have, size the gap, and (if they want) buy pre-configured mailboxes from Instantly. Guardrails
that **confirm, never block**: simulate first, one clear confirm, then place. Render everything with
`references/visual-kit.md` (capacity card, simulation card, confirm card).

## 0. Just show me my infra (read-only, no order)
If the user only wants to see what they have ("show my sending accounts", "how many inboxes do I have",
"list my DFY orders"), run the reads and render, no simulation, no confirm, no spend:
`list_accounts` (connected senders), `dfy_list_orders` (their DFY orders), `dfy_list_ordered_accounts`
(mailboxes from those orders), and `warmup_analytics` for health when there is at least one account.
Render a plain infra/inventory view; only move into a capacity check or an order if they ask.

## 0b. Deliverability diagnosis + honest routing (read-only)
- **Reached from check-performance** for a deliverability cause (spam / not landing / low inbox rate):
  read `warmup_analytics` + `test_vitals` and `references/deliverability.md`, and report the sender health
  plainly. Offer DFY pre-warmed senders **only if the senders are actually the problem** (cold/unwarmed/
  unhealthy). If the health is fine and the issue is copy or targeting, say so and route to the sequence
  writer, do NOT push more senders (that's the funnel-y misfire we avoid).
- **"Connect my own mailbox / add my existing inbox":** this skill only BUYS pre-warmed DFY senders; it
  can't connect the user's own account. Point them to the Instantly app (Settings → connect account),
  don't steer them into a DFY purchase.
- **"Warm up my domain":** warmup runs automatically on connected/DFY accounts; there's no manual warm
  action here. Show warmup health (above) and, if a domain is cold, that's when new pre-warmed senders help.

## 1. Capacity check (read-only)
- Count current senders: `list_accounts`. **If it returns zero accounts, warmed = 0, stop there, do NOT
  call `warmup_analytics`** (its body needs at least one email, so an empty call 400s). Otherwise check
  which are warm/healthy: `warmup_analytics` (and `test_vitals` if needed). A warmed mailbox safely sends
  ~30/day (real range 20–50; use 30 to be safe).
- Target daily volume comes from the plan: leads ÷ sending days. `mailboxes_needed = ceil(target/day ÷ 30)`.
- Gap = `mailboxes_needed − warmed_mailboxes`. Render the capacity card (have vs need, % covered). If
  there's no gap, say so and move on, don't upsell.

## 2. When to bring this up (tasteful, D-017/D-040)
Only on a real trigger: the user is under capacity for what they're launching, hit the cold-domain refusal
(guardrail 4), or asked ("do I have enough inboxes?", "I need more mailboxes"). Surface it **once per
session**, never interrupt a working flow, and never block: if they'd rather send with what they have,
let them.

## 3. The infra persona (`infra.md`) — ASK first, never invent
Load `~/.instantly-gtm/profile/infra.md` if present and reuse it silently (don't re-ask). **If it's
missing or incomplete, ASK the user before you build a simulation, do not fabricate a persona.** Two
quick questions:
1. **How do you want mailboxes named?** Offer the common first/last-name combinations so they just pick:
   `john@`, `jsmith@`, `john.smith@`, `j.smith@`, `johns@` (or a role style like `hello@`). Capture the
   pattern, not one address.
2. **Which domain(s) do you already use?** These seed the look-alike suggestions in §4 so new domains
   match their brand.
3. **Pre-warmed or fresh domains?** Pre-warmed are ready to send now (skip the 2–3 week warmup) but come
   and go from stock; fresh domains are always available but need warmup. Ask their preference; if they
   want pre-warmed and none are in stock, say so and offer fresh.
Also capture provider (Google default) and an optional forwarding domain. Confirm briefly, persist via
`save-profile.mjs`, and reuse next time (ask once, D-019). If the user would rather not specify, use a
sensible default (first-name mailboxes; seed similars from their website domain if known) and tell them
what you assumed, still don't invent silently.

## 4. Simulate the order (read-only, nothing bought)
Build a grounded recommendation from the persona and their §3 pre-warmed/fresh preference:
- `dfy_prewarmed_domains` — in-stock pre-warmed domains (skip the 2–3 week warmup). Empty list is normal,
  not an error; if they wanted pre-warmed and there are none, say so and offer fresh.
- `dfy_similar_domains` (`{domain, tlds}`) — seed it from the **domain(s) the user gave in §3** (their
  real brand), so suggestions look like theirs; fall back to their website/brand root only if none given.
- `dfy_check_domains` (`{domains:[…]}`) — only show/offer domains that come back **available**.
- Build the mailboxes from the §3 naming pattern (e.g. first-name → `john@`, `sarah@`).
- Mailbox math (from the API, don't guess): **Google / AirMail = up to 5 mailboxes per domain** (billed
  per mailbox monthly); **Microsoft/Outlook = 50 per new domain** (billed per domain monthly). So for a
  Google plan, `domains = ceil(added_mailboxes ÷ 5)`.
Render the **simulation card** inline (per `references/visual-kit.md` → `inline-visuals.md`: a decision
card with a `sendPrompt` "place it" button where a widget tool exists, else Markdown + typed reply):
domains, mailboxes, provider, new capacity, clearly marked "Simulation, not placed". Nothing is bought
here. Always offer the choices in text too ("reply place it / edit / wait for pre-warmed"), never rely on
a button, and never make the user open a link to act. **Preflight (say it here, before they confirm):**
placing needs an Outreach plan + a payment method on file; if there isn't one, they'll add it in the
Instantly app first, so a place attempt won't dead-end at a 402.

## 5. Confirm → place (the one gate)
`dfy_place_order` is **confirm-gated and has no auto-mode** (spend always confirms, like `enrich`). Show
the confirm card (mirrors the launch confirm): domains · mailboxes · provider · billed monthly · uses your
Instantly payment method. Place only after an explicit user action, a typed "place it" OR a card button
that sends that message; a dead button is never the yes. Then run:
`dfy_place_order --confirm --params '{"items":[{"domain":"…","email_provider":1,"forwarding_domain":"…","accounts":[…]}]}'`
(`email_provider`: 1 Google, 2 AirMail, 3 Microsoft/Outlook; `accounts` = the mailbox usernames from the
persona's naming pattern; `forwarding_domain` optional). Report what was placed and that it's billed
monthly (D-017 spend transparency).

## 6. The payment guardrail (owned by Instantly, don't reinvent it)
Placing an order requires an Outreach plan + a payment method on file. **The skill never enters or handles
payment details.** If the order comes back needing a plan/payment method (402 / precondition), surface the
in-app link to add one and let the user continue there, that's the money gate, and it's Instantly's.
Route the user forward; don't dead-end and don't block the rest of the session.

## Errors + edge cases
| Case | Handling |
|------|----------|
| No gap | Say capacity is fine; don't upsell. |
| `dfy_prewarmed_domains` empty | Normal (documented). Say "none in stock right now"; use fresh available domains. Don't retry-spam. |
| Domain unavailable | `dfy_check_domains` gates it; only confirm available domains. |
| No payment method / no Outreach plan | Surface the add-payment / upgrade link; never enter payment details; don't block. |
| User edits the order | Re-simulate (reads only); never carry a stale confirm forward. |
| Place without an explicit yes | CLI refuses (`dfy_place_order` needs `--confirm`; no auto-mode toggle exists). |
| Cancel / refund | `dfy_orders_cancel` stays never-call; direct the user to the Instantly app. |
| 401 / 429 / network | Standard `instantly.mjs` error map (human reason + next action). |

## Guardrails (this sub-skill)
Simulate-first; one explicit confirm before any spend; no auto-mode for placing; the skill never touches
payment; `dfy_orders_cancel` stays banned; suggestions are tasteful and once-per-session; spend is
reported. Everything else in the loop (draft-first, verify, confirmed launch, cold-domain refusal,
analytics-only-suggests) is unchanged. For the full loop use `/instantly-gtm`.
