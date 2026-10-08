# <Artifact> focus group: method

<Date>. Status: <planned | running | complete>. Results are in [report.md](report.md).

## What is evaluated

<The exact artifact: URLs, build or commit, deployment identifier, files. The real rendered thing, not a description.>

Success verb: **<pay | click | complete | use | trust | recommend>**.

## ICP and panel

ICP (confirmed by the owner in Step 0 on <date>): <one line>. Source: <owner description | proposal X as edited by the owner>.

Base avatar: <one dense paragraph>.

| Persona | Dominant trait | Prior decision carried forward | Access scenario |
| --- | --- | --- | --- |
| <name> | <trait> | <none, or their earlier decision> | <what their account has> |

Each persona runs as a separate agent on <model>. These are simulated customers <operating the real app in a headless browser>. Their reactions are qualitative research inputs, not real customer testimony or measured conversion rates. Participants do not read one another's reports. Returning participants read only their own prior transcript for this product.

## Accounts

<One isolated non-admin account per persona, provisioned to mirror their purchase, entitlements verified through the app's own API. Credentials in a private 0600 file outside the repo, excluded from all reports.> Provisioning bypasses checkout; this exercise does not validate payment.

## Boundaries and budget

- Paid actions: <one per persona, cheapest tier>. A generation timeout is not authorization for a duplicate.
- Searches or lookups: <cap>.
- Never: real payments, outbound email or messages, deletions, public reviews, persistent API keys, credential or entitlement changes. Items needing action-time approval stay untested without it.
- Headless browser only, a profile directory per persona, never the user's personal browser.

## Source of truth

<Pricing and terms document.> Personas read it only after making their decisions.

## Owner decisions not up for change

- <decision>: reactions to it are recorded and carried forward, not acted on.

## Tally rules

Three or more explicit, independent objections warrant a change recommendation; two flag a risk; one is recorded. Any exact abandonment point is called out regardless of count. Product defects, preferences, setup artifacts and unverified interpretations remain distinct.

## Known limits of this run

<Tool limitations, contamination, non-randomised order, iterative builds, anything a reader should discount.>
