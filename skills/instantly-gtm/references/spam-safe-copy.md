# Reference: Spam-safe copy (always-on QA for every line)

Goal: keep copy out of the spam folder. Apply this to EVERY subject, opener, follow-up, and CTA, 
automatically during Step 3 (writer self-check) and again at Step 5 (launch preflight). When a line
trips a rule, offer the lower-hype rewrite; the user can approve an exception for the session.

## 0. Hard blocklist (owner-authoritative: never ship these; D-034)
Match WHOLE-WORD, case-insensitive, judged on the ROOT (the close-variant rule below applies). Not naive
substring: don't flag "ad" inside "already", "cash" inside "cashflow", "deal" inside "dealing". A few
listed words are common in normal writing (`ad`, `cash`, `deal`, `offer`, `trial`, `quote`, `income`,
`investment`, `rates`, `score`), flag and rewrite with judgment, don't blind-replace. When a term is
genuinely the right word, note the session exception (see §4).

- **No em dashes (—).** Use a period, comma, or "and". Em dashes read as AI-written. (Also enforced in
  `conversation.md`.) No bot-phrasing filler either ("it's worth noting", "in today's landscape").
- **Exaggerated claims/promises:** #1, 100% more, 100% free, 100% satisfied, additional income, be your own
  boss, best price, big bucks, billion, cash bonus, cents on the dollar, consolidate debt, double your
  cash, double your income, earn extra cash, earn money, eliminate bad credit, extra cash, extra income,
  expect to earn, fast cash, financial freedom, free access, free consultation, free gift, free hosting,
  free info, free investment, free membership, free money, free preview, free quote, free trial, full
  refund, get out of debt, get paid, giveaway, guaranteed, increase sales, increase traffic, incredible
  deal, lower rates, lowest price, make money, million dollars, miracle, money back, once in a lifetime,
  one time, pennies a day, potential earnings, prize, promise, pure profit, risk-free, satisfaction
  guaranteed, save big money, save up to, special promotion.
- **Urgency/pressure:** act now, apply now, become a member, call now, click below, click here, get it now,
  do it today, don't delete, exclusive deal, get started now, important information regarding, information
  you requested, instant, limited time, new customers only, order now, please read, see for yourself, sign
  up free, take action, this won't last, urgent, what are you waiting for?, while supplies last, will not
  believe your eyes, winner, winning, you are a winner, you have been selected.
- **Shady/spammy/unethical:** bulk email, buy direct, cancel at any time, check or money order,
  congratulations, confidentiality, cures, dear friend, direct email, direct marketing, hidden charges,
  human growth hormone, internet marketing, lose weight, mass email, meet singles, multi-level marketing,
  no catch, no cost, no credit check, no fees, no gimmick, no hidden costs, no hidden fees, no interest, no
  investment, no obligation, no purchase necessary, no questions asked, no strings attached, not junk,
  notspam, obligation, passwords, requires initial investment, social security number, this isn't a scam,
  this isn't junk, this isn't spam, undisclosed, unsecured credit, unsecured debt, unsolicited, valium,
  viagra, vicodin, we hate spam, weight loss, xanax.
- **Jargon/legalese/other:** accept credit cards, ad, all new, as seen on, bargain, beneficiary, billing,
  bonus, cards accepted, cash, certified, cheap, claims, clearance, compare rates, credit card offers,
  deal, debt, discount, fantastic, in accordance with laws, income, investment, join millions, lifetime,
  loans, luxury, marketing solution, message contains, mortgage rates, name brand, offer, online
  marketing, opt in, pre-approved, quote, rates, refinance, removal, reserves the right, score, search
  engine, sent in compliance, subject to, terms and conditions, trial, unlimited, warranty, web traffic,
  work from home.

## 1. Hype & "salesy" language (soften or cut)
Cold email lands when it reads like a person, not a promotion. Flag words/phrases that pattern-match
marketing blasts and rewrite plainer:

