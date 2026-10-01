# Release 1 acceptance record

This maps each acceptance check in the release spec ([issue #1](https://github.com/tdyin/learner-kit/issues/1)) to the evidence recorded in [smoke-checks.md](smoke-checks.md). Check IDs (PR3, DG1, …) refer to the tables there.

**Status: not yet complete.** All nine skills exist and install. The `lk-learn` conversation checks (LN1–LN9) and the final pass at the release commit have not been run. Do not declare the release complete until the final pass is recorded and has no blocking failure.

## Hosts and runs

| Run | Host / model | Date | Skill version |
|---|---|---|---|
| Install and discovery | Codex CLI 0.159.3 on Linux, no model | 2026-10-01 | `4182e4f`, `19321d0`, `15a1c28`, `main` |
| `lk-coach` checks | Codex CLI 0.159.3 on Windows 11, gpt-6-astra (medium) | 2026-09-30 | `a8ed595`, rerun at `7e7731b` |
| Issues #3–#5 checks, 4 rounds | Codex CLI 0.159.3 on Windows 11, gpt-5.6-terra (medium) | 2026-10-01 | `19150f7` → `a45e841` → `e85eb1d` → `bd99a65` |
| `lk-learn` and final pass | — | — | Not run |

## Independent use (one skill installed, fresh session)

| Skill | Spec scenario | Evidence | Status |
|---|---|---|---|
| `lk-explore` | Unfamiliar topic → concise map and starting point | EX1, EX2 | Pass (`19150f7`); needs the final pass |
| `lk-explain` | Heat vs temperature → accurate distinction and example | EP1 | Pass (`a45e841`); needs the final pass |
| `lk-practice` | Energy-balance task; waits; answer-specific feedback | PR1–PR5 | Pass (`bd99a65`, `e85eb1d`) |
| `lk-diagnose` | Sign-error solution → explanation tied to the answer | DG1 | Pass (`a45e841`) |
| `lk-coach` | Homework without an attempt → useful start, no onboarding | Check 1 | Pass (`a8ed595`; skill unchanged since `7e7731b`) |
| `lk-recall` | Notes → one question; feedback only after the answer | RC1 | Pass (`a45e841`); needs the final pass |
| `lk-transfer` | Familiar problem → one meaningful change and an invitation to attempt | TR1 | Pass (`bd99a65`) |
| `lk-review` | Notes in a fresh chat → review without a profile | RV1 | Pass (`bd99a65`); item labels changed afterwards, so needs the final pass |
| `lk-learn` | Goal and short time budget → manageable interactive sequence, no companions | LN1, LN8 | **Not run** |

## Shared checks from the spec

| Spec check | Evidence | Status |
|---|---|---|
| Install one skill and all nine from the README; available outside the repo | Install tables for issues #2, #3–#5 and #6; the tester's real-host installs | **Partial.** One skill and all nine passed on Linux (no model). On the tester's host, single installs and all eight passed; all nine there is in the final pass. |
| `lk-` names; explicit invocation selects the intended skill; matching requests don't load it | `lk-coach` checks 1–2; PR6; X3 | **Partial.** Passed for the checks listed. `lk-learn` (LN9) and the `lk-review`/`lk-learn` selection check are in the final pass. |
| Continuation after selection; context kept across optional transitions | `lk-coach` check 3; X1; X2 | Pass |
| Correct answer | `lk-coach` check 11; PR2; DG3 | Pass |
| Ambiguous answer | PR4; DG4 | Pass |
| Bounded hint | `lk-coach` check 4; PR5 | Pass |
| Two unsuccessful coached retries → fallback | `lk-coach` check 5 (after fix) | Pass. LN5 is **not run**. |
| Full solution before an attempt | `lk-coach` check 6; DG6; TR4 | Pass |
| Skip; stop | `lk-coach` checks 7–8; PR5; EP5; RC4 | Pass |
| Successful coached retry; truthful recap | `lk-coach` check 9; RC4; RV4 | Pass |
| Absent history | RV2 | Pass (`19150f7`); needs the final pass |
| Missing companion; declined handoff | X1; X2 | Pass (`e85eb1d`) |
| Likely erroneous notes | EP2, EP3, RC3, RV1 | Pass |
| Conceptual or argumentative answer | EP4 | Pass (`19150f7`); needs the final pass |
| `lk-learn` routine transitions without prompts; asks before a goal change or difficulty jump | LN2–LN4 | **Not run** |
| Homework help without course-rule questions; conflict with a stated limit → clarify | `lk-coach` checks 1 and 10 | Pass |
| Example answers checked against references | `examples/thermodynamics.md` (recomputed in Python; sources, units and sign conventions recorded) | Pass |

## Blocking conditions (from the spec)

| Condition | Current state |
|---|---|
| Broken installation | None observed |
| Missing or unusable skill | All nine present and valid. `lk-learn` behavior is not yet observed. |
| Known incorrect reference answers | None known |
| Fabricated learner evidence | None in the recorded runs after fixes |
| Full answer disclosed during a hint check | None (`lk-coach` check 4, PR5) |
| Ignored stop request | None |

## Reference set

`examples/thermodynamics.md` has concept notes, five problems (P1–P5) with expected reasoning and answers, common mistakes, a transfer variant (P5), sources, units and sign conventions, plus the short non-numerical argument. Learner-facing statements are kept separate from the solutions.

## Out of scope and known limits

- Verified in Codex only, mostly on thermodynamics material. Other hosts, models and subjects are untested.
- These manual checks show observed basic behavior. They do not show deterministic adherence or improved learning outcomes.
- Some behaviors needed wording fixes before the model followed them reliably (for example generated-task labels). A single pass does not guarantee the behavior on every run.
