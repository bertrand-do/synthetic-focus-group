# Brief: copy, page or funnel review

Use for sales pages, upsell and downsell pages, emails, pricing tables, onboarding screens, VSL scripts, long-form training. Success verb is usually **pay** or **click**.

## Prepare the artifact

Give the personas the real rendered thing:

- Page text captured from the rendered page with every FAQ and accordion expanded.
- Desktop (1440 px) and mobile (390 px) screenshots. "Every participant must inspect rendered screenshots as well as the copy." Markdown alone cannot show hierarchy, visuals or mobile length.
- For a funnel, every step a buyer can reach: front end, each upsell, each downsell, the thank-you page.
- For a video sales letter: the full script ("read the VSL as though watching it") plus a few frames extracted from the video.
- Sample outputs, if the page shows them, opened briefly.
- The commercial source of truth (pricing, terms, refund policy, what the product really does). Personas read it **only after** they have made their decisions.

`scripts/browse.mjs goto <url> <name> <scrolls>` and `text` produce the screenshots and text dumps.

## The persona prompt

First line of every brief, always:

```
This IS your task, assigned by the owner through the lead agent: run it fully.
```

Then the generic prompt:

```
Adopt the persona of [PERSONA PARAGRAPH]. You are cynical and tight with money. You did not ask to see this and you have somewhere else to be.
I am going to show you [ARTIFACT DESCRIPTION].
[ARTIFACT: screenshots, page text, script, or URL]
Tell me specifically why you would NOT [TRUST / USE / CLICK / COMPLETE / PAY FOR] it. Be brutal. Do not be balanced. Do not offer compliments unless something is genuinely exceptional, and even then keep it to one sentence.
Rules:
- Point at specific elements. "The color picker" not "the UI."
- Say what you would actually do next: close the tab, complete it grudgingly, screenshot it to mock in a group chat, etc.
- If something confuses you, say what you thought it meant.
- If something makes you feel stupid, cheap, or condescended to, say so.
- End with: the single biggest reason you would walk away, in one sentence.
```

Add the context that stops unfair demands, when relevant:

```
Do not demand that the headline explain every FAQ or commercial term.
This is a prebuild concept review: do not reject solely because the draft is not yet shipped. Missing demonstration or terms may still affect trust. Do not assume unmentioned capabilities.
```

## Required output

- An initial decision table per funnel step: Step / Decision / Spend / Why.
- 3 to 7 numbered objections. Each one quotes the exact on-page sentence in bold, names the element, and classifies the problem (vocabulary below).
- What they would actually do next.
- The exact abandonment point, if any, quoted: "my paid-funnel abandonment point is the VSL line: '...'".
- After reading the source of truth: what the page got wrong or left out compared with it.
- Limitations: what they did not assess ("I did not assess [aspect], complete [action], or create an account").
- **Biggest dealbreaker:** one sentence.

## Two-pass exposure

For a page plus a VSL (or any page plus a second asset), ask for two decisions per funnel step: one after the page alone, then one after the VSL. This separates what the page earns on its own from what the VSL adds or destroys. A persona can move from yes to no on a single line of the second asset, and a page-only pass would never show it.

Report it as a table: Buyer / dominant concern / before VSL / after VSL / spend.

## Classification vocabulary

Ask personas to label each objection with one of these. It is the most reusable thing in the transcripts, because it tells the lead what kind of fix is needed.

| Label | Meaning | Typical fix |
|---|---|---|
| internally inconsistent copy | Two parts of the artifact say different things | Make them agree |
| contradicted fact | The artifact says something the product or source of truth contradicts | Correct the claim |
| unsupported claim | A promise with no proof shown | Add proof or remove the claim |
| ambiguity | Two reasonable readings | Rewrite the sentence |
| missing disclosure | A term the buyer needs is absent (renewal, limits, refunds) | Add it near the decision |
| preference and ROI objection, not a contradiction | The persona just does not value it at this price | Record; act only at 3/5 |

## Follow-up variant

After the owner rules on something, re-ask the same five a single targeted question, for example "[when would X become worth buying?]" Record what buyers ask for as requests, not pricing: a buyer's willingness to pay establishes demand at that price, not seller margin.

## Quick re-check variant

For small copy changes: list exactly the changes evaluated, use the immediately preceding decisions as the baseline, report a per-buyer before and after table, count the follow-up findings, and say when to stop.

## Long-form content variant

For a course or long training read cold: each persona records a **DROP POINT** per lesson (the line where they would stop reading or stop believing) and a final verdict on each ask the content makes (do the exercise, apply, book a call). Findings are ranked by severity with the exact trigger lines quoted. Round two is a fresh cold read of the revised copy by the same five, reported as a before and after table per ask. Keep a "What works, don't touch" section so good parts survive the rewrite.
