# Accounts and lead verification

Personas report what they saw. The lead establishes what happened. Keep the two apart, label the lead's work as "technical verification, not participant observations", and never let one silently rewrite the other.

## Test accounts

The pattern, in words (write the adapter for your own stack):

1. **One isolated, non-admin account per persona.** Admin accounts see things buyers never see and skip checks buyers hit. Each persona gets its own account so their records, balances and login state never mix.
2. **Mirror each persona's purchase.** If a persona decided to buy the front end plus one upsell, that is what their account gets. Record those purchases in the app's **test mode** (for example a zero-amount purchase row flagged as not live) so purchase-gated entitlements are exercised the same way real ones are.
3. **Verify through the app's own API.** After provisioning, call the endpoint the app itself uses to decide what a user can do (its "who am I" or account endpoint) for each account, and save the responses as `account-verification.json`. Do not trust the provisioning script's own success message.
4. **Credentials stay private.** Write them to one file with mode 0600, outside the repository and outside any folder that gets published. Each agent reads only its own entry by name and never prints the secret. Credentials never appear in transcripts, screenshots, reports or commit history. Delete or disable the accounts when the work ends.
5. **Say what provisioning skipped.** "Provisioning bypasses checkout; this exercise does not validate payment, purchase emails or checkout-to-app authentication."
6. **Run one fresh-signup pass before launch.** Provisioned accounts hide the entry path: signup, email confirmation, the auth provider's mail limits and checkout-to-app login are never exercised by a script-created account.
7. **Separate hostnames or profiles per persona.** Personas sharing a hostname and profile can end up in each other's session. Use distinct profile directories, and have each persona check the account shown in the app before acting.

If a persona starts on the wrong account (a superseded or generic one), exclude everything from that session from the defect counts and say so in the method.

## Read-only backend snapshot

After the sessions, take a **read-only** snapshot per account, saved as `backend-verification.json`. Typical fields:

- the profile and entitlements;
- the inputs the persona created (source records);
- deliverables: status, error message, credits charged, provider cost, output location;
- the credit or usage ledger and balances;
- provider calls: provider, endpoint, duration, cost;
- media checks: an HTTP HEAD on each output with status, content type and length, with the note "HTTP HEAD checks file availability only; it does not verify browser download or playback."

Read with the narrowest credentials that work. Never write during verification.

## Reconcile every claim

Go through each transcript and match each factual claim with a record. Typical reconciliations:

- **Several reports, one cause.** When more than one persona reports a failure, compare the stored error messages and the inputs. If they match, it is one root cause; measure the input that triggers it and report it once, with every affected persona.
- **"It failed many times."** Count the actual calls in the records and see how far each got. A generic error on screen can hide a limit, a validation rule or a rejection before the core service was ever called.
- **Money and balances.** For each persona: what was charged, when, what was refunded and how long after, and the totals, so the report states exactly what each buyer lost.

## The three evidence columns

For every finding, keep three columns apart:

| Participant observed | Lead verified | Tool limitation |
|---|---|---|
| "I clicked Download and nothing happened." | The file exists on disk: name, bytes, SHA-256, valid header, duration. | The browser tool emits no download events. |

Rules that follow from it:

- A "download started" toast is not a file. An HTTP 200 is not a browser download. A missing download event is not a failed download.
- When the lead finds the file a click created, record it, **but keep the participant's conclusion intact**: "the lead did not rewrite them into unconditional successes."
- Shared files that cannot be attributed to one persona are not assigned to one.
- A technical audit can raise a false alarm too. Re-run it against the correct reference before reporting.

## Persona hallucination

Personas invent facts: a feature they say is missing that the page actually lists, a workflow step that does not exist, a conclusion drawn from a broken element. The pattern:

1. **Keep the reaction, discard the factual claim.**
2. Ask: is this a misunderstanding (a real discoverability problem worth fixing) or a genuinely missing disclosure?
3. Put a **Lead review note** at the top of that transcript, for example: "Lead review note: [section] lists the [item] this persona says is missing. The objection is kept as a discoverability issue; the factual claim is corrected."
4. If a corrected fact changes the persona's decision, re-ask that persona for its decision with the correction, and count the corrected one.
5. List every correction under "Evidence corrections" in the report.

## Deployment check

Record what was actually tested, as `production-verification.json` or a table: health check status, the running commit, the deployment identifier, whether the served JS asset matches the local build, whether the reviewed page's content hash matches the file you reviewed. A retest of the wrong build is worse than no retest.

## Exclusions

Name and exclude from defect counts: tool limitations (clipboard unreadable, no audio, no download events), setup mistakes (wrong account, stale build), and assisted steps (the lead looked something up for the persona). Excluded is not hidden: they stay in the report under limits.
