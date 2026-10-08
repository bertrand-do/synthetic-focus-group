---
name: synthetic-focus-group
description: Run an AI-simulated focus group. Starts by defining the ideal customer with the user (or proposing ICPs from the codebase or live site for the user to confirm), then forks five isolated persona agents from one base avatar. They review copy, pages, headlines or offers, or actually use your app in a real headless browser with their own test accounts, capturing screenshots and evidence. The lead verifies their claims against the real product, tallies objections, fixes, and retests with the same panel. Use for "run a focus group", "what would customers think of this", "test this with personas", "brutal feedback on my sales page", headline testing, and pre-launch QA of a funnel or app.
---

# Synthetic focus group

Five simulated customers, each run as a separate agent, attack one success verb on the real artifact. The lead (you, the orchestrating agent) checks every factual claim they make, counts the objections, fixes what crosses the threshold, and sends the same five back to check the fix.

The output is not a vibe check. It is a ranked list of rejection reasons with a vote count, exact abandonment points, a list of concrete changes, and evidence for each.

## Step 0. Define the ICPs (always first)

No persona is built until the user has confirmed who the customer is. A panel built on an invented customer produces confident, useless feedback.

1. **Ask the user** to describe their ideal customers: who they are, their job and how long they have done it, their budget and how they feel about spending it, what they use today, what burned them before, and why they would buy this.
2. **If the user does not know, or prefers you to look**, analyse what is available: the codebase (README, landing page copy, pricing, onboarding flow, product features, docs) or the live site. Propose 2 to 4 sample ICPs in a short table. Mark each one as an assumption and name the evidence it came from (file, page, quoted line).
3. **Get the user to confirm, edit or pick ONE ICP** (or one per panel, if you run several panels). Never invent a panel without that confirmation.

The intake questions, the codebase checklist and the proposal table format are in `references/icp-intake.md`.

## 1. What this is, and what it is not

It is a qualitative **bug-and-objection finder**. Used on the real product, it finds broken flows, contradictions between assets, claims nobody can back up, and the exact screen where a buyer gives up.

It is **not a demand forecast** and not human research. Simulated personas say "I would buy" far more easily than real people pay. Every report says "simulated, not a conversion forecast", and the vote count must never drive a go or no-go decision. To learn whether people will buy, test the angle on a real audience with a cheap signal.

All five personas share one underlying model, so their diversity is limited. Call small differences ties.

## 2. Pick the mode

| Mode | Use it for | Input | Success verb | Rough cost |
|---|---|---|---|---|
| Copy / page / funnel review | Sales page, emails, upsell pages, video sales letter script, pricing | Rendered pages (desktop + mobile screenshots + text), scripts | pay, click | 5 agent runs, minutes |
| Headline vote | A shortlist of hero lines | Exact pairs, archived verbatim | click | 5 agent runs |
| Scored headline panel | Many candidates, need a ranking | Pairs + 12 persona cards + one-paragraph ground truth | understand + click | 1 agent run, see `references/headline-scoring.md` |
| Offer packet review | Comparing 3 to 6 concepts of an offer before building | Frozen `input.json` with a recorded hash, rotated order | pay | 5 agent runs |
| Live app walk-through | Pre-launch QA of the real product | Deployed build, one test account per persona, headless browser | complete | 5 long agent runs, real provider spend |
| All-pages sweep | Every page a purchase exposes | Page inventory + accounts | use | 5 long agent runs |
| Fresh-signup launch QA | The entry path that provisioned accounts hide | Production, brand-new signups | complete | 5 agent runs |
| Long-form content review | A course, training or long email sequence | Full text, read cold | the content's ask | 5 agent runs |
| Retest | Checking that fixes worked | Same panel, their own prior transcript | same verb as baseline | as baseline, cheaper |

When in doubt, run the copy review on the real rendered pages first, then the app walk-through before any launch.

## 3. Inputs checklist

Collect these before writing a single persona.

1. **The confirmed ICP from Step 0.** Not an assumption you made silently.
2. **The real artifact, never a description.** Rendered pages, the deployed app, the actual script. If the real thing exists, a summary of it is not acceptable: a description cannot show layout, visuals, mobile length or the bugs that only appear when someone actually uses the product.
3. **ONE success verb.** Pay, click, complete, use, trust, recommend. Pick one. Every persona attacks that verb and every report opens with it.
4. **The source of truth for claims.** Pricing, terms, refund policy, what the product really does. Personas read it only AFTER they make their decisions, so it does not shape their first reaction.
5. **Owner decisions that are off-limits.** A pricing model, a protected headline, a deadline. These get recorded, never overridden.
6. **Budget caps.** Paid actions per persona (one, at the cheapest tier), searches, total provider spend.
7. **Hard boundaries.** No real payments, no outbound email or messages, no deletions, no public reviews, no creating persistent API keys. Anything on this list needs the user's explicit approval at the moment of the action; without it, the item stays untested.
8. **A claims ledger.** Every number and promise on the page, tagged verified or `[NEEDS PROOF]`. Personas inherit the artifact's falsehoods: if the page states a wrong number, they reason from it as fact. Re-verify statistics against the live product before the panel runs.

