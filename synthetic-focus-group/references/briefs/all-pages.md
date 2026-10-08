# Brief: all-pages sweep

Use when the question is "does every page a buyer can reach actually work for them?" Success verb: **use** every page available under the buyer's purchase. Usually run with returning personas who already have accounts and history.

## Step 1: the lead writes the page inventory

Before any persona runs, the lead lists every route from the source code (`templates/page-inventory.md`):

| Page / route | Actions requiring rendered verification | Access |
|---|---|---|
| [Page name] `[route]` | [actions to exercise, e.g. counts, records, navigation, reload] | [which personas] |
| ... | ... | ... |

Head it with: "This is the checklist, not proof that a participant used a page."

Admin pages are not buyer access and are excluded. Access-gated pages are tested as boundaries: "A locked view can pass access-boundary testing without counting its features as tested."

## Step 2: decide the boundaries

Write them into the brief:

- Allowed: reading every page, saving and reloading settings on test records, one capped search, downloads, copying drafts.
- Not allowed without action-time approval from the user: purchases, outbound email or messages, support submissions, public reviews, deletions, creating persistent API keys, changing credentials or entitlements. If the user is not asked or does not approve, those items stay `U`.
- No new paid generation unless the user decides otherwise.

## The brief

Start from `app-journey.md` (first line, run rules, persona, product), then replace the journey with:

```
**Your sweep.** Visit every page your purchase exposes, in this order: <inventory list for this persona>.
On each page, do the actions listed for it, reload once, and record what you saw. For pages your purchase does not include, check the access boundary: what you see, whether the upgrade path is clear, and whether anything leaks through.
No page counts as tested solely because its navigation link exists.

**Your reply must contain:**
- Your decision: keep using, refund, buy more, or stop, and why.
- A per-page table: Page / Action / Observed result / Status (C, P, G or U).
- 3 to 7 objections, each tied to an element.
- Your natural abandonment point (where you would have stopped if not asked to continue).
- Your single largest dealbreaker, in one sentence.
- Actual cost and state changes: balances before and after, anything you created.
- Limits: what you could not check, and why.
```

## Coverage statuses

| Status | Meaning |
|---|---|
| `C` complete | The rendered route and action were exercised within the stated boundary. |
| `P` partial | The action or the external evidence was unavailable (for example, no download event visible to the tool). |
| `G` access-gated | The buyer's entitlement does not include it; the boundary itself was tested. |
| `U` untested | Not reached, or blocked by a boundary that needs approval. |

"Complete means the rendered route or action was exercised within the stated boundary. It does not mean every downstream system passed."

## Completion rule

"Do not call the sweep complete until all five reports, the aggregate, and the route/status matrix exist. If a session is interrupted, record the last completed route and the exact blocker; do not infer the remaining pages from another buyer's run."

## Aggregate report

- Coverage matrix: surface × persona, with C/P/G/U.
- Normalised objection tally.
- Buyer decisions table: Buyer / existing purchase / decision / natural stop.
- What nobody did (purchases, sends, deletions), stated explicitly.
- Unresolved risks and the untested list.
- For a retest sweep, a repair delta table (earlier failure / retest result / remaining limit).
