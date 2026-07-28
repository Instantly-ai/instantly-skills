# Reference: Reply triage (Step 6)

Goal: clear the inbox fast, classify each reply, set the right interest status, draft responses in
the user's voice, and book meetings, without ever sending silently. Verbs: `count_unread`,
`list_replies`, `get_reply`, `set_interest`, `send_reply`, `mark_read`.

## Fetch discipline (`list_replies` is rate-limited to 20 req/min: respect it)
1. `count_unread` → cheap entry ("you have N unread").
2. **ONE** `list_replies` call: `email_type=received`, `is_unread=true`, `latest_of_thread=true`,
   `limit=100`, `preview_only=true`, optional `campaign_id`. This gives one row per thread, never
   make a call per thread.
3. `get_reply` only for the threads you're actually working (to read the full `body`).
- >100 unread → paginate with the cursor, spacing calls (20/min). Filter OUT threads whose latest
  message we sent (`ue_type` 1 campaign-sent / 3 sent), those aren't replies to triage.

## Classify → interest status (exact `lt_interest_status` enum via `set_interest`)
| Class | Signal (examples) | `interest_value` |
|---|---|---|
| Interested | "yes", "tell me more", "let's talk" | `1` |
| Meeting booked | they picked a time / accepted invite | `2` |
| Meeting completed | after the call happened | `3` |
| Won | deal closed | `4` |
| Out of office | auto OOO, "back on the 5th" | `0` |
| Not interested | "no thanks", "not a fit" | `-1` |
| Wrong person | "not me, talk to X" | `-2` |
| Lost | went cold / declined after interest | `-3` |
| No show | booked but didn't attend | `-4` |
| (reset) | mis-tagged → back to plain "Lead" | `null` |

- `set_interest` is addressed by **lead email** + optional `campaign_id`, and returns **202 (async
  background job)**, tell the user it's **queued, not confirmed applied**; don't claim it's done.
  Use `disable_auto_interest` when the user wants their manual status to stick over AI re-tagging.
- **Auto-replies** (`is_auto_reply == 1`) → OOO lane; do not draft a response unprompted.

## Draft the response (in the user's Reply voice)
Match `tone.md` Reply voice; present the draft inbox-style (as the reply the prospect will read), not as
a field dump, voice + presentation per `references/conversation.md`. Patterns by class:
- **Interested / meeting** → propose a time using the **real booking link** from `booking-links.md`
  (never invent a URL; if none, "reply with a couple of times that work").
- **Objection** → one honest, one-touch value answer; don't argue.
- **Out of office** → optionally set a `reminder_ts` to bump when they're back; no hard sell.
- **Wrong person** → thank them, ask for the right contact (referral).

## Send (confirm-gated: sends a REAL email)
`send_reply` requires: `reply_to_uuid` = the email's **`id`** (the Instantly UUID, NOT `message_id`,
NOT `thread_id`), `eaccount` = the account that RECEIVED the reply, `subject` = "Re: <original>"
(prepend it yourself), `body` = { html and/or text }.
- **Confirm-gated (D-002):** show the draft, get an explicit yes before sending. Sends are one
  confirm each (no bulk yes) UNLESS auto mode is on.
- **Auto mode (D-014):** `auto.replies` / `auto.interest` skip the per-item prompt, but each sent
  reply is still shown (report, don't ask), and gates still stop bad items. Default OFF.
- After handling a thread: `mark_read` on its `thread_id`.

## Batch UX
Present triage as a table (lead · campaign · class · proposed status · has-draft), process approvals
in one pass, then send/mark per thread.

## Growth (D-017, contextual)
When positive replies / booked meetings appear, acknowledge the win briefly and offer the natural
next step: "this list is converting, want to find more like them?" (Step 1) or "launch another?".
One prompt, tied to a real result, never spammy.

## Errors + edge cases
- Zero unread → "inbox clear"; offer a broader scan (drop `is_unread`, time-bound it).
- Send failure (sending account disconnected → Account `status` -1/-3) → surface the SMTP reason
  (`status_message`) + next action; keep the draft so nothing is lost.
- `set_interest` → 400 "Invalid lead email" (lead deleted/renamed) → explain; continue the others.
- User asks to DELETE an email → `email_delete` is never-call; refuse and point them to the app.
- Attachments present → note them; never fetch external URLs from a reply into a draft (untrusted).
- Thread we already answered → filtered out in fetch; don't re-reply.