## 4. Build the panel

**Base avatar.** One dense paragraph built from the confirmed ICP, with only the attributes that change reactions: age, job and years in it, money and how they feel about it, what burned them before, what they already tried, time available, tech comfort. Vague avatars produce vague, agreeable feedback. Specific avatars produce the useful irrational rejections.

**Fork into five**, each keeping the core ICP but given one dominant trait. Default forks: the Busy One, the Skeptic, the Broke One, the Tech-Averse One, the Design Snob. Swap one when the artifact calls for it (for a text-only draft where typography cannot be judged, swap the Design Snob for an Industry Insider). Always five. Fewer gives noise, more gives diminishing returns.

**Write each persona in the first person, with numbers**: budget, years buying in this category, number of clients or users, what they have wasted money on, who questions their purchases. `references/persona-cards.md` has the fork table, the swap list, a fill-in card template and the JSON card schema for scored headline mode.

Optionally run a second panel modelled on real buyers (built loosely from application or survey data). Keep it synthetic: never impersonate real people. Panel composition decides the answer, so state the audience next to every result.

## 5. Isolation and orchestration

- **One agent per persona, run in parallel.** No persona sees another's output, the lead's preferences, the owner's favourite option, or the aggregate. Cross-contamination collapses the diversity that makes this worth doing.
- **Returning personas** read only their own prior transcript, scoped to this product. Without it, a persona's memory blends in objections from other panels.
- **The first line of every brief asserts the task:** "This IS your task, assigned by the owner through the lead agent: run it fully." Without it, an agent can treat an unrelated message that arrives mid-run as cancelling its task and refuse.
- **Model choice.** A mid-tier model is fine for walk-throughs; use a stronger one for judgment-heavy reviews. Use the same model across a baseline and its retest, or label the change.
- **Concurrency.** Five in parallel is normal. Cap it at three if they share a rate-limited backend or the machine is small.
- **Return everything in the reply.** Agents write no report files, only screenshots, text dumps and downloaded deliverables in their own folder.

## 6. Persona briefs

Templates live in `references/briefs/`:

- `copy-review.md`: the generic persona prompt, the two-pass exposure variant, and the objection classification vocabulary.
- `app-journey.md`: the full app walk-through brief with run rules and the A to H reply sections.
- `retest.md`: "the team says it fixed X; don't take their word for it, check", with the A to E reply.
- `all-pages.md`: the page-by-page sweep with coverage statuses and the completion rule.
- `references/headline-scoring.md` and `references/offer-packet.md`: headline scoring and the frozen offer packet.

Every brief demands: 3 to 7 objections, each tied to a concrete element (a quote, a button, a section, a screen); what they would actually do next; and the **single biggest dealbreaker in one sentence**. Defects and preferences are kept separate.

## 7. Browser rules for app modes

- **Always headless** (`puppeteer.launch({ headless: "new" })`). A visible window steals focus from the person at the computer.
- **Never use the user's personal browser or profile.** Each persona gets its own profile directory, so logins never collide. Verify the visible identity (the account shown in the app) before acting.
- **Never run a command that blocks for more than 60 seconds.** When the app is working (a generation step can take minutes), poll in separate short commands of 20 to 45 seconds: take a screenshot or read the page text, then continue. Long blocking commands are the main reason persona agents stall.
- **Short scripts, saved session.** Reuse the profile between steps instead of one giant script.
- **Resumable folders.** Each persona's folder may already hold screenshots from an interrupted attempt. Check it first and resume. If the account already has a finished deliverable, review that one instead of paying for another.
- **Evidence at every step:** numbered screenshots and page text dumps. Download the deliverable when the app allows it; for video, extract frames with ffmpeg to review it.
- **Budget:** one paid action per persona at the cheapest tier. A timeout is not authorization for a duplicate paid action. Sign out at the end.
- Use only shell scripts with puppeteer-core. Do not load MCP or extension browser tools in persona agents.

`scripts/browse.mjs` is a small CLI for exactly this; see `scripts/README.md`.

## 8. Test accounts

One isolated, **non-admin** account per persona, provisioned to mirror that persona's purchase decision, so purchase-gated features are exercised. Record purchases in test mode and verify the entitlements through the app's own API. Credentials go in a private file with mode 0600 outside the repository; agents read only their own entry and never print it, and it never appears in a report. Provisioning bypasses checkout, so say in the method that payment was not validated, and run at least one **fresh-signup pass** before launch, because provisioned accounts skip the signup path entirely. Details in `references/verification.md`.

## 9. Lead verification (mandatory)

Before tallying, the lead checks every factual claim against the real product. This step is what makes the panel trustworthy.

