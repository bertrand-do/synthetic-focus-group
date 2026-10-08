# Buyer-page inventory

Lead source inventory of the frozen build <commit / deployment>. This is the checklist, not proof that a participant used a page.

| Page / route | Actions requiring rendered verification | Access |
| --- | --- | --- |
| <Dashboard `/app`> | <counts, recent records, navigation, reload> | <all five> |
| <Feature page> | <inputs, validation, one capped action, result states> | <persona with that purchase; others test the boundary> |
| <Settings> | <save and reload; key creation needs action-time approval> | <all five> |

Excluded: admin pages (not buyer access), <anything else, and why>.

## Coverage matrix (filled after the sweep)

`C` complete, `P` partial, `G` access-gated, `U` untested. No page counts as tested solely because its navigation link exists.

| Surface | <P1> | <P2> | <P3> | <P4> | <P5> |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
