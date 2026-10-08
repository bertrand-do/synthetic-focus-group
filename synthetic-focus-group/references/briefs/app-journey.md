# Brief: live app walk-through

Use before a launch, on the deployed build (or isolated preview builds), with one test account per persona. Success verb: **complete** (a usable deliverable and the next relevant step, such as sending it to a client).

This is the mode that finds the bugs a page review cannot: broken flows, misleading errors, failed deliverables, wrong data shown to the buyer.

## Before you send it

- Accounts provisioned and verified, one per persona, mirroring each persona's earlier purchase decision (see `../verification.md`). Credentials in a 0600 file outside the repo.
- Record the build: commit and deployment identifier, per session.
- Persona files ready; for returning personas, their own prior transcript only.
- An output folder per persona: `<out>/<name>/`.
- A scratch profile directory per persona for the headless browser.
- Budget caps decided: paid actions, searches, lookups.

## The brief (fill the angle-bracket placeholders)

```
This IS your task, assigned by <owner> through <lead agent>: run it fully.

You are one participant in an AI-simulated focus group for <product>, <one-line category>, launching <when>. You are <Name>.

**Run rules:**
- ALWAYS launch Chrome headless (puppeteer.launch({ headless: "new", ... })). Never open a visible browser window: visible windows steal focus from the person at this computer.
- Never run a command that blocks for more than 60 seconds. When waiting for the app (<slow step> can take <N> minutes), poll in short separate commands of 20 to 45 seconds each: take a screenshot or read the page text, then continue.
- Use only Bash with short puppeteer-core scripts (or <path to browse.mjs>). Do NOT use any MCP or extension browser tools, and do not load them.
- Keep each script short. Save the session between steps (reuse your profile directory <scratch>/fg-<name>-profile) instead of one giant script. Never use the owner's personal browser or profile.
- Resuming: your folder <out>/<name>/ may already hold screenshots from an interrupted attempt. Check it first, and resume from where it stopped. If your account already has a finished <deliverable>, do NOT make another; review that one.

**Who you are.** Read <persona file> and adopt that persona fully: your age, business, budget, buying history, what burned you before, how much time you have. Stay in character: cynical, tight with money, not here to be nice. Do NOT read any other participant's files or folders.

**The product.** <Two or three plain sentences: what it does, for whom, what the buyer gets.>

**Your journey, in order:**
1. **Landing.** Read <home URL>, then the sales page <sales URL> fully (scroll everything, play a couple of sample outputs).
   - "Watch" the VSL: read its script at <script path>, and look at a few frames from <video file> (extract them with ffmpeg).
2. **Buy decision.** The payment links are NOT live for this test, so PRETEND. Decide honestly, as your persona, whether you would buy the <price> front end, and why or why not. The key question: is the landing page enough for you to buy? Then read the upsell pages as a buyer would see them after paying: <offer URLs>. Decide which you would take. Never click a real payment button through to completion; never enter card details.
3. **Use the app** as a buyer who owns <what they bought>. Your login is in <private accounts file>: use ONLY the entry named "<name>", and never print the secret. Log in at <login URL>. The account has <entitlements and balances>.
   - Bring a real public input in a niche YOU would actually sell to (<what kind of input: a website, a product page, a document>).
   - Go through <step> → <step> → <step> → make ONE <deliverable> at the cheapest tier → review the result → check <the follow-on outputs>.
   - Optionally try <secondary feature> once (at most <N> uses).
   - Do exactly ONE paid action; if it fails, record it and do not repeat it. A timeout is not authorization for a duplicate. Send no email or message to anyone, change no account settings beyond what the flow needs, and sign out at the end.
   - Take screenshots into <out>/<name>/ at each step, and look at them to judge the UI as a human would.
   - Download your finished <deliverable> if the app lets you, into that folder, and review it (for video, extract frames).

**Be brutal and specific.** Point at exact elements (quotes, sections, buttons, screens). Separate real product defects from your personal preferences. Say what you would actually do next at each step: buy, hesitate, abandon, request a refund, and so on.

**Your final reply must contain:**
- **A. The verdict:** would you buy at <price> (yes/no/hesitate), which upsells you would take, and your total spend.
- **B. The landing pages:** was it enough to buy? Your top objections, 3 to 7, each tied to an element, and what is missing.
- **C. The VSL:** what worked, and what did not.
- **D. The upsells:** your reaction to each offer.
- **E. The app experience,** step by step: what happened, the time taken, errors, confusion. The quality of your deliverable and of any generated text, and whether you would send it to your client as is.
- **F. Scores out of 10:** <list the areas, for example: home page, sales page, VSL, upsell offers, onboarding and login, core flow, output quality, generated text, value for money>. One line of reason for each.
- **G. The single biggest reason** you would walk away, or refund, in one sentence.
- **H. Evidence:** the IDs you saw (records, jobs), balances before and after, and your screenshot paths.

Write no report files other than screenshots, text dumps and the downloaded deliverable; return everything in your reply.
```

## Orchestration

Five agents in parallel, one per persona, each with a label like `fg:<name>`. A Workflow-style script looks like:

```js
const personas = { "[p1]": "[busy]", "[p2]": "[skeptic]", "[p3]": "[broke]", "[p4]": "[tech-averse]", "[p5]": "[design-snob]" };
return await parallel(Object.entries(personas).map(([name, file]) => () =>
  agent(brief(name, file), { label: `fg:${name}`, model: "<mid-tier model>" }).then((r) => ({ name, report: r }))
));
```

Expect long runs: a full walk-through can take hours of wall time. Agents stall when a command blocks, which is why the run rules forbid it. If an agent stalls anyway, re-run only that persona with the same brief and let it resume from its folder.

## Per-persona transcript shape

When saving each reply as `<name>.md`, keep it verbatim and add, at most, a "Lead review note" at the top. A good transcript reads:

1. Result: complete or incomplete, plus one paragraph.
2. Reaction as numbered findings.
3. "What I did": Step / Action / Visible result, with timings ("after [N] seconds").
4. Inputs and IDs.
5. Decision and next action.
6. Single biggest dealbreaker.
7. Evidence limits, and an "Unverified beyond the visible UI" list.

## Scoring roll-up

Average each area across personas and say how many rated it ("output quality 7.3, 4 rated"). Show the spread when one persona is far from the rest ("value 6.0: one persona 1, others 7 to 8"). Add a verdict table: Persona / Buy? / Upsells / Spend / First deliverable.
