<!-- STARTER TEMPLATE. 4-step value ladder (problem, proof, new angle, breakup).
     Sign off with {{sender_first_name}}; never a static name. No em dashes. -->

# Value ladder, 4 steps

```json
{
  "steps": [
    { "type": "email", "delay": 3, "delay_unit": "days",
      "variants": [ { "subject": "<persona pain in 4-6 words>",
        "body": "Hi {{firstName}},\n\n<name the pain this persona feels>. Curious how {{companyName}} handles it today?\n\n{{sender_first_name}}" } ] },
    { "type": "email", "delay": 4, "delay_unit": "days",
      "variants": [ { "subject": "",
        "body": "<similar company> had the same problem. <specific result>. Happy to share how." } ] },
    { "type": "email", "delay": 4, "delay_unit": "days",
      "variants": [ { "subject": "",
        "body": "<reframe: a different angle or a free resource/teardown offer>." } ] },
    { "type": "email", "delay": 0, "delay_unit": "days",
      "variants": [ { "subject": "",
        "body": "Last note from me, {{firstName}}. Want me to send it over or should I close the loop?" } ] }
  ]
}
```
