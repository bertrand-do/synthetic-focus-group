# Brief: retest after fixes

Send the **same five** personas back after the team fixes what the baseline found. Each one reads only their own baseline transcript for this product. The brief tells them what the team claims it fixed, and tells them not to believe it.

## Before you send it

1. Write the fix coverage map (`templates/fix-coverage.md`): every baseline finding, the implemented response, and how it was verified. Use `scripts/fix-shots.mjs` for scripted checks where you can.
2. Decide the repair probes: one probe for each baseline abandonment point (see below).
3. Record the build each session will see. If fixes land between sessions, label each transcript with its actual build.
4. Tighten the money rules: reuse finished outputs, no new paid action unless the account has none.

## The brief

```
This IS your task, assigned by <owner> through <lead agent>: run it fully.

You are one participant in a RERUN of an AI-simulated focus group for <product>. You are <Name>.

**Run rules:**
- ALWAYS launch Chrome headless (puppeteer.launch({ headless: "new", ... })). Never open a visible browser window.
- Never run a command that blocks more than 60 seconds; poll in short steps.
- Use only Bash with short puppeteer-core scripts, with your own profile directory <scratch>/fg2-<name>-profile. No MCP browser tools. Never the owner's personal browser.
- **SAVE MONEY:** do NOT make a new <deliverable> if your account already has a finished one. Review that one instead (re-running free steps on it is fine).
  - Only if your account has NO finished <deliverable> may you make ONE at the cheapest tier.
  - At most <N> runs of <expensive step> if you need to re-check that flow.
- Send no email, and pay nothing.

**Who you are.** Read <persona file> and adopt that persona. Then read YOUR OWN earlier reaction to this product: <path to your baseline transcript, or your row in the baseline report>. Don't read other participants' folders.

**Since <baseline date>, the team says it fixed:**
- <fix 1, in plain words>;
- <fix 2>;
- ...
The sales page also changed: <summary of page changes>. Don't take their word for any of it; check.

**Your journey:**
1. Re-read <sales URL>. "Watch" the VSL again via <script> plus a few frames. Glance at the upsell pages.
2. The payment isn't live, so PRETEND: would you buy now, and which upsells?
3. Log in with your entry "<name>" in <private accounts file> (never print the secret). Re-check the app under the money rules above. Reload mid-flow once, to check that work survives a reload.
4. Screenshots go to <out>/<name>/.

**Your reply must contain:**
- **A.** The verdict now versus last time: buy yes/no, upsells, total spend.
- **B.** What got better, and what is still wrong: each item tied to a specific element, with defects and preferences kept separate.
- **C.** Scores out of 10 on the same areas as last time, each with its change versus last time.
- **D.** Your single biggest remaining reason to walk away.
- **E.** Evidence: the IDs, balances before and after, and the screenshots.

Write no report files; return everything in your reply.
```

## Repair probes

A retest must not shrink into a checklist of the fixes. Run the normal journey or sweep, and add one probe per baseline abandonment signal:

| Baseline abandonment signal | Required evidence in the retest |
|---|---|
| <persona>: <exact stop> | <the specific screen, state or record that shows it is fixed> |

State it in the method: "These probes are required because they map to first-pass abandonment points. They do not replace the route sweep."

## Rules for honest retests

- **Compare like with like.** If the baseline decision was page-only, compare with a page-only decision. A post-VSL decision is a different exposure and cannot be used as an equivalent before and after.
- **Never erase the baseline.** "This retest does not erase the earlier failures or replace their original transcripts."
- **Label iterative candidates.** "The retest exposed additional bugs, so fixes were integrated between sessions. It is an iterative five-person retest, not five observations of an identical frozen build. Each transcript identifies its actual candidate."
- **Memory hygiene.** A returning persona must get its own prior transcript for this product, explicitly. Without it, a persona fills "last time" with objections from other panels.
- **Maximum two retests.** After that, the remaining objections are the owner's call.
- **Bounded follow-ups.** After the full retest, 1 to 3 targeted persona checks on the final build, with no new paid actions. Then release with a production check.
- **Stop rule.** Write it down when you stop: "Stop this pass here. Another simulated rewrite is unlikely to answer this persona's evidence requirement. Gather actual product output and customer-response evidence next, then measure real visitor-to-purchase behaviour."

## Retest report

Add to the normal report:

- A **repair delta** table: Earlier failure / Retest result / Remaining limit.
- A **build table**: Session / Persona / Build identifier.
- "Problems discovered during the retest": new bugs the retest surfaced.
- Per persona: score changes versus baseline.
