<!-- STARTER TEMPLATE. Trigger/signal-based opener (use when Step 1 targeted a news/signals filter).
     Sign off with {{sender_first_name}}; never a static name. No em dashes. -->

# Trigger-based, open on the signal

```json
{
  "steps": [
    { "type": "email", "delay": 3, "delay_unit": "days",
      "variants": [ { "subject": "{{companyName}} + <the trigger>",
        "body": "Hi {{firstName}},\n\nSaw {{companyName}} <the actual trigger: funding / hiring / launch / news>. Usually that means <the outcome/pain it creates>. We help with exactly that: <one line>. Worth a quick look?\n\n{{sender_first_name}}" } ] },
    { "type": "email", "delay": 4, "delay_unit": "days",
      "variants": [ { "subject": "",
        "body": "Following up on the {{companyName}} note. <proof point relevant to the trigger>. Want the details?" } ] },
    { "type": "email", "delay": 0, "delay_unit": "days",
      "variants": [ { "subject": "",
        "body": "Should I close the loop, {{firstName}}?" } ] }
  ]
}
```
