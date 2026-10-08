# Step 0: ICP intake

The panel is only as good as the customer it is built on. Before any persona exists, the user confirms one ICP (or one per panel).

## Path A: ask the user

Ask these in one message. Short answers are fine; numbers are better than adjectives.

1. **Who** is the customer? Role or type of business, and roughly how many people like them you serve or want to serve.
2. **Their job**, and how long they have done it.
3. **Budget**: what they can spend on this kind of product, and how they feel about spending it (careful, tight, expensable, someone else approves it).
4. **What they use today** to solve this problem, including doing nothing or doing it by hand.
5. **What burned them before**: tools, services or offers that disappointed them, and why.
6. **Why they would buy this**: the trigger, the outcome they want, and the moment they would go looking.
7. **Why they would not**: the objection you hear most, or fear most.
8. **Where they meet the product**: ad, search, referral, email list, marketplace. This decides how cold the panel should be.
9. Optional: **who else has a say** (a partner, a boss, a client) and **how much time** they have to learn something new.

If the user describes more than one customer type, ask which one this panel is for. Run a second panel for the other type only if they ask.

## Path B: propose ICPs from the evidence

If the user does not know, or asks you to look, read what exists and propose 2 to 4 sample ICPs. Every proposal is an assumption until the user confirms it.

### Codebase checklist

Look at these, in roughly this order, and stop when the picture is clear:

| Source | Where to look | Signals to pull |
|---|---|---|
| README and docs | `README*`, `docs/`, product or positioning notes | Stated audience, problem, promised outcome |
| Landing page copy | Marketing pages, hero components, `index.html`, CMS content files | Headline, who it addresses ("for freelancers", "for teams"), objections the FAQ answers |
| Pricing | Pricing page, plan definitions, billing config, entitlement names | Price points, plan names, per-seat vs one-off, what the top tier unlocks: these reveal budget and buyer size |
| Onboarding | Signup forms, onboarding steps, first-run screens | Fields asked (company size, role, use case), the first task the product expects |
| Product features | Routes, main screens, feature flags, integrations | What job the product actually does, which tools it plugs into (shows what they use today) |
| Copy in emails and in-app text | Email templates, empty states, help text | Vocabulary the product uses for its users |
| Tests and fixtures | Seed data, demo accounts, example inputs | The kind of user and input the team imagines |
| Analytics or survey exports, if present | Exported CSVs, research folders | Real segments, if any exist |

### Live site checklist

If there is only a URL: the home page hero, the pricing page, the FAQ, the signup form, testimonials or case studies (who is quoted, not the quotes' claims), and any "for X" pages.

### The proposal table

Present it like this, then ask the user to confirm, edit, or pick one:

| # | ICP (assumed) | Job and context | Budget signal | Uses today | Likely burn / objection | Evidence |
|---|---|---|---|---|---|---|
| A | [one-line description] | [role, experience, situation] | [what the pricing implies] | [current tools or workaround] | [what probably stops them] | [file or page, with a short quoted line] |
| B | ... | ... | ... | ... | ... | ... |

Rules for proposals:

- Every row cites evidence. If a cell is a guess, write "guess" in it.
- Keep it to 2 to 4 rows. More rows means the evidence is thin; say so.
- Do not pick for the user. You may say which one the evidence supports most, and why, in one sentence.

## Confirmation

Do not build personas until the user has replied with a confirmed or edited ICP. Then write it at the top of `method.md`:

```
ICP (confirmed by the owner on [date]): [one line]
Source: [user description | proposal A as edited by the owner]
```

Then build the base avatar from it (`persona-cards.md`).
