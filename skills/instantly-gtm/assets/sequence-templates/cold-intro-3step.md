<!-- STARTER TEMPLATE. 3-step intro, bump, breakup. Copy the JSON, replace the copy with the user's
     real offer/voice, keep the shape. The orchestrator places `steps` at sequences[0]. Sign off with
     {{sender_first_name}} (Instantly fills it per sending mailbox); never a static name. No em dashes. -->

# Cold intro, 3 steps (intro, bump, breakup)

```json
{
  "steps": [
    {
      "type": "email",
      "delay": 3,
      "delay_unit": "days",
      "variants": [
        {
          "subject": "quick question about {{companyName}}",
          "body": "Hi {{firstName}},\n\n<one relevant reason you're reaching out: a signal, or a role-pain>. We helped <similar company> <concrete result>.\n\nWorth a quick look?\n\n{{sender_first_name}}"
        }
      ]
    },
    {
      "type": "email",
      "delay": 4,
      "delay_unit": "days",
      "variants": [
        {
          "subject": "",
          "body": "Following the note above, {{firstName}}. <new angle or proof point>. Happy to send the 1-pager. Want it?"
        }
      ]
    },
    {
      "type": "email",
      "delay": 0,
      "delay_unit": "days",
      "variants": [
        {
          "subject": "",
          "body": "Should I close the loop on this, {{firstName}}? No worries if the timing's off."
        }
      ]
    }
  ]
}
```
