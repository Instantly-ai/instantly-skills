# Reference: Inline visuals (the Visualizer) — reports + decision cards, in the chat

Use this to render **inline, in the conversation** (not a side-panel file). The mechanism is an inline
visual-widget capability that streams an HTML/SVG fragment into the message, in the Claude app it's the
`visualize:show_widget` tool (with a one-time `visualize:read_me`). Buttons inside a widget call a global
`sendPrompt(text)` that sends a message **as if the user typed it**, that is how a card's button drives the
next step / a confirm-gated verb.

**When to use which**
- **Report pulled / "how's my campaign?" / compare** → an inline **chart widget** (metric strip + Chart.js).
- **Decision moment** (scale / pause / test, launch confirm, DFY simulate→place) → an inline **card grid**
  with `sendPrompt()` buttons.
- **Sequence draft** → NOT a widget; it's copy, keep it stylized Markdown.
- **No widget tool available** (API / Claude Code terminal / other host) → **Markdown + Mermaid fallback**
  (`visual-kit.md`). Never create a file/artifact to compensate.
- **Never create a file / `.html` / `.jsx` / side-panel artifact** for these. An artifact is fine ONLY if
  the user explicitly wants a downloadable/shareable dashboard.

## The sequence (what to actually do)
1. **Once per conversation, before the first widget:** silently call `visualize:read_me` with
   `modules: ["chart","interactive"]` (add `"mockup"` for record cards). Never narrate this call.
2. **Reports:** one `show_widget` = a metric-card strip (2–4 KPIs) + a custom HTML legend + a Chart.js chart.
3. **Decisions:** one `show_widget` = a card grid; each card has a status pill, a Tabler outline icon, a
   1–2 line rationale, and a `<button onclick="sendPrompt('...')">Verb ↗</button>`. Accent exactly one
   **Recommended** card.
4. **Prose lives in the chat, outside the widget.** Never stack two widgets back-to-back, put a sentence
   of context between them. Data tables go in the prose as Markdown, never inside the widget.

## Fragment + streaming rules (hard)
- HTML **fragment** only: no `<!DOCTYPE>/<html>/<head>/<body>`. Order: short `<style>` → content →
  `<script>` last. Prefer inline `style="..."`. Library `<script src>` BEFORE the inline script using it.
- No `position: fixed`, no nested scroll, no HTML/CSS comments, no `display:none`/tabs (breaks streaming).
- Container ~680px, transparent background. Scripts run after streaming completes.
- CDN allowlist (CSP): `cdnjs.cloudflare.com`, `esm.sh`, `cdn.jsdelivr.net`, `unpkg.com`,
  `fonts.googleapis.com`, `fonts.gstatic.com`. Anything else silently fails.

## Theming (dark mode is mandatory)
- HTML text/surfaces/borders via **host CSS variables**, never raw hex:
  text `--text-primary/-secondary/-muted` + role `--text-{accent,danger,success,warning}`;
  surfaces `--surface-2` (white card) / `--surface-1` (tinted) / `--surface-0`, role `--bg-{role}`;
  borders `--border` (0.5px), `--border-strong`, `--border-{role}`; `--radius` (8px), 12px for cards.
- **Text on a colored pill** = the matching role pair (`--bg-accent` + `--text-accent`), never black.
- **Exception:** `<canvas>` can't resolve CSS vars → Chart.js dataset colors are hardcoded hex (use the
  Instantly palette below). Read chrome colors at runtime if needed:
  `getComputedStyle(document.documentElement).getPropertyValue('--text-muted')`.

## Chart.js constraints
- `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js` (UMD global).
- Canvas in `<div style="position:relative;height:NNNpx">` (height on the wrapper only);
  `responsive:true, maintainAspectRatio:false`. Horizontal bars: wrapper height ≥ bars×40 + 80.
- Every canvas: `role="img"` + descriptive `aria-label` + fallback text between the tags.
- Disable the default legend; build a small custom HTML legend above the chart.
- **One y-axis, ever** (dual-axis banned → two charts). Round every displayed number.
- Distinguish series by **color AND** dash/marker shape, never color alone.

## sendPrompt discipline
- Use it only for actions that benefit from Claude thinking (drill-down, scale, draft variants). Do
  filtering/sorting/math in plain JS inside the widget.
- The string is a **complete, self-contained instruction with the entity name baked in** (it arrives as a
  fresh user message, no other context), e.g.
  `sendPrompt('Pause the {campaign} campaign and diagnose the reply-rate drop')`.
- A `sendPrompt` button is a valid **explicit user action** for a confirm-gated step (place order, launch):
  clicking it sends the instruction, then the skill runs the verb with `--confirm`. Always also state the
  typed-reply option ("or reply: place it") for no-widget hosts. A dead card is never the gate.

