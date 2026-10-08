# Report templates

Every report shares the same spine (`templates/report.md`). Below are the mode-specific additions, with wording that worked.

## Shared opening

```
# <Artifact> focus group, <date>

Evaluated <what, exactly>. Success verb: **<verb>**. Each persona ran independently on <model>, <how they accessed the artifact>.

**<Two-sentence headline outcome.>**

ICP (confirmed in Step 0): <one line>. These are simulated customer reactions <backed by actual app use>, not human testimony or a conversion forecast.
```

Good headline outcomes are concrete: "[N] buyers reached a finished [deliverable]. [N] hit the same [failure] at [step]." Not: "Mixed results with some friction."

## Copy / funnel review

1. Opening.
2. Base avatar paragraph.
3. Decision table: Buyer / dominant concern / after first asset / after second asset / spend.
4. Objection tally: Objection / Buyers / Count / Verdict.
5. **Changes to make, in order.** Each item has the exact current sentence, why it fails (with the count), and a suggested replacement sentence. No vague "improve clarity".
6. Abandonment points, quoted.
7. Risks carried forward.
8. Evidence corrections and transcripts: where the lead overruled a persona's interpretation.
9. Links to transcripts and the primary artifacts reviewed.

## Live app walk-through

1. Opening, with the build tested.
2. Objection tally. Note above it: "Counts reflect the participants' objections, not every technical fact found afterward. Setup failures and tool limitations are excluded from product-defect counts."
3. A short paragraph on how their reactions differed (who would refund, who would keep going, who stopped at delivery).
4. **Changes to make**, each with measured evidence: "[Persona A], [B] and [C] all hit [failure]; all three records contain the same error, caused by [measured input] exceeding [limit]. [Fix: check this before starting work that cannot complete.]"
5. Abandonment table: Buyer / exact stop / what they would do next.
6. Risks carried forward and the untested list.
7. Buyer transcripts and verified outcomes: Scenario / actual work / final balances / transcript link.
8. Costs: logged provider estimates for the test itself, labelled as estimates, not invoices.

## All-pages sweep

1. Opening with status ("five-person sweep complete; final fixes published").
2. Participants and decisions: Buyer / existing purchase / decision / natural stop.
3. What nobody did: purchases, paid generations, sends, deletions, key creation.
4. Route coverage matrix with the C/P/G/U legend and the sentence "Complete means the rendered route/action was exercised within the stated boundary. It does not mean every downstream system passed."
5. Normalised tally.
6. Repair delta (for a retest).
7. Unresolved risks.

## Fix coverage map

`templates/fix-coverage.md`: Baseline issue / Implemented response / Verification, one row for every finding, then "Problems discovered during the retest". Verification names the evidence: a regression test with the exact failing inputs, a scripted browser check, a deployed HTTP status, a participant observation.

## Retest delta

Add to the app or sweep report:

- Repair delta: Earlier failure / Retest result / Remaining limit.
- Build table per session, if fixes landed between sessions.
- Scores now versus baseline, per persona.
- "This retest does not erase the earlier failures or replace their original transcripts."

## Quick follow-up

Short:

1. Changes evaluated (exact list).
2. Baseline: the immediately preceding decisions.
3. Result table: Buyer / previous version / this version.
4. Follow-up findings, counted.
5. Stop recommendation, if it is time: "Stop this copy pass here. Another simulated rewrite is unlikely to answer this persona's evidence requirement. Gather actual output and customer-response evidence next."

## Headline panel

Top 4 to 6: Pair / Combined / click / headline-alone comprehension / with-subhead comprehension / most common misreading / verbatim reactions. Then the tie band (gaps under 0.03), the audience constraint, and one recommendation. The owner picks.

## Transcripts

Save each persona reply verbatim as `<name>.md`. The only addition allowed is a "Lead review note" at the top when a fact was corrected. In HTML reports, put transcripts in collapsible sections so the reader can audit the reasoning without scrolling past it.
