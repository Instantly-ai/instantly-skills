# Reference: Visual kit ("render, don't recite")

The base rule: **when a step produces a bounded result, render it as a visual, don't recite it as prose.**
Leads, a campaign, analytics, a sequence, a draft, a launch, a DFY order, a capacity check, all of it has
a card/metric/chart form. This file is the single source for that vocabulary so every step and sub-skill
looks like one product. It is the layer over the loop; `conversation.md` sets the voice, this sets the
shapes.

## When to render vs. fall back
- **Render** when the host surface supports rich output (an artifact / HTML / canvas / widget /
  elicitation, e.g. Claude Desktop, claude.ai). Produce the visual with the tokens below.
- **Fall back** to clean markdown (a tight table or the plain 5-move map) on a bare terminal. **Never emit
  raw HTML into a plain terminal**, and never paste markup into chat as if it were rendering, that's noise.
- **Unsure?** Offer "want this as a visual?" rather than dumping markup.
- Rendering is **presentation only**. It never adds a verb, never sends, never spends. It shows the loop's
  data; it never invents values to fill a card (render what's present, omit the rest).

## The components (compose from these, don't reinvent)
- **Result card** — a bounded object (leads found, a campaign, a DFY preview). White surface, hairline
  border, 12px radius; header = icon + title + a status pill; then the body.
- **Metric hero + tiles** — the number that matters, big (30px/500) with a muted label above; secondary
  numbers as small tiles on the sunken surface. Data leads.
- **Funnel bars** — labeled horizontal bars (sent → opened → replied → positive → booked), widths
  proportional, value right-aligned. The analytics headline is positive-reply rate (see `analytics.md`).
- **List rows** — leads / domains / replies: an avatar (initials) or line icon + primary/secondary text +
  a right-aligned meta. Long lists show a **bounded sample + "+ N more"**, never thousands of rows.
- **Status pill** — Live (success), Draft (ink-dark), Preview / Simulation (accent), Under capacity
  (warning), Refused / cold domain (danger).
- **Confirm card** — the gate, made legible. Launch shows the four parts (N leads · sequence · daily ramp ·
  sending domains); a DFY order shows domains · mailboxes · provider · billed-monthly. A primary action +
  the "confirm once more" microcopy. It **gates on the explicit yes**, it never auto-proceeds.
- **Suggestion callout** — accent-tinted, one next action ("try cutting step 3, want me to draft it?").
  Analytics/infra **suggest**, they never act.
- **Empty / error state** — the human reason + the next action (SPEC §8), never a raw dump.

## Guardrail-visible states (the visual shows the gate, never hides it)
- **Preview** (leads before enrich) → "Preview, no credits spent".
- **Simulation** (DFY order before placing) → "Simulation, not placed".
- **Confirm required** (launch, send, spend, place order) → the confirm card; the confirm-gated verb runs
  only after the user's yes.
- **Cold domain** → the refusal state, plainly. The visual makes the stop obvious; it does not offer a way
  around it.
- **Secrets** are never rendered. Connection shows workspace + last-4 only.

## Voice inside a visual
Same as everywhere: dry operator, sentence case, no em dashes, no "!". **Icon boundary:** thin line icons
(the Instantly/lucide style) are UI design elements and are fine inside a rendered component. The
emoji/dingbat HARD STOP (✅⬜✓ etc.) in `conversation.md` is about **email and chat text copy**, not UI
iconography. Don't put decorative emoji in copy; do use a clean line icon in a card header.

## Design tokens (Instantly language, reuse verbatim)
Honor the brand fingerprint (full detail in the `instantly-ui` skill). Drop these into any rendered page:
```css
--brand:#006bff; --brand-soft:rgba(0,107,255,.12); --brand-active:#eef4ff;
--success:#2eca8b; --danger:#e43f52; --warning:#ffc107;
--ink:#202942; --ink-body:#3c4858; --ink-muted:#8492a6; --ink-faint:#adb5bd;
--surface:#fff; --sunken:#f8f9fc; --border:#e9ecef; --border-strong:#dee2e6;
/* type: Averta -> fallback ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; 500 for headings/numbers/buttons */
/* radius: cards 12px, controls/inputs 8px, pills 9999px */
/* the identifiable action: solid brand fill + 1px same-color border + 0 3px 5px rgba(0,107,255,.3) glow */
```
Rules that keep it on-brand: borders over shadows, generous whitespace, one primary (brand) action per
card, color = meaning (blue interactive, green positive, red attention, yellow upgrade/new, grey neutral).
On a viewer with light/dark theming, keep text legible in both; when in doubt, prefer the light-first
values above and let labels/contrast carry meaning.