## Accessibility + voice
- First element: `<h2 class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);">one-sentence summary</h2>`.
- `aria-hidden="true"` on decorative icons; `aria-label` on icon-only buttons.
- Two font weights (400/500), sentence case, no emoji. Tabler **outline** icons only (`ti ti-...`, never
  `-filled`). Flat: no gradients/shadows/blur (matches Instantly's borders-over-shadows). Buttons/inputs
  are pre-styled, write bare tags; sendPrompt buttons end with ` ↗`.

## Instantly brand merge (× the Visualizer constraints)
- **Chart dataset colors** (canvas can't use vars): Instantly hexes — brand `#006bff`, success `#2eca8b`,
  danger `#e43f52`, warning `#ffc107`, muted `#8492a6`. Keep "one hue + gray for emphasis".
- **HTML text/surfaces/borders**: stay on host CSS variables (dark-mode-safe). Do NOT hardcode Instantly's
  ink ramp (`#202942`…) for text.
- **Transfers cleanly:** pills for status, one primary action per view, hierarchy by weight (500) not size,
  12px card radius, restraint. **Drop inside widgets:** Averta (host font wins) and the soft shadow glow.

## Report recipes
| Report | Form |
|---|---|
| Single campaign health | metric strip (sent / opens / replies / meetings) + reply-rate line |
| Campaign comparison | metric strip + multi-line or grouped horizontal bars (≤8 series, then "Other") |
| Step / sequence performance | horizontal bar per step (height = steps×40 + 80) |
| Deliverability | status colors + a meter, never a 2-slice pie |
| One headline number | a stat tile, not a one-bar chart |
| Full drill-down "give me everything" | a side-panel artifact instead (the one artifact case) |

## Decision-card prompt templates
- Scale: `sendPrompt('Scale the {campaign} campaign: plan added sending accounts and a safe daily ramp')`
- Pause: `sendPrompt('Pause the {campaign} campaign and diagnose {symptom}')`
- Test:  `sendPrompt('Write 3 A/B variants for the {campaign} {element}')`
- DFY place: `sendPrompt('Place the DFY order I just simulated: {domains}, {provider}, {mailboxes}/domain')`
- Drill-down under a chart: `sendPrompt('Break down {campaign} replies by sequence step')`

## Skeletons
Chart widget:
```html
<h2 class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);">SUMMARY</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem;">
  <div style="background:var(--surface-1);border-radius:var(--radius);padding:1rem;">
    <p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Reply rate</p>
    <p style="font-size:24px;font-weight:500;margin:0;">4.7%</p></div>
</div>
<div style="position:relative;width:100%;height:280px;">
  <canvas id="c1" role="img" aria-label="DESCRIBE THE CHART">FALLBACK TEXT</canvas></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script>
const muted=getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()||'#8492a6';
new Chart(document.getElementById('c1'),{type:'line',
  data:{labels:[],datasets:[{label:'Campaign A',data:[],borderColor:'#006bff',borderWidth:2,pointRadius:4,tension:.3}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
    scales:{y:{ticks:{color:muted,callback:v=>v+'%'},grid:{color:'rgba(132,146,166,0.18)'}},
            x:{ticks:{color:muted,autoSkip:false},grid:{display:false}}}}});
</script>
```
Decision card:
```html
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;padding:.5rem 0;">
  <div style="background:var(--surface-2);border:2px solid var(--border-accent);border-radius:12px;padding:1rem 1.25rem;display:flex;flex-direction:column;gap:10px;">
    <span style="align-self:flex-start;background:var(--bg-accent);color:var(--text-accent);font-size:12px;padding:4px 12px;border-radius:var(--radius);">Recommended</span>
    <div style="display:flex;align-items:center;gap:8px;"><i class="ti ti-trending-up" style="font-size:20px;color:var(--text-accent);" aria-hidden="true"></i><p style="font-weight:500;font-size:15px;margin:0;">TITLE</p></div>
    <p style="font-size:13px;color:var(--text-secondary);margin:0;line-height:1.5;">RATIONALE</p>
    <button style="margin-top:auto;" onclick="sendPrompt('COMPLETE SELF-CONTAINED INSTRUCTION')">Verb ↗</button></div>
</div>
```

## Gotchas
- Call `read_me` before the first widget; skipping it degrades output.
- `ti-*-filled` icons render blank, outline only. Hardcoded text hex (`#202942`, `#333`) vanishes in dark mode.
- Widgets are ephemeral (not files). If the user wants to keep/share, offer a real artifact instead.
- The skill can't force the tool call, it biases strongly. If a visual is genuinely dashboard-scale
  (multi-tab/stateful), that legitimately wants an artifact; single report/decision = inline.
