# Fix coverage before the retest

Every baseline finding gets a row, including the ones deliberately not fixed.

| Baseline issue | Count | Implemented response | Verification |
| --- | ---: | --- | --- |
| <issue in plain words> | <n/5> | <what changed> | <regression test with the exact failing inputs, scripted browser check (fix-shots check name), deployed HTTP status, or "participant retest"> |
| <issue held under an owner decision> | | Not changed: <decision> | Carried forward |

## Repair probes for the retest

| Baseline abandonment signal | Required evidence in the retest |
| --- | --- |
| <persona>: <exact stop> | <screen, state or record that proves it> |

These probes are required because they map to first-pass abandonment points. They do not replace the full journey or route sweep.

## Problems discovered during the retest

| Problem | Found by | Response | Verification |
| --- | --- | --- | --- |
