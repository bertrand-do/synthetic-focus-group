# Persona cards

Build personas only from the ICP the user confirmed in Step 0 (`icp-intake.md`).

## The base avatar

Write the avatar in one dense paragraph. Include only attributes that would actually change how they react: age, job and years of experience, income and how they feel about money, what they fear, what they want, what they have already tried and been burned by, cultural leaning only if it matters to this purchase, tech comfort, and how much time they have.

Vague avatars produce vague, agreeable feedback. Specific avatars produce the useful irrational rejections.

Fill-in template:

> The core avatar is a [age range] [role] who [what they do and for whom]. They have [N years] of [relevant buying or working experience], [what they already tried and how it disappointed them], and [how much time they have to adopt something new]. Budgets range from [low] to [high] [per month / one-off]; [a second number that matters, e.g. clients, team size, volume] ranges from [low] to [high]. [Any attribute that clearly does not matter for this purchase, stated so the panel ignores it.]

State the source: "ICP confirmed by the owner on [date]".

## The five forks

Each fork keeps the core ICP and adds one dominant trait that shapes how they read the artifact.

| # | Persona | Dominant trait | What they attack |
|---|---|---|---|
| 1 | The Busy One | No time, scanning on a phone between other work | Anything that takes more than 5 seconds to understand. Friction, length, unclear next step. |
| 2 | The Skeptic | Burned by tools, courses and "gurus" before | Claims without proof, hype words, anything that smells like a funnel. |
| 3 | The Broke One | Every dollar is scrutinised, someone else asks questions | Price, hidden costs, renewals, ROI math, "what if this doesn't work". |
| 4 | The Tech-Averse One | Competent professional who resents learning new software | Jargon, too many fields, unfamiliar UI patterns, anything that seems to need a tutorial. |
| 5 | The Design Snob | Years of taste, judges everything by its craft | Typography, spacing, colour, hierarchy, inconsistency, anything that looks like a template. Will dismiss the whole thing over one ugly detail. |

### Swap list

Swap one fork when the artifact calls for it. Always keep five.

- **Industry Insider** instead of the Design Snob when the artifact is a text-only draft and typography cannot be judged. Attacks wrong numbers, wrong vocabulary, naive claims about the industry.
- **Quality Pro** for a product whose output is creative work. Attacks output quality, artefacts, anything a client would reject.
- **Practical Operator** for workflow tools. Attacks the number of steps between signup and a usable result, and what breaks at volume.
- **Compliance Worrier** for anything touching client data, payments or regulated industries.
- **Loyal Competitor User** for a switching pitch. Attacks "why move", migration cost, missing features they rely on.

## Writing a persona

First person, with numbers. Each card must give the agent enough to decide, at every step, "would I spend this money and this time?"

```
**[Name], [age] ([fork]).** I [job] for [N] years. I [how I buy in this category, how long, what I recognise].
I have [amount] in [tools or services that disappointed me] behind me, because [why they failed me].
I can spend about [amount] [this month / once]. [Who questions my purchases] will ask [their question].
I judge this by [the one measure I care about]. [What decides whether I spend it.]
```

What makes a card work: a number for budget, a number for experience, a specific past burn, a person who will question the purchase, and the one measure they will judge by. Use invented names; never base a card on a real, identifiable person.

Keep each card in its own file (`personas/[name].md`) so a returning persona can be pointed at its own card and nothing else.

## Real-buyer-modelled panel (optional)

When a skeptic panel rejects everything, a second panel modelled loosely on real buyers (from application-form answers or survey data, with the user's permission) can show whether the rejection is about the product or about the panel. Keep it synthetic and say so: "synthetic, loosely based on [source], not the real customers themselves". Never use real names or impersonate real people. Panel composition decides the answer, so report the audience next to the result.

## JSON card schema (scored headline mode)

For the scored headline panel, use 12 cards, 3 per audience segment, so per-segment scores can be compared.

```json
{
  "id": "[segment code + number, e.g. s1a]",
  "segment": "[segment code]",
  "name": "[invented name]",
  "scepticism": "[low | medium | high]",
  "situation": "[age], [role], [years] in [field]. [The concrete situation that makes this product relevant or irrelevant to them.]",
  "currently_uses": "[tools or workaround they use today]",
  "frustration": "[the pain, in their own words]",
  "bs_detector": "[what makes them roll their eyes and close the tab]"
}
```

Field rules:

- `situation` holds age, job, years, and the concrete situation that makes the product relevant or irrelevant.
- `currently_uses` is what the product must displace or join.
- `frustration` is the pain in their words. If you have real voice-of-customer quotes, build it from them.
- `bs_detector` is the trigger that makes them close the tab. Every card needs one.
- Mix `scepticism` across low, medium and high inside each segment.
