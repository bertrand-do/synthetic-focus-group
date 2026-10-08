# synthetic-focus-group

A Claude Code skill for running AI-simulated focus groups that find real bugs and real objections before your customers do.

Five simulated customers, each run as its own agent, attack one success verb on the real thing: your sales page, your headlines, your offer, or your actual app, which they use in a headless browser with their own test accounts. Then you, the lead, check their claims against the backend, count the objections, fix what crosses the threshold, and send the same five back to check the fix.

The method in five lines (after Step 0, where you and Claude define and confirm the ideal customer, from your description or from ICPs it proposes after reading your codebase or site):

1. **Pick one success verb** (pay, click, complete, use) and give the panel the real artifact, never a description of it.
2. **Fork five personas from one confirmed base avatar**, each with one dominant trait and real numbers (budget, years, what burned them).
3. **Run them isolated, in parallel.** Each returns 3 to 7 objections tied to specific elements, what they would do next, and their single biggest dealbreaker.
4. **Verify, then tally.** Discard facts the product contradicts but keep the reactions. 3/5 means change it, 2/5 is a risk, 1/5 is recorded, and any abandonment point is critical.
5. **Fix, then retest with the same panel**, at most twice. Owner decisions are recorded, never overridden.

It finds bugs and objections; it does not predict conversion. Simulated customers say yes far more easily than real ones pay, so the skill never lets the vote count drive a go or no-go decision.

## What it's good at finding

- **Claims the product cannot back up**, including wrong numbers on a sales page that personas would otherwise accept as fact.
- **Contradictions between assets**: the page, the video script, the emails and the checkout saying different things about price, deadlines, limits or what is included.
- **Broken or misleading flows** in the real app: failures that hit several users for one root cause, generic errors that hide a limit, retries that cannot succeed, work lost on reload.
- **Delivery problems**: downloads that do not arrive, outputs a buyer could not send to their own client, wrong data shown as verified.
- **Leftover wording** from another product or an old version.
- **Entry-path failures** that test accounts hide: signup, email confirmation, first login.
- **The exact screen or sentence where a buyer gives up**, and why.

## Install

```bash
git clone https://github.com/bertrand-do/synthetic-focus-group.git
cp -R synthetic-focus-group/synthetic-focus-group ~/.claude/skills/
```

Then ask Claude Code: *"run a focus group on my sales page"* or *"have five personas use the app before launch"*.

The browser scripts need Node 18+, Google Chrome and `puppeteer-core` (`npm i puppeteer-core`). See `scripts/README.md`.

## What's inside

| File | What it is |
|---|---|
| `synthetic-focus-group/SKILL.md` | The method: Step 0 ICPs, modes, inputs, panel, isolation, browser rules, verification, tally, report, retest |
| `references/icp-intake.md` | Intake questions, codebase and site checklist, ICP proposal table |
| `references/persona-cards.md` | The five default forks, swap list, fill-in persona template, JSON card schema |
| `references/briefs/copy-review.md` | Persona prompt for pages and funnels, two-pass exposure, objection vocabulary |
| `references/briefs/app-journey.md` | Full live-app walk-through brief with run rules and A to H reply sections |
| `references/briefs/retest.md` | "The team says it fixed this; check" brief, repair probes, retest rules |
| `references/briefs/all-pages.md` | Page-by-page sweep, coverage statuses, completion rule |
| `references/headline-scoring.md` | Headline vote and the scored comprehension panel (0.5 click + 0.25 + 0.25 comprehension) |
| `references/offer-packet.md` | Frozen JSON offer packet with hash, rotated order and evidence-mapped results |
| `references/verification.md` | Test accounts, read-only backend snapshots, the three-column evidence rule |
| `references/report-templates.md` | Report shapes for each mode |
| `references/lessons.md` | Failure modes and how to avoid them |
| `scripts/browse.mjs` | Headless persona browser CLI with numbered screenshots and text dumps |
| `scripts/fix-shots.mjs` | Mocked-API assertion harness for verifying fixes, with a self-test |
| `templates/` | method, report, persona report, fix coverage, page inventory, input and results JSON |

## License

MIT
