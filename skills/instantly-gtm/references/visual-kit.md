# Reference: Visual kit ("render, don't recite")

The base rule: **when a step produces a bounded result, render it as a visual, don't recite it as prose.**
Leads, a campaign, analytics, a sequence, a draft, a launch, a DFY order, a capacity check, all of it has
a card/metric/chart form. This file is the single source for that vocabulary so every step and sub-skill
looks like one product. It is the layer over the loop; `conversation.md` sets the voice, this sets the
shapes.

## The visual is Markdown, with Mermaid for diagrams. No HTML, no artifacts.
The visual must appear IN the chat message, on every host (including the Claude Code terminal). Two paths,
nothing else:
1. **Markdown (default, always).** Build the card from Markdown: a bold title + status, a small table of
   the fields, a `▓▓▓░░` unicode bar, `- ` lists. Renders everywhere.
2. **Mermaid** (a ` ```mermaid ` fenced block) for a funnel / flow / diagram, where the host renders it
   inline. ALWAYS pair it with the Markdown version (a `▓▓▓░░` bar funnel), because some hosts show
   mermaid as a code block.

**Never emit HTML, and never create an artifact / published page / `.html` file for a visual** — not for
leads, DFY, launch, capacity, a sequence draft, OR a report. Claude routes self-contained HTML (over ~15
lines) to the side panel, the exact failure we're avoiding, and a sequence rendered as an `.html` file is
the recurring bug. **Reports are no exception:** they render as stylized Markdown + a Mermaid funnel,
inline. (An artifact is acceptable ONLY if the user explicitly asks for a standalone/shareable page, never
as the default.)

**Confirm is always available in text.** A confirm-gated action (place order, launch, send, spend) runs
only on an explicit **typed reply** ("place it", "launch it"). State the choices as text
("reply place it to confirm, or edit to change"). There are no buttons, the visual is Markdown.

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
`conversation.md` HARD STOP applies here too). The polish comes from clean Markdown structure, headings,
**bold** labels, tables, a `▓▓▓░░` bar, blockquotes, not from styling.

## No HTML, no CSS
There is no styling layer. Markdown + Mermaid only. The brand shows through clear structure and plain
labels, not colors or fonts. If you ever feel the urge to write `<div>`/`<style>` or open an artifact for
a card, stop, that's the bug; render Markdown instead.
