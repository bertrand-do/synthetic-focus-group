# Headline scoring

Two ways to test headlines. Both run as Claude subagents, so they cost no API spend beyond the session.

- **Vote mode:** five personas, a shortlist of headline and subheadline pairs, Click / Hesitate / Skip plus a top 5. Good for a final choice between a few strong options.
- **Scored comprehension panel:** one agent plays 12 personas across 3 to 4 segments, scores every pair on understanding and click intent. Good for ranking many candidates and finding what readers misread.

## Before either: hard filters

Cheap, deterministic, applied before any persona sees a pair:

- Headline 10 words or fewer; subheadline 35 words or fewer.
- No dashes, no exclamation marks, no hype words.
- No money or ROI claims you cannot prove, no client names.
- Any house rules for the brand.

Archive the exact pairs verbatim (`candidates.md`) and include the live hero as a control.

## Vote mode

Each of the five personas, in its own agent, gets every pair and returns:

- For each pair: **Click / Hesitate / Skip**, with a one-line reason.
- A ranked top 5.
- Objections and abandonment points, tied to exact words.

Add to the brief: "Do not demand that the headline explain every FAQ or commercial term." Any rewrite a persona proposes is labelled **untested**.

Tally first choice and top-5 inclusion separately. Keep the panel's winner and the lead's own audience judgment as two separate recommendations: a line can win with a panel that already has clients and still be wrong for a broad page. Write the audience constraint next to the winner, for example "all five personas already [have X]; this is a material audience constraint."

Be honest about contamination in the method: if agents inherited the lead's earlier preferences, or the pair order was not randomised, say so.

## Scored comprehension panel (subagent version)

### Inputs

- 12 persona cards, 3 per segment (`persona-cards.md` has the schema). Build them from real voice-of-customer quotes when you have them.
- The candidate pairs (headline + subheadline).
- A one-paragraph **ground truth**: what the product is, who it is for, what it does. The scorer judges understanding against it.

### What each persona does, per pair

Two judgments, in this order, for every persona and every pair, each pair shown alone and in random order:

1. **Headline alone.** "What is it, and who is it for?" Answered in one sentence each.
2. **Headline + subheadline.** The same question again, plus **click intent from 1 to 10** and a one-line gut reaction.

The persona framing for each judgment:

```
You are <name>. <situation>
What you use today: <currently_uses>
Your #1 frustration: <frustration>
Your BS detector: <bs_detector>

Stay fully in character. You did not ask to see this page and you have somewhere else to be. React honestly, not politely.

You clicked a link and landed on a homepage. This is the hero, the only thing you read before deciding whether to scroll or leave. You give it about 5 seconds.
```

Click scale guidance: "1 = close the tab, 5 = shrug, 8 = genuinely interested, 10 = rare, exactly what you were looking for. Most homepages you see earn 4 to 6. Use the full scale."

### Comprehension scoring

Score each answer strictly against the ground truth, without looking at the copy, only at what the reader understood:

- **WHAT, 0 to 2:** 2 = names the right category and job; 1 = partly right (a neighbouring category, or right category but wrong job); 0 = wrong or too vague to be useful ("some AI tool", "a marketing platform", "not sure").
- **WHO, 0 to 2:** 2 = the right audience; 1 = close but too broad or a neighbouring audience; 0 = wrong.

Judge substance, not wording. Comprehension for a judgment = (WHAT + WHO) / 4, as a share of the maximum.

### The formula

```
Combined = 0.5 × (mean click / 10)
         + 0.25 × headline-alone comprehension
         + 0.25 × with-subhead comprehension
```

All three terms are on a 0 to 1 scale, so Combined is 0 to 1. Also report per-segment comprehension, and the most common misreading for each pair.

### Noise and ties

One model plays twelve people, so **treat gaps under about 0.03 as ties**. When the top few sit inside that band, report them as a statistical tie and say so.

A known effect: subheadlines that open with the same category sentence equalise with-subhead comprehension, so headline-alone comprehension and click intent decide the ranking.

### Rounds (optional hill-climb)

1. Round 0: score the full candidate set plus controls.
2. Each later round: keep the top 15, rewrite them to answer their stated objections and most common misreadings, add fresh mutations and a few wildcards, and rescore the new pairs plus the kept top 15 with fresh judgments (pool scores across rounds).
3. Stop when a pair reaches the target score with high comprehension in every segment, or the top 3 holds for two rounds, or after about 6 rounds, or at the budget.

## Present

- The top 4 to 6 with Combined score, click, both comprehension numbers, the most common misreading, and two or three verbatim reactions.
- One recommendation, with its audience constraint.
- The owner picks. The panel's ranking is an input, not a decision. Picking a lower-ranked line and fixing its most common misreading in the subheadline is an acceptable outcome.
