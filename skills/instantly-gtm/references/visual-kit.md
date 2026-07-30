# Reference: Visual kit ("render, don't recite")

The base rule: **when a step produces a bounded result, render it as a visual, don't recite it as prose.**
Leads, a campaign, analytics, a sequence, a draft, a launch, a DFY order, a capacity check, all of it has
a card/metric/chart form. This file is the single source for that vocabulary so every step and sub-skill
looks like one product. It is the layer over the loop; `conversation.md` sets the voice, this sets the
shapes.

## Render INSIDE the chat message. Markdown first.
The visual must appear in the chat, not in a side panel the user has to open. Key fact: Claude routes
self-contained content over ~15 lines to the **Artifacts side panel**, so a big HTML card always leaves
the chat; Claude Code (terminal) can't render HTML at all. The thing that reliably renders **in the
message on every host is Markdown**. So:
1. **Rich inline Markdown (default, always).** Build the card from Markdown: a titled table, a metric
   row, a `▓▓▓░░` unicode bar, status as **bold**/`[label]`. Keep it tight (a small table + a few lines,
   well under ~15) so it stays inline and never trips artifact routing.
2. **Mermaid** for a funnel/diagram **only where the host renders it inline**; otherwise use the Markdown
   funnel (it degrades to a code block if not rendered, so don't rely on it).
3. **Genuine in-message interactive widget** (optional top tier) **only if** the host has a capability
   that renders in the message itself (not a side panel) and can send a message back (`sendPrompt`-style),
   then buttons may send the choice. Its absence means Markdown, never an artifact.
4. **Plain text** if even Markdown tables aren't supported.

**Never auto-create a standalone / published artifact for these cards** (leads, capacity, DFY
simulation/confirm, analytics, launch), and never invoke an artifact-creation path for them. An artifact
opens off to the side, that is the exact failure we're avoiding. Artifacts are allowed ONLY when the user
explicitly asks for a shareable, standalone page, never as the default for an ephemeral card.

**Confirm is always available in text.** A confirm-gated action (place order, launch, send, spend) runs
only on an explicit user action, a typed reply OR a control that sends an explicit message. Buttons are
never the ONLY path; always state the text option ("or just reply: place it / edit"). A dead button is
never the gate.

**Never leak design internals into chat.** Do not print design plans, hex/tokens, CSS, or
tool/framework names, and do not narrate "let me render / choosing colors". Render silently, then give a
one-line human summary of what's on the card. The chat stays about the outcome, not the styling.

Rendering is **presentation only**. It never adds a verb, never sends, never spends; it shows the loop's
data and never invents values to fill a card (render what's present, omit the rest).

## The components (as Markdown primitives, compose from these)
- **Result card** — a bounded object (leads found, a campaign, a DFY preview). A bold title line with the
  status (e.g. `**Leads found** · Preview, no credits spent`) then a small table of the fields. Not a
  100-line HTML block.
- **Metric row** — the number that matters first: `**1,240** matches` on its own line, secondary numbers
  as a short table or ` · `-separated row. Lead with the number.
- **Funnel** — Markdown bars with a unicode meter, one per line, value at the end, e.g.
  `Sent    ▓▓▓▓▓▓▓▓▓▓ 2,000` / `Replied ▓▓ 208`. Headline is positive-reply rate (see `analytics.md`).
  Mermaid only where the host renders it inline.
- **List rows** — leads / domains / replies as a Markdown table or `- ` list: primary + secondary + a
  right-hand meta. Long lists show a **bounded sample + "+ N more"**, never thousands of rows.
- **Status label** — inline text, not a graphic: `**Live**`, `**Draft**`, `Preview, no credits spent`,
  `Simulation, not placed`, `Under capacity`, `Refused, cold domain`.
- **Confirm card** — the gate, made legible in Markdown. Launch shows the four parts (N leads · sequence ·
  daily ramp · sending domains); a DFY order shows domains · mailboxes · provider · billed-monthly. Then
  the choices as text: `Reply **place it** to confirm, **edit** to change, or **wait for pre-warmed**.`
  It **gates on the explicit yes** (a typed reply, or an in-message control that sends it), never a dead
  button, and never auto-proceeds.
- **Suggestion callout** — one next action as a plain line ("Suggested: cut step 3, it's where replies
  stall. Want me to draft that?"). Analytics/infra **suggest**, they never act.
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

## Design tokens (ONLY for a genuine in-message HTML widget, not the default)
The default is Markdown, which has no styling, so these tokens do NOT apply to it. Use them only in the
optional tier-3 case: a host capability that truly renders HTML in the message. Never emit a styled HTML
page as an artifact for a card. Honor the brand fingerprint (full detail in the `instantly-ui` skill):
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
