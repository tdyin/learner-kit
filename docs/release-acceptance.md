# Release 1 acceptance record

This maps each acceptance check in the release spec ([issue #1](https://github.com/tdyin/learner-kit/issues/1)) to the evidence recorded in [smoke-checks.md](smoke-checks.md). Check IDs (PR3, DG1, …) refer to the tables there.

**Status: not yet complete.** The final pass at `4c3520e` recorded 30 of 33 checks passing. Fixes for LN5, LN6 and RV1 are pushed but not yet rerun. Do not declare the release complete until those reruns pass.

## Hosts and runs

| Run | Host / model | Date | Skill version |
|---|---|---|---|
| Install and discovery | Codex CLI 0.159.3 on Linux, no model | 2026-10-01 | `4182e4f`, `19321d0`, `15a1c28`, `main` |
| `lk-coach` checks | Codex CLI 0.159.3 on Windows 11, gpt-6-astra (medium) | 2026-09-30 | `a8ed595`, rerun at `7e7731b` |
| Issues #3–#5 checks, 4 rounds | Codex CLI 0.159.3 on Windows 11, gpt-5.6-terra (medium) | 2026-10-01 | `19150f7` → `a45e841` → `e85eb1d` → `bd99a65` |
| Final pass, including `lk-learn` | Codex CLI 0.159.3 on Windows 11, gpt-5.6-terra (medium) | 2026-10-01 | `4c3520e` |
| Reruns after the final pass | — | — | Not run |

## Independent use (one skill installed, fresh session)

| Skill | Spec scenario | Evidence | Status |
|---|---|---|---|
| `lk-explore` | Unfamiliar topic → concise map and starting point | EX1, EX2 | Pass (`4c3520e`) |
| `lk-explain` | Heat vs temperature → accurate distinction and example | EP1 | Pass (`4c3520e`) |
| `lk-practice` | Energy-balance task; waits; answer-specific feedback | PR1–PR5 | Pass (`bd99a65`, `e85eb1d`) |
| `lk-diagnose` | Sign-error solution → explanation tied to the answer | DG1 | Pass (`a45e841`) |
| `lk-coach` | Homework without an attempt → useful start, no onboarding | Check 1 | Pass (`a8ed595`; skill unchanged since `7e7731b`) |
| `lk-recall` | Notes → one question; feedback only after the answer | RC1 | Pass (`4c3520e`) |
| `lk-transfer` | Familiar problem → one meaningful change and an invitation to attempt | TR1 | Pass (`bd99a65`). A later setup-only TR1 run produced an unreachable final state; fix pushed, rerun pending. |
| `lk-review` | Notes in a fresh chat → review without a profile | RV1 | Partial: borderline Fail at `4c3520e` on item labels; fix pushed, rerun pending |
| `lk-learn` | Goal and short time budget → manageable interactive sequence, no companions | LN1, LN8 | Pass (`4c3520e`) |

## Shared checks from the spec

| Spec check | Evidence | Status |
|---|---|---|
| Install one skill and all nine from the README; available outside the repo | Install tables for issues #2, #3–#5 and #6; the tester's real-host installs | Pass. Linux (no model), and the tester's Windows host at `4c3520e` (all nine with one `--path`, all explicit-only). |
| `lk-` names; explicit invocation selects the intended skill; matching requests don't load it | `lk-coach` checks 1–2; PR6; X3 | Pass. Includes LN9, and `$lk-review`/`$lk-learn` each loading only the selected skill with all nine installed (`4c3520e`). |
| Continuation after selection; context kept across optional transitions | `lk-coach` check 3; X1; X2 | Pass |
| Correct answer | `lk-coach` check 11; PR2; DG3 | Pass |
| Ambiguous answer | PR4; DG4 | Pass |
| Bounded hint | `lk-coach` check 4; PR5 | Pass |
| Two unsuccessful coached retries → fallback | `lk-coach` check 5 (after fix) | Partial. Passed for `lk-coach`; **LN5 failed** at `4c3520e` (stated the answer). Fix pushed, rerun pending. |
| Full solution before an attempt | `lk-coach` check 6; DG6; TR4 | Pass |
| Skip; stop | `lk-coach` checks 7–8; PR5; EP5; RC4 | Pass |
| Successful coached retry; truthful recap | `lk-coach` check 9; RC4; RV4; LN6 | Partial. Passed elsewhere; **LN6 failed** at `4c3520e` (recap didn't separate the initial attempt from the retries). Fix pushed, rerun pending. |
| Absent history | RV2 | Pass (`4c3520e`) |
| Missing companion; declined handoff | X1; X2 | Pass (`e85eb1d`) |
| Likely erroneous notes | EP2, EP3, RC3, RV1, LN7 | Partial. Passed in these checks, but in the all-nine `$lk-learn` run at `4c3520e`, `lk-learn` flagged only line 3. Fix pushed, rerun pending. |
| Conceptual or argumentative answer | EP4 | Pass (`4c3520e`) |
| `lk-learn` routine transitions without prompts; asks before a goal change or difficulty jump | LN2–LN4 | Pass (`4c3520e`) |
| Homework help without course-rule questions; conflict with a stated limit → clarify | `lk-coach` checks 1 and 10 | Pass |
| Example answers checked against references | `examples/thermodynamics.md` (recomputed in Python; sources, units and sign conventions recorded) | Pass |

## Blocking conditions (from the spec)

| Condition | Current state |
|---|---|
| Broken installation | None observed |
| Missing or unusable skill | None. All nine present, valid and usable at `4c3520e`. |
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
