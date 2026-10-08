# Offer packet review (frozen JSON)

Use when comparing 3 to 6 concepts of an offer (headline, supporting line, story outline, funnel terms) before building any of them. The packet makes the review independent and auditable.

## Why a frozen packet

Panels get primed when agents inherit the conversation, see the lead's favourite, or read the options in the same order. The packet prevents that:

- **Identical input.** Every persona gets the same immutable `input.json`.
- **Hash recorded.** The packet's SHA-256 goes into `results.json` as `inputSha256`, so anyone can confirm what was reviewed.
- **Rotated order.** Each persona sees the variants in a different order (rotate by one per persona).
- **Fresh agents.** None of them sees owner preference, source prestige, the lead's recommendation or each other.

```bash
shasum -a 256 input.json
```

## input.json

Skeleton in `templates/input.json`. Fields:

| Field | Content |
|---|---|
| `version` | e.g. `round2-input-v1` |
| `purpose` | What is being evaluated and the success verb. Include "simulated critique, not actual market evidence." |
| `instructions` | The review rules, verbatim to every persona. |
| `commonOffer` | Terms shared by every variant: price, what is included, what costs extra, optional add-ons, what is not yet shipped, honest comparisons. |
| `specificContents` | Concrete contents (templates, bonuses, modules) so personas judge real things, not adjectives. |
| `variants[]` | `id`, `headline`, `supportingLine`, `storyHeadings[]`, `alternateHeadline`. |

Instruction text worth reusing:

```
Judge these exact drafts and the full planned funnel. This is a prebuild concept review: do not reject solely because the draft is not yet shipped. Missing demonstration or terms may still affect trust. Do not assume unmentioned capabilities. Do not seek other reviewers or source research. All variants share the same product.
```

## Persona output (one JSON file per persona)

```json
{
  "personaId": "P1",
  "persona": "Simulated response from ... (first-person card)",
  "ranking": [{ "id": "V3", "rank": 1, "reason": "..." }],
  "preferredHeadline": { "variantId": "V3", "choice": "headline | alternateHeadline", "text": "...", "reason": "..." },
  "objections": [{ "element": "exact quoted element", "objection": "...", "consequence": "what I do next" }],
  "expectedCore": "what I expect the base purchase to give me",
  "upgradeNecessity": "which add-ons I think I would be forced into, and why",
  "nextAction": "...",
  "abandonmentPoint": "the exact place I stop",
  "dealbreaker": "one sentence"
}
```

`objections[].consequence` is what makes this format useful: every objection comes with the behaviour it causes ("[I hesitate before paying and look for X. If it is absent, I close the page.]").

## results.json (the lead's synthesis)

Skeleton in `templates/results.json`. Key parts:

- `evaluated`, `icp` (with "given" or "assumed" and any sample bias, e.g. "the panel favours existing customers"), `method`, `inputSha256`.
- `recommendation`: title and reason. If there is no single winner, say so ("[V3] and [V4] each placed first twice; there is no single winner").
- `recommendedCopy[]`: each with `audience`, `headline`, `deck`, and a `status` that says whether this exact text was reviewed or is a post-review suggestion that has not been re-evaluated.
- `preferences[]`: each persona's ranking string and preferred line.
- `tally[]`: `objection`, `personas[]`, `decision`, and **`evidence[]` pointers** such as `"P1 objections 1,4"`, so every count can be traced to the transcripts.
- `changes[]`: `element`, `fix`, `status`.
- `abandonment[]`: `personaId`, `point`.
- `risk`: what this sample cannot tell you.
- **`interpretationChecks[]`**: where personas misread the packet, and how the lead treated it. Shape: "[P2] expects [X] despite the packet stating [Y]. Retain as [kind of objection], not evidence that [X] was promised." And: "Requests for [features] do not create new product promises. They identify questions to demonstrate or specify."

## Rules

- Rank complete concepts, not isolated headlines, unless that is the question.
- Retain uncertain expectations as expectations; do not convert them into requirements.
- No take rates for upgrades can be inferred from five simulated passes. Say so in `risk`.
- A combined or rewritten line that nobody reviewed is labelled as such.
