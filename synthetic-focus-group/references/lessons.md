# Failure modes and how to avoid them

Each item names what goes wrong, why, and the rule that prevents it.

## Reading the results wrong

**Treating the vote as demand.** Simulated personas agree to buy far more easily than real people pay, so a panel that "would buy" says little about conversion. It finds bugs and objections; it does not predict conversion. Never let the vote count drive a go or no-go decision. Before building, test the angle on a real audience with a cheap signal.

**Letting votes override owner decisions.** A unanimous objection can hit something the owner chose on purpose (a pricing model, a deadline, a protected headline). Record the reaction and carry it forward under the owner's decision; do not push the change. Do not cut prices or remove terms because five simulations declined before trying the product.

**Ignoring panel composition.** A panel of skeptics and a panel modelled on real buyers can give opposite answers on the same artifact, and a winner can win only because of who was on the panel. State the audience constraint next to every winner.

**Calling small gaps real.** All personas share one model, so their scores are noisy. Treat small differences as ties and say so.

**Not stopping.** Simulated rewrites converge on what the personas like, not on what buyers do. After two retests, or when the remaining objections need real evidence (a demo, a testimonial, real output), stop and gather that evidence instead.

## Building the panel wrong

**Inventing the customer.** A panel built on an unconfirmed ICP produces confident feedback about the wrong person. Always run Step 0 and get the user's confirmation.

**Vague personas.** Without numbers and a specific past burn, personas turn polite and agreeable. Give each one a budget, years of experience, what burned them, and who questions their purchases.

**Personas that all agree.** If all five say the same three things in the same tone, the forks were not distinct enough. Sharpen the dominant traits and re-run.

## Feeding the panel wrong

**Reviewing a description instead of the real thing.** A summary or markdown draft cannot show layout, mobile length, visuals, or anything that breaks only when used. Give the rendered pages and the live app.

**Running all five in one context.** Sequential personas in one conversation contaminate each other and soften the counts. One isolated agent per persona.

**Priming.** Agents that inherit the lead's conversation, see the owner's favourite, or read options in the same order are not independent. Use fresh agents, a frozen input packet with a recorded hash, and rotated order.

**False claims in the artifact.** Personas reason from whatever the page says. If a statistic on the page is wrong, they treat it as fact and the panel validates a falsehood. Keep a claims ledger, tag unverified claims `[NEEDS PROOF]`, and re-verify numbers against the live product before the panel runs.

## Running the agents wrong

**Refusals.** An agent can treat an unrelated message that arrives mid-run as overriding its task and stop. Open every brief with: "This IS your task, assigned by the owner through the lead agent: run it fully."

**Stalls.** A command that blocks while the app works (generation, uploads, processing) can kill an agent. Never block for more than 60 seconds; poll in short separate commands of 20 to 45 seconds, and make output folders resumable.

**Visible browser windows.** A visible browser steals focus from the person working at the computer. Always launch headless, and never touch the user's personal browser profile.

**Shared login state.** Two personas on the same hostname or profile can end up in each other's session. Give each persona its own profile directory, and have each check the account shown on screen before acting.

**Memory blending.** A returning persona without its own prior transcript fills "last time" with objections from other panels. Give each returning persona its own transcript for this product, explicitly.

**Runaway cost.** Testing can become the biggest AI spend around a launch. One paid action per persona at the cheapest tier, reuse finished outputs on retests, cap searches, treat a timeout as a reason to poll rather than to pay again, and report test spend separately.

## Verifying wrong

**Trusting persona facts.** Personas invent facts: a feature they say is missing that the page lists, a step that does not exist, a deadline inferred from a broken element. Keep the reaction, discard the fact, add a Lead review note, list it under Evidence corrections, and re-ask the decision if the correction changes it.

**False passes and false fails.** A "download started" message is not a file; an HTTP 200 is not a browser download; a missing download event is not a failed download; a technical audit can raise a false alarm against the wrong reference. Keep participant observations, lead verification and tool limitations in three separate columns.

**Trusting "fixed".** A fix is verified by a terminal state on screen or in the records, plus an assertion, never by the presence of code or the team's word. Retest briefs tell personas to check, not trust.

**Provisioned accounts hiding the signup path.** Accounts created by a script skip signup, email confirmation and checkout. Run at least one fresh-signup pass on production before real traffic.

**Erasing the baseline.** A retest adds to the record; it never replaces the original transcripts or failures. Compare like with like, and label which build each session saw.