- Money/urgency: *free, guarantee(d), risk-free, act now, limited time, offer expires, last chance,
  don't miss, hurry*, urgency phrasing like *"buy instantly" / "instant access"*, currency-and-number
  hype (*save $X, +300%*), *cheap, discount, deal*.
- Hype adjectives / superlatives: *amazing, incredible, revolutionary, game-changer, world-class,
  cutting-edge, best-in-class, unlock, supercharge, skyrocket, 10x*.
- Blast-y CTAs: *buy now, sign up today, click here, order now, apply now*.
- Trust-me filler: *dear friend, this is not spam, 100%, as seen on, congratulations, you've been selected*.

**Close-variant rule:** hyphens, spaces, punctuation, or creative spelling do NOT launder a trigger.
`F-R-E-E`, `free!!`, `gu@rantee`, `act-now` all still count. Judge the root word, not the styling.

## 2. Formatting red flags
- ALL-CAPS words or subjects; Title Case Shouting.
- Excess punctuation: `!!!`, `???`, `$$$`, trailing `!!`.
- Emoji in subject lines (fine sparingly in body if it's the user's voice, see `tone.md`).
- Fake-reply subjects (`RE:` / `FWD:` when there was no prior thread), deceptive, hurts trust + deliverability.
- Link-heavy or image-only bodies; **no links or images in the first email** (pairs with the
  deliverability rules); tracking-pixel-only sends read as marketing.
- Broken merge tags: an unresolved `{{firstName}}` renders literally and screams "mass send", 
  the writer self-check already verifies every variable resolves; this is the deliverability reason why.

## 3. Structure (reinforces deliverability.md)
- Plain-text feel; one clear idea; a single soft CTA.
- Include a genuine unsubscribe / opt-out path and a real sender identity (name + company + address
  in the signature, set on the sending accounts).
- Keep subjects short and curiosity-plain (a lowercase, specific subject beats a shouty one).

## 4. The default: prefer the lower-hype rewrite
When unsure, choose the plainer wording. Examples (pattern, not a script):
- "🚀 UNLOCK 3x MORE MEETINGS, FREE trial!!" → "a quick idea for booking more meetings"
- "Act now, limited spots!" → "worth a look if you're planning Q3 outbound?"
- "I guarantee results" → "happy to show you what worked for <similar company>"

## 5. Pattern-level kill list (ban the category, not just the phrase)
A phrase blocklist gets paraphrased around (ban "tips" and it ships "the 3 things I spotted"). So kill
these PATTERNS wherever they appear, however they're worded. Rewrite direction, not just deletion:
- **Tease-and-offer** — offering to send/share something you "found / noticed / spotted / put together"
  (any noun, any count). → Make the observation itself the value; if there's a real asset, offer it on a
  later touch (the CTA ladder in `sequence-playbook.md`), never email 1.
- **Passive closes** — "no pressure if it's not relevant", "if that's helpful", "just thought I'd reach
  out". → End on a real question the reader can answer in one line.
- **Opening with tactical advice** — dispensing tips in email 1. → Open with an observation about them
  (the observation test in the sequence-writer module).
- **Product stats too early** — any metric/claim about your product before the reader has engaged.
  → Email 1 is about their world, not your numbers; hold proof to a later touch.
- **Naming a competitor** as bait or comparison. → Describe the situation, not the rival.
- **Claiming a specific company is a customer** you can't verify / name-dropping a logo. → Generic peer
  framing only ("teams running their own outbound", never "we work with <Named Co>").

## How it's applied
- **Step 3:** the sequence-writer runs this (phrase + pattern lists) as part of its pre-handoff
  self-check; flagged lines are rewritten before the draft is shown.
- **Step 5:** a final scan at launch preflight; anything hype-y surfaces in the confirm summary.
- **Exceptions:** if the user insists a flagged word is on-brand, note the approved exception for the
  session and stop flagging it. Judgment over dogma, the goal is inbox placement, not word-policing.

> Note: this list is Instantly's own, built from general deliverability practice; refine the specific
> words at implement time against current norms. It is not exhaustive, when copy *feels* like an ad,
> it probably reads like one to a spam filter too.
