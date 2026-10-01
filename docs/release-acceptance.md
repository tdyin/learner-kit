# Release 1 acceptance record

This maps each acceptance check in the release spec ([issue #1](https://github.com/tdyin/learner-kit/issues/1)) to the evidence recorded in [smoke-checks.md](smoke-checks.md). Check IDs (PR3, DG1, …) refer to the tables there.

**Status: every release check has a recorded pass, and no blocking condition was observed.** TR1 was rerun on the final `lk-transfer` wording at `cfeb469` and passed, along with a non-physics transfer check. The final pass at `4c3520e` passed 30 of 33 checks. The three failures (LN5, LN6, RV1), along with the related LN7, all-nine `$lk-learn`, X3 and TR1 checks, were fixed and passed at `56520ea`.

**Caveat:** `lk-learn`, `lk-review` and `lk-transfer` changed at `56520ea`. LN1–LN4, LN8, LN9, RV2–RV4 and TR2–TR4 passed on the earlier wording at `4c3520e` and were not repeated. The edits only touched retry fallback, recaps, note checking, item labels and well-posed variations.

## Hosts and runs

| Run | Host / model | Date | Skill version |
|---|---|---|---|
| Install and discovery | Codex CLI 0.159.3 on Linux, no model | 2026-10-01 | `4182e4f`, `19321d0`, `15a1c28`, `main` |
| `lk-coach` checks | Codex CLI 0.159.3 on Windows 11, gpt-6-astra (medium) | 2026-09-30 | `a8ed595`, rerun at `7e7731b` |
| Issues #3–#5 checks, 4 rounds | Codex CLI 0.159.3 on Windows 11, gpt-5.6-terra (medium) | 2026-10-01 | `19150f7` → `a45e841` → `e85eb1d` → `bd99a65` |
| Final pass, including `lk-learn` | Codex CLI 0.159.3 on Windows 11, gpt-5.6-terra (medium) | 2026-10-01 | `4c3520e` |
| Reruns after the final pass | Codex CLI 0.159.3 on Windows 11, gpt-5.6-terra (medium) | 2026-10-01 | `56520ea` |

## Independent use (one skill installed, fresh session)

| Skill | Spec scenario | Evidence | Status |
|---|---|---|---|
| `lk-explore` | Unfamiliar topic → concise map and starting point | EX1, EX2 | Pass (`4c3520e`) |
| `lk-explain` | Heat vs temperature → accurate distinction and example | EP1 | Pass (`4c3520e`) |
| `lk-practice` | Energy-balance task; waits; answer-specific feedback | PR1–PR5 | Pass (`bd99a65`, `e85eb1d`) |
| `lk-diagnose` | Sign-error solution → explanation tied to the answer | DG1 | Pass (`a45e841`) |
| `lk-coach` | Homework without an attempt → useful start, no onboarding | Check 1 | Pass (`a8ed595`; skill unchanged since `7e7731b`) |
| `lk-recall` | Notes → one question; feedback only after the answer | RC1 | Pass (`4c3520e`) |
| `lk-transfer` | Familiar problem → one meaningful change and an invitation to attempt | TR1 | Pass (`cfeb469`, final wording); a non-physics variation also passed |
| `lk-review` | Notes in a fresh chat → review without a profile | RV1 | Pass (`56520ea`) |
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
| Two unsuccessful coached retries → fallback | `lk-coach` check 5 (after fix) | Pass. `lk-coach` check 5, and LN5 at `56520ea` |
| Full solution before an attempt | `lk-coach` check 6; DG6; TR4 | Pass |
| Skip; stop | `lk-coach` checks 7–8; PR5; EP5; RC4 | Pass |
| Successful coached retry; truthful recap | `lk-coach` check 9; RC4; RV4; LN6 | Pass. Includes LN6 at `56520ea` |
| Absent history | RV2 | Pass (`4c3520e`) |
| Missing companion; declined handoff | X1; X2 | Pass (`e85eb1d`) |
| Likely erroneous notes | EP2, EP3, RC3, RV1, LN7 | Pass. Includes LN7 and the all-nine `$lk-learn` check at `56520ea` |
| Conceptual or argumentative answer | EP4 | Pass (`4c3520e`) |
| `lk-learn` routine transitions without prompts; asks before a goal change or difficulty jump | LN2–LN4 | Pass (`4c3520e`) |
| Homework help without course-rule questions; conflict with a stated limit → clarify | `lk-coach` checks 1 and 10 | Pass |
| Example answers checked against references | `examples/thermodynamics.md` (recomputed in Python; sources, units and sign conventions recorded) | Pass. The concept-note rule on isothermal expansion was corrected for #11: heat is absorbed only when the gas does positive work, and free expansion is a counterexample. No problem answer changed. |

## Blocking conditions (from the spec)

| Condition | Current state |
|---|---|
| Broken installation | None observed |
| Missing or unusable skill | None. All nine present, valid and usable at `4c3520e`. |
| Known incorrect reference answers | None known |
| Fabricated learner evidence | None in the recorded runs after fixes. Tester-written learner answers are recorded as such. |
| Full answer disclosed during a hint check | None (`lk-coach` check 4, PR5) |
| Ignored stop request | None |

## Reference set

`examples/thermodynamics.md` has concept notes, five problems (P1–P5) with expected reasoning and answers, common mistakes, a transfer variant (P5), sources, units and sign conventions, plus the short non-numerical argument. Learner-facing statements are kept separate from the solutions.

## Out of scope and known limits

- Verified in Codex only, mostly on thermodynamics material. Other hosts, models and subjects are untested.
- These manual checks show observed basic behavior. They do not show deterministic adherence or improved learning outcomes.
- Some behaviors needed wording fixes before the model followed them reliably (for example generated-task labels). A single pass does not guarantee the behavior on every run.
