# Reference: Visual kit ("render, don't recite")

The base rule: **when a step produces a bounded result, render it as a visual, don't recite it as prose.**
Leads, a campaign, analytics, a sequence, a draft, a launch, a DFY order, a capacity check, all of it has
a card/metric/chart form. This file is the single source for that vocabulary so every step and sub-skill
looks like one product. It is the layer over the loop; `conversation.md` sets the voice, this sets the
shapes.

## Render IN the chat message. Inline widget where available, else Markdown + Mermaid. Never a file.
The visual must appear inside the conversation, never in a side panel. Layered, use the highest tier the
host offers:
1. **Inline visual widget (best, e.g. claude.ai).** If an inline visual-widget capability exists (streams
   an HTML/SVG fragment into the message, the `visualize:show_widget` tool after a one-time
   `visualize:read_me`), use it for **reports** (a Chart.js chart + metric strip) and **decision cards**
   (a card grid whose buttons call `sendPrompt(...)`). Follow `references/inline-visuals.md` for the hard
   rules. HTML lives INSIDE the widget fragment, that's the intended path, not a file.
2. **Markdown + Mermaid (fallback, always works).** No widget tool (API / Claude Code terminal / other
   host) → a Markdown card (bold title + status, small table, `▓▓▓░░` bar, `- ` lists) + a ` ```mermaid `
   funnel where the host renders it. This is the reliable floor.

**Never create a FILE or side-panel artifact for a card** — no `.html`/`.jsx`, no artifact-creation path,
not for leads, DFY, launch, capacity, a sequence draft, or a report. A renderable file goes to the side
panel by design (the exact bug); a sequence rendered as an `.html` draft is the recurring one. The
**sequence draft stays Markdown** (it's copy, not a chart/card). An artifact is acceptable ONLY when the
user explicitly asks for a downloadable/shareable dashboard.

**Confirm is an explicit user action.** A confirm-gated verb (place order, launch, send, spend) runs only
after either a **`sendPrompt` button** (it sends the instruction as a user message) OR a **typed reply**
("place it"). Always also state the typed option for no-widget hosts. A dead card is never the gate.

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
  It **gates on the explicit typed yes** and never auto-proceeds.
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
Same as everywhere: dry operator, sentence case, no em dashes, no "!", no emoji/dingbats (the
`conversation.md` HARD STOP applies to copy). In a Markdown card the polish is structure, headings,
**bold** labels, tables, a `▓▓▓░░` bar. In a widget, the polish is the host CSS variables (see
`inline-visuals.md`), never hardcoded colors.

## HTML belongs in a widget, never in a file
HTML is fine INSIDE an inline visual widget (`show_widget` fragment, per `inline-visuals.md`). What's
banned is emitting HTML **as a file / artifact** for a card, that's what side-panels it. If there's no
widget tool, render Markdown + Mermaid, do NOT write an `.html`/`.jsx` file to compensate. Rule of thumb:
if you're about to create a file for a visual, stop, either use the inline widget or render Markdown.
