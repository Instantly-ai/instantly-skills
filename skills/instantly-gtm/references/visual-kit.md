# Reference: Visual kit ("render, don't recite")

The base rule: **when a step produces a bounded result, render it as a visual, don't recite it as prose.**
Leads, a campaign, analytics, a sequence, a draft, a launch, a DFY order, a capacity check, all of it has
a card/metric/chart form. This file is the single source for that vocabulary so every step and sub-skill
looks like one product. It is the layer over the loop; `conversation.md` sets the voice, this sets the
shapes.

## When to render vs. fall back
**Try UI first, and prefer inline + interactive.** Walk this ladder, top down, use the highest tier the
host supports:
1. **Inline + interactive (best).** If the host has a capability that renders HTML/SVG **inline in the
   chat** AND lets a control send a message back to the conversation (a `sendPrompt`-style callback), use
   it. Render the card inline and wire its buttons to send the exact next message ("place it", "edit",
   "wait for pre-warmed"). A button click then IS an explicit user action the confirm gate accepts.
2. **Inline, static.** If it renders inline but has no callback, render inline anyway; treat buttons as
   decorative and drive the choice by the user's typed reply.
3. **Published artifact / link (last resort).** Only if there's no inline path. **Never make the user
   open a link to see or act, ** put the full info + the choices in the chat text too.
4. **Plain text.** No render capability → clean markdown (a tight table). Never emit raw HTML into a
   terminal, and never paste markup into chat as if it were rendering.

**Confirm is always available in text.** A confirm-gated action (place order, launch, send, spend) runs
only on an explicit user action, a typed reply OR a control that sends an explicit message. Buttons are
never the ONLY path; always state the text option ("or just reply: place it / edit"). A dead button is
never the gate.

**Never leak design internals into chat.** Do not print design plans, hex/tokens, CSS, or
tool/framework names, and do not narrate "let me render / choosing colors". Render silently, then give a
one-line human summary of what's on the card. The chat stays about the outcome, not the styling.

Rendering is **presentation only**. It never adds a verb, never sends, never spends; it shows the loop's
data and never invents values to fill a card (render what's present, omit the rest).

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
  sending domains); a DFY order shows domains · mailboxes · provider · billed-monthly. Its buttons send the
  choice as a chat message where the host supports a callback ("place it" / "edit"); always also show the
  text option ("or just reply place it"). It **gates on the explicit yes** (typed reply or a
  message-sending control), never a dead button, and never auto-proceeds.
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
