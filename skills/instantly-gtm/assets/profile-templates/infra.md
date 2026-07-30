# Sending infrastructure

How this user sets up sending accounts, so recommendations reuse their pattern instead of re-asking.
Learned at first use and updated from their edits. Persisted via `save-profile.mjs`.

- **Provider:** <Google | AirMail | Microsoft/Outlook — default Google>
- **Mailbox naming pattern:** <how mailboxes are named. Common first/last-name combinations:
  first-name `john@` · last-name `smith@` · first+last `johnsmith@` · first.last `john.smith@` ·
  f.last `j.smith@` · firstL `johns@` · or a role style `hello@`, `sales@`. Store the PATTERN, not one
  address.>
- **Domains you use:** <the domain(s) the user already sends from / owns; used to seed look-alike
  suggestions so new domains match the brand>
- **Domain root / pattern (optional):** <e.g. brand word + try/get/use, ".com then .co">
- **Forwarding domain:** <optional domain to forward to; must differ from the sending domain>
- **Notes:** <anything else about their sending setup>

<!-- Capacity rule of thumb: a warmed mailbox safely sends ~30/day. Google/AirMail hold up to 5 mailboxes
per domain; Microsoft/Outlook is 50 per new domain. Used to size how many domains/mailboxes to suggest. -->
