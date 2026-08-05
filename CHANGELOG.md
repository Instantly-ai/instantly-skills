# Changelog

What changed in the Instantly GTM skill, in plain language. Newest first. When you re-run the installer
(`bootstrap.sh`) you get the latest; check here for what moved. Update all version markers together:
this file, `skills/instantly-gtm/skill.json`, the `version:` in `skills/instantly-gtm/SKILL.md`, and
`VERSION` in `core/instantly.mjs` (shown by `doctor`).

## 1.1.0 — 2026-07-31
- **Scale senders (new step).** Check if you have enough warmed inboxes, and buy pre-warmed Done-For-You
  mailboxes/domains from Instantly, in chat. It simulates the order first and places it only after you
  confirm; it never handles your payment.
- **Browser key setup.** Connect your key on a page in your browser (`setup --web`) instead of the
  terminal. The key goes browser → your machine; Claude never sees it.
- **Remove/rotate your key** with one command: `auth.mjs disconnect`.
- **Better copy.** The sequence writer opens with an observation about the reader, avoids AI-slop
  patterns, offers you other angles, and learns your voice from your edits.
- **Visuals in the chat.** Reports and decisions render inline (a chart or decision cards) where your
  Claude supports it, and clean Markdown everywhere else, never a side-panel file.
- **Skills fire more reliably.** Rewrote the triggers so a real request ("my emails are going to spam",
  "get me more senders", "reply to this") reaches the right skill.
- **Clearer install.** A "which Claude do I need?" note up front (Claude Code / Desktop, not the website).

## 1.0.0
- Initial release: the cold-email outbound loop on Instantly, run by talking to Claude — find leads,
  write a sequence, launch a campaign, triage replies, check performance. Guardrails: draft-first,
  non-skippable verify, confirmed launch, cold-domain refusal, spend gated.