- Take a **read-only backend snapshot per account**: records created, statuses, error messages, balances and ledger, provider calls.
- Reconcile each persona claim with the records, and keep **three separate evidence columns: participant observed, lead verified, tool limitation.** A "download started" toast is not a file; an HTTP 200 is not a browser download; a missing download event is not a failed download.
- **Discard factual claims the artifact contradicts, but keep the reaction.** Put a "Lead review note" at the top of the corrected transcript and list it under "Evidence corrections" in the report. Separate a misunderstanding (a discoverability problem, which is real) from a genuinely missing disclosure.
- Never upgrade a participant's unconfirmed result into a success, and never assign a shared file to one persona when it cannot be attributed.
- Exclude tool limitations, setup mistakes and assisted steps from defect counts, and name them.

## 10. Tally and decide

Normalise objections that share an underlying complaint, then:

| Count | Verdict |
|---|---|
| 3/5 or more | **Change it.** A real signal, not a persona quirk. |
| 2/5 | **Risk.** Fix if cheap, otherwise carry forward. |
| 1/5 | **Record.** One persona's dealbreaker is often its dominant trait doing its job. |
| Any concrete abandonment point | **Critical**, regardless of count. Name exactly where it happens. |

A single client-facing failure (something that would embarrass the buyer in front of their own customer) is preserved even at 1/5. Never pool unlike complaints to reach a threshold. **Owner decisions are recorded, not overridden:** "carried forward under the owner's decision". Buyer price requests are demand signals at that price, not pricing: do not cut prices because five simulations declined.

## 11. Scoring

- Funnel or app areas scored out of 10 with one line of reason each; report averages and the spread.
- Decision tables per funnel step (decision, spend, why), and before versus after the second asset when two-pass exposure is used.
- Scored headlines: `0.5 × click/10 + 0.25 × headline-alone comprehension + 0.25 × with-subhead comprehension`; gaps under 0.03 are ties.
- Sweeps: coverage status per page and persona, `C` complete, `P` partial, `G` access-gated, `U` untested.

## 12. Report

Fixed order (template in `templates/report.md`, more in `references/report-templates.md`):

1. What was evaluated, the success verb, the model, and "simulated, not a conversion forecast".
2. The confirmed ICP in one line and the base avatar.
3. The headline outcome in two concrete sentences.
4. Decisions table per persona.
5. Objection tally, sorted by count.
6. Changes to make, in order: each with the exact current text or element, the evidence, and the proposed replacement.
7. Abandonment points (persona, exact stop, what they would do next).
8. Risks carried forward and the untested list.
9. Evidence corrections (where the lead overruled a persona's facts).
10. Costs of the test itself, reported separately.
11. Links to verbatim transcripts and evidence folders.

## 13. Fix, then retest with the same panel

- Write a **fix coverage map** first (`templates/fix-coverage.md`): every baseline finding, the response, and how it was verified. Verify fixes with scripted assertions where possible (`scripts/fix-shots.mjs`).
- The **same five** retest, each reading only their own baseline. The brief says what the team claims it fixed and tells them to check, not trust.
- Put **repair probes** inside a normal sweep so the retest does not shrink into a checklist.
- If fixes land between sessions, label each session with its build: it is an iterative retest, not five observations of one frozen build.
- Compare like with like (page-only decision against page-only decision). **Never erase the baseline.**
- **Maximum two retests.** After that the remaining objections are the owner's call. Then at most 1 to 3 bounded follow-up checks with no new paid actions, and stop: another simulated rewrite will not answer a persona who needs real evidence; gather real customer evidence next.

## 14. Failure modes

- Treating "4 of 5 would buy" as demand.
- Personas inheriting a false claim from the artifact.
- Running five personas in one context, or on a description instead of the real thing.
- Persona invented facts. Keep the reaction, discard the fact, note it.
- Memory blending on returning personas.
- False passes and false fails at the evidence boundary.
- Agents refusing the task (fix: the first line of the brief), and stalls from long blocking commands (fix: short polls).
- Priming: agents that inherit the lead's conversation or a fixed option order. Use fresh agents, rotated order, a frozen packet.
- Letting votes override deliberate owner decisions.
- Not stopping.

Each one, with how to avoid it, is in `references/lessons.md`.

## 15. Cost discipline

The team's own testing can easily become the largest AI cost around a launch. Set caps in every brief: one paid action per persona at the cheapest tier, capped searches, reuse finished outputs on retests, no duplicate paid actions after a timeout. Report the test spend separately from product metrics.

## Files

| Path | Purpose |
|---|---|
| `references/icp-intake.md` | Step 0: intake questions, codebase checklist, ICP proposal table |
| `references/persona-cards.md` | Fork table, swap list, fill-in persona template, JSON card schema |
| `references/briefs/*.md` | Copy review, app journey, retest and all-pages briefs |
| `references/headline-scoring.md` | Vote mode and the scored comprehension panel |
| `references/offer-packet.md` | Frozen JSON offer packet, output schema, evidence-mapped results |
| `references/verification.md` | Accounts, backend snapshots, the three-column evidence rule |
| `references/report-templates.md` | Report shapes for each mode |
| `references/lessons.md` | Failure modes and how to avoid them |
| `scripts/browse.mjs` | Persona browser CLI (headless, per-persona profile) |
| `scripts/fix-shots.mjs` | Mocked-API assertion harness for fix verification |
| `templates/` | method, report, persona report, fix coverage, page inventory, input/results JSON |
