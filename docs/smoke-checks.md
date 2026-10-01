# Smoke checks

Manual checks of learner-visible behavior in the supported host (Codex). These checks show observed basic behavior. They do not show deterministic adherence or better learning outcomes.

Status values: **Pass**, **Fail** (followed by a fix and a rerun), **Not run** (with the reason).

## lk-coach: installation and discovery

- **Host:** Codex CLI 0.159.3 (`@openai/codex` from npm) on Linux, in a cloud container
- **Date:** 2026-10-01
- **Model:** none (these checks don't call a model)
- **Source:** the package was installed from branch `claude/happy-davinci-33kg6r`. After merge, the README commands use `main`.

| Scenario | Method | Observed result | Status |
|---|---|---|---|
| Package passes Codex's skill format check | `~/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/lk-coach` | `Skill is valid!` | Pass |
| Single-skill install with the existing installer | `install-skill-from-github.py --repo tdyin/learner-kit --path skills/lk-coach --ref <branch>` into a fresh `CODEX_HOME` | `Installed lk-coach to $CODEX_HOME/skills/lk-coach`. Both `SKILL.md` and `agents/openai.yaml` were copied. | Pass |
| Discovered user-wide, outside the repository | `codex app-server` `skills/list` with `cwd` set to an empty directory outside the repo | `lk-coach` listed with `scope: "user"`, display name "Learner Kit: Coach", and its default prompt | Pass |
| Repo `skills/` folder is not auto-discovered | Same `skills/list` call with `cwd` set to the repo and an empty `CODEX_HOME` | Only Codex system skills were listed; `lk-coach` was absent | Pass (confirms that installation is required) |
| Reinstall over an existing copy | Ran the installer a second time into the same `CODEX_HOME` | `Destination already exists`; nothing was overwritten | Pass (documented in README) |
| `--url` form with a branch name that contains `/` | `--url https://github.com/tdyin/learner-kit/tree/claude/happy-davinci-33kg6r/skills/lk-coach` | Install failed, because the installer cannot tell where a branch name with slashes ends | Not applicable to users. Re-check `--url .../tree/main/...` after merge. |

## lk-coach: conversation behavior

- **Host:** Codex CLI 0.159.3 on Windows 11 Pro 10.0.26200, run by a local agent through `codex exec --json` and `codex exec resume`, from a scratch directory outside any repo
- **Model:** gpt-6-astra, reasoning effort medium (from the Codex session file)
- **Date:** 2026-09-30
- **Install:** `install-skill-from-github.py --repo tdyin/learner-kit --path skills/lk-coach --ref claude/happy-davinci-33kg6r` printed `Installed lk-coach to ~/.codex/skills/lk-coach` on the first try. Both `SKILL.md` and `agents/openai.yaml` were present, with `allow_implicit_invocation: false`.
- **Environment:** no other user skills were installed. Cached plugin skills existed, but the one with a teaching skill was not enabled. The `codex-bridge` plugin (prompt-submit and stop hooks) was enabled; the run noted no effect from it. Checks 3 and 4 hit websocket reconnects but both completed.
- **Skill version:** commit `a8ed595`

Problems P1 and P2 come from [examples/thermodynamics.md](../examples/thermodynamics.md).

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| 1 | Explicit selection | `$lk-coach` + P2 + "I don't know where to start." | Useful starting help right away. No onboarding, no course-rule questions, no demand for an attempt. | Read `lk-coach/SKILL.md` and gave the governing idea: "an ideal gas's internal energy depends only on its temperature… what do you think ΔU is?" Asked one question, with no onboarding or rules questions. | Pass |
| 2 | No implicit loading | New session, no `$`: "Help me with this thermo homework: <P2>" | `lk-coach` is not loaded; Codex answers normally | No read of `lk-coach/SKILL.md`. Normal Codex reply with a full worked solution (ΔU = 0, W = −3.46 kJ as work on the gas, Q = +3.46 kJ). | Pass |
| 3 | Follow-up continuation | Continue #1: "I think ΔU is zero because the temperature doesn't change?" | Coaching continues without re-selection | "Yes—ΔU = 0 because… Next, find the work…" It gave W = nRT ln(Vf/Vi) and asked the learner to substitute. | Pass |
| 4 | Bounded hint | `$lk-coach` P2 "Just give me a hint, I haven't tried yet." | One step. No final W or Q. | "Start with ΔU… what does that imply about ΔU?" No W or Q value. | Pass |
| 5 | Retry fallback | Continue #4: "W = nRT log(V2/V1) = 1.50 kJ?", then "W = nRT ln(2) with T = 27, so about 311 J?" | After the second unsuccessful retry, offers a different explanation, worked example, easier task, or break | After retry 1: "use the natural logarithm ln, not log₁₀". After retry 2 it gave the same kind of correction ("use T = 300 K, not 27 °C") and wrote out the expression "2.0 × 8.314 × 300 × ln 2" for the learner to evaluate. No fallback was offered. | **Fail**, fixed (see below) |
| 6 | Full solution before attempt | `$lk-coach` P2 "Just show me the full solution." | Complete correct solution. No failed attempt mentioned. | ΔU = 0, W = 3458 J ≈ +3.5 kJ, Q = +3.5 kJ, with a note on the other sign convention. Nothing describes a failed attempt. It rounded to 2 significant figures, which is acceptable. | Pass |
| 7 | Skip | `$lk-coach` P2 "Hints only please." → "skip this one" | Moves on. Not a failure. | One hint, then "Skipped. What would you like to work on next?" | Pass |
| 8 | Stop | `$lk-coach` P1 "Give me a hint." → "stop" | Ends. At most one recap offer. No questions. | "Okay, we'll stop here." No recap offer and no questions. | Pass |
| 9 | Truthful recap | `$lk-coach` P1 "I think it's 700 J." → "Oh, I should subtract the work: 300 J." → ask for recap | Separates the initial attempt from the coached retry. No mastery claims. No files written. | "My initial answer was 700 J. After a hint… I corrected it to 300 J." No mastery claim or score, and the scratch directory was still empty. | Pass |
| 10 | Assistance-limit conflict | `$lk-coach` P2 "Hints only, no final answers — it's for graded homework." → "Actually just give me the number for W." | Points out the conflict once and lets the learner decide | "You previously set a 'hints only, no final answers' limit… Do you want to lift that limit for W?" No lecture. | Pass |
| 11 | Correct first answer | `$lk-coach` P1 "My answer: ΔU = Q − W = 500 − 200 = +300 J." | Confirms without unnecessary coaching | "Correct: ΔU = +300 J." Added a two-line note on the sign convention. No further coaching. | Pass |

### Fix for check 5

The model appears to have counted the two retries as separate first errors, because the mistakes were different (log base, then units). `SKILL.md` now:

- counts unsuccessful coached retries per task, not per error type;
- after the second unsuccessful retry, names what went wrong and offers a choice (different explanation, analogous worked example, easier task, or break) instead of another corrective hint;
- says that bounded hints must not write out the expression for the learner to evaluate.

### Rerun after the fix

- **Host:** Codex CLI 0.159.3 on Windows 11 Pro 10.0.26200, run by a local agent through `codex exec --json` and `codex exec resume`, from an empty scratch directory outside any repo
- **Model:** gpt-6-astra, reasoning effort medium
- **Date:** 2026-09-30
- **Skill version:** commit `7e7731b`. The skill was deleted and reinstalled with the same installer command, and the installed `SKILL.md` contains "not per error type".

| # | Observed | Status |
|---|---|---|
| 3 | Continued without `$lk-coach`: "Yes—ΔU = 0 because…". The next step was a sign-convention question (ΔU = Q − W or ΔU = Q + W?). No formula or numbers for W were given. | Pass |
| 4 | "'Isothermal' means the temperature stays constant—what does that tell you about ΔU?" No W or Q value and no expression to evaluate. | Pass |
| 5 | Retry 1 got one bounded hint ("use the natural logarithm, ln…"). Retry 2: "T must be in kelvin: use 300 K, not 27 °C. Would you prefer a different explanation of why kelvin is needed, an analogous worked example, an easier task, or a break?" No expression and no answer; it waited for the learner. | Pass |

Notes:

- In check 4 the session file shows that the skill body was injected as a `<skill>` block rather than read with a shell command. The skill was still loaded.
- In check 5, naming the mistake ("use 300 K") also states the fix. The rule allows that, because the reply gives no calculation or answer.
- The sign-convention question in check 3 is about the physics content, not course rules about assistance, so it doesn't conflict with the homework rule.

All 11 conversation checks now pass on the current skill: checks 1, 2 and 6–11 from the first run, and checks 3–5 from the rerun.

## Open issues

- None blocking. Recheck the `--url .../tree/main/...` install form after merge.

## lk-practice, lk-diagnose, lk-explore, lk-explain, lk-recall, lk-transfer, lk-review: installation and discovery

- **Host:** Codex CLI 0.159.3 (`@openai/codex` from npm) on Linux, in a cloud container
- **Date:** 2026-10-01
- **Model:** none (these checks don't call a model)
- **Source:** branch `claude/happy-davinci-33kg6r` at commit `19321d0`

| Scenario | Method | Observed result | Status |
|---|---|---|---|
| All packages pass Codex's skill format check | `quick_validate.py` on each `skills/lk-*` directory | `Skill is valid!` for all eight | Pass |
| Each new skill installs alone | `install-skill-from-github.py --path skills/<name>` into a separate, fresh `CODEX_HOME` for each of the seven | `Installed <name>` each time | Pass |
| All eight install together | One installer run with eight `--path` values into a fresh `CODEX_HOME` | Eight directories installed, each with `agents/openai.yaml` | Pass |
| Discovered user-wide, outside the repo | `codex app-server` `skills/list` from an empty directory outside the repo | With all eight installed, all were listed with `scope: "user"` and their "Learner Kit: …" display names. With only `lk-review` installed, only `lk-review` was listed. | Pass |

## Conversation behavior: issues #3, #4, #5

**Not run yet.** These need a logged-in Codex session. Run each check in a **fresh** session with **only the skill under test installed**, so companion skills are unavailable. Problems, notes and prompts are in [examples/thermodynamics.md](../examples/thermodynamics.md). For every check: confirm the skill is selected only by `$name`, wait for real answers, and look for no fabricated learner work, no mastery claims, and no files written.

### lk-practice

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| PR1 | Energy-balance practice | `$lk-practice Give me a first-law energy-balance problem for a closed system, intro university level.` | One task, labelled as generated, with a success standard. It waits; no hint or solution. | | Not run |
| PR2 | Correct answer | Supply P3 and answer "+25 kJ: Q = −5 kJ, W = −30 kJ, ΔU = Q − W" | Brief confirmation, then offers another task, help or finishing | | Not run |
| PR3 | Partly correct / wrong answer | P3, answer "−35 kJ" | Feedback on the specific sign error. Credits the correct sign of Q. | | Not run |
| PR4 | Ambiguous answer | P3, answer "25" (no units or sign working) | Asks one clarifying question or notes what is missing; doesn't invent reasoning | | Not run |
| PR5 | Follow-up and controls | After PR1: "hint", then "skip", then "stop" | Bounded hint; the skip isn't a failure; stop ends the session | | Not run |
| PR6 | Explicit only | Fresh session, no `$`: "Give me a practice problem on the first law" | `lk-practice` not loaded | | Not run |

### lk-diagnose

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| DG1 | Sign-error diagnosis | `$lk-diagnose` + P4 + the supplied learner answer | Locates W = +800 J as the error, gives plausible causes tied to what was written, and asks at most two questions, one at a time | | Not run |
| DG2 | Missing reasoning | `$lk-diagnose` P4, "I got −1100 J, why is that wrong?" (no working) | Asks for the working. Doesn't invent the learner's steps. | | Not run |
| DG3 | Correct answer | `$lk-diagnose` P4, "ΔU = −300 − (−800) = +500 J" | Says it is correct; no diagnosis is invented | | Not run |
| DG4 | Ambiguous / alternative | `$lk-diagnose` P4, "ΔU = q + w = −300 + 800 = 500 J" | Recognizes the q + w convention as valid. No error claimed. | | Not run |
| DG5 | No lasting labels | Review DG1 output | No "you have a misconception about…" labels about the learner | | Not run |
| DG6 | Controls | After DG1: "just show me the full solution" | Gives it; not described as a failed attempt | | Not run |

### lk-explore

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| EX1 | Topic map | `$lk-explore Map out what I need to understand about introductory thermodynamics.` | 4–7 concepts, prerequisites, connections and a starting point. No onboarding. | | Not run |
| EX2 | Unfamiliar topic | `$lk-explore` on a non-physics topic (for example "Bayesian inference") | Concise map and a starting point | | Not run |
| EX3 | Redirect / stop | After EX1: "focus only on the second law", then "stop" | Adjusts the map; stop ends the session | | Not run |

### lk-explain

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| EP1 | Heat vs temperature | `$lk-explain Why are heat and temperature different?` | Accurate distinction with an example (see the checked explanation). Any check question waits for an answer. | | Not run |
| EP2 | Erroneous notes | `$lk-explain` + sample notes, "explain line 3 to me" | Flags line 3 as wrong with reasoning, and keeps the note's claim separate from the correction | | Not run |
| EP3 | Uncertain claim | `$lk-explain` + sample notes, "explain why copper's specific heat is 0.90 J/(g·K)" | Says the value looks like aluminium's and suggests checking; doesn't invent a citation | | Not run |
| EP4 | Non-numerical argument | `$lk-explain` + the conceptual example prompt | Identifies the second law with reasoning; no numerical rubric | | Not run |
| EP5 | Controls | After EP1: "simpler", then "stop" | Simplifies; stop ends the session | | Not run |

### lk-recall

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| RC1 | Note-based recall | `$lk-recall Quiz me from memory on these notes:` + sample notes | One question, drawn from the notes. Waits. Feedback only after the answer. | | Not run |
| RC2 | Reference agreement | `$lk-recall` + notes, without saying memory or notes | Asks once about memory vs notes (or assumes memory and says so) | | Not run |
| RC3 | Erroneous note | Continue RC1 until line 3 or 5 would be quizzed (or ask "quiz me on line 3") | Flags it instead of quizzing it as true | | Not run |
| RC4 | Don't remember / hint / stop | "I don't remember", then "hint" on the next item, then "stop" | Gives the answer briefly with no penalty; cue only for the hint; stop ends the session | | Not run |

### lk-transfer

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| TR1 | Transfer variation | `$lk-transfer` + P2 with its worked solution, "give me a variation" | One meaningful change (not just new numbers), with an invitation to attempt it. Doesn't reveal what changes. | | Not run |
| TR2 | Unaided attempt, then discussion | Answer TR1 by reusing the ln formula | Feedback on the attempt, then a discussion of what carries over and what changes | | Not run |
| TR3 | No source example | `$lk-transfer Help me apply what I know about energy balances somewhere new.` | Asks for a source example or establishes a simple one and labels it | | Not run |
| TR4 | Controls | "full solution" on TR1, then "stop" | Gives the solution; not a failed attempt; stop ends the session | | Not run |

### lk-review

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| RV1 | Fresh-chat review of notes | `$lk-review Review these notes with me before my exam:` + sample notes | Picks 3–5 ideas, mixes retrieval and practice, asks one item at a time, flags line 3 | | Not run |
| RV2 | Absent history | `$lk-review` with no material | Asks only what to review; no questions about past sessions | | Not run |
| RV3 | Pasted recap | `$lk-review` + a recap (for example "Recap: P1 first attempt 700 J, corrected to 300 J after a hint. Next: practise sign conventions.") | The recap names the problem only as "P1", so it asks one short question about which problem or topic that was, or stays clearly within that subject. Doesn't drift to another subject; doesn't invent other attempts. No due dates or claims about forgetting. | | Not run |
| RV4 | Summary | Finish RV1 | Summary separates unaided answers, helped answers and missed items. No scores or mastery claims. | | Not run |

### Cross-skill checks

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| X1 | Missing companion | Only `lk-practice` installed. After PR3 feedback: "Can we switch to $lk-diagnose for this?" | Says the skill isn't available here and keeps helping in `lk-practice`, using P3 and the learner's −35 kJ answer without asking for them again | | Not run |
| X2 | Declined handoff | Only `lk-diagnose` installed. After DG1: "Is there another Learner Kit skill that would help with this?" Then, after it suggests one: "no, keep going here" | Suggests a relevant `lk-` skill as optional. After the decline, it continues the diagnosis with the context intact and doesn't make the learner repeat anything. | | Not run |
| X3 | Correct selection with all installed | Install all eight; invoke `$lk-review` and then (fresh session) `$lk-recall` with the same notes | Each session runs the selected skill | | Not run |

### Results, first run (issues #3, #4, #5)

- **Host:** Codex CLI 0.159.3 on Windows 11 Pro 10.0.26200, logged in with ChatGPT. Run by a local agent through `codex exec --json`, `codex exec resume` and, for TR4, `codex exec fork` of the TR1 session.
- **Model:** gpt-5.6-terra, reasoning effort medium (from the session files)
- **Date:** 2026-10-01
- **Skill version:** commit `19150f7`. Only the skill under test was installed for each check; X3 had all eight installed. Every `$`-selected session showed a `<skill>` block for the selected skill. PR6 (no `$`) showed none. The scratch directory was still empty at the end.
- **Installer note:** repeating `--path` once per skill installs only the last one. The README now says to pass a single `--path` followed by all the skill paths.

| # | Observed (summary) | Status |
|---|---|---|
| PR1 | Generated task labelled "(made up)", with a success standard. It waited. | Pass |
| PR2 | "Correct: ΔU = +25 kJ." Offered another problem. | Pass |
| PR3 | "Not quite: ΔU = +25 kJ" followed by the full corrected solution. It never named the sign error or credited the correct Q. | **Fail** |
| PR4 | Marked a bare "25" correct and filled in the units and a convention the learner never stated | **Fail** |
| PR5 | Hint without values; "Skipped…"; "Stopped." | Pass |
| PR6 | Not loaded without `$`; plain Codex reply | Pass |
| DG1 | Located W = 800 J as the error, credited Q, gave a cause tied to what was written, and asked one question. It also stated +500 J before offering the choice in step 5 (see the fixes below). | Pass |
| DG2 | Asked for the sign setup and invented no steps | Pass |
| DG3 | "Your answer is correct … No error to diagnose." | Pass |
| DG4 | Accepted the q + w convention; no error claimed | Pass |
| DG5 | Described the answer, not the learner; no labels | Pass |
| DG6 | Gave the full solution; not described as a failed attempt | Pass |
| EX1 | Seven concepts, dependencies, starting point and first activity | Pass |
| EX2 | Bayesian inference map with a starting point | Pass |
| EX3 | Second-law re-map; "Stopped." | Pass |
| EP1 | Core distinction right, but one analogy lumped "Heat/thermal energy" together as a stored total | **Fail** (borderline) |
| EP2 | Flagged line 3 with reasoning; gave a corrected version separately | Pass |
| EP3 | Said 0.90 looks like aluminium and gave ≈0.385, but suggested no check and gave an inaccurate reason for copper's low specific heat (the established reason is the heavy atoms, ~3R per mole) | **Fail** |
| EP4 | Identified the second law (Kelvin–Planck); no numerical rubric | Pass |
| EP5 | Simpler version; "Stopped." | Pass |
| RC1 | Flagged lines 3 and 5, then asked one question and waited | Pass |
| RC2 | Asked memory or notes | Pass |
| RC3 | Quizzed the corrected version of line 3 instead | Pass |
| RC4 | "Don't remember" and hint handled well. On stop it gave an unrequested recap that called an unanswered item "completed". | **Fail** (borderline) |
| TR1 | One meaningful change (irreversible expansion); didn't reveal what changes | Pass |
| TR2 | Feedback, then what carried over and what changed | Pass |
| TR3 | Asked for a source example | Pass |
| TR4 | Full solution; not described as a failure; "Stopped." | Pass |
| RV1 | Picked five ideas and flagged line 3, but the plan didn't show a mix of retrieval and practice | **Fail** (borderline) |
| RV2 | Asked only what to review | Pass |
| RV3 | Used the recap with no invented attempts, but the first item drifted to the mechanics work–energy theorem | **Fail** (borderline) |
| RV4 | "Review ended." No summary. | **Fail** |
| X1 | Not run: no skill suggested a handoff, so there was nothing to accept. Redesigned so the learner asks to switch. | Not run |
| X2 | Not run: as for X1. Redesigned so the learner asks for a suggestion. | Not run |
| X3 | With all eight installed, `$lk-review` and `$lk-recall` each loaded only the selected skill | Pass |

### Fixes after the first run

- **`lk-practice` (PR3, PR4):**
  - Wrong answers get feedback that credits the correct parts and names the step and likely reason, not a full corrected solution.
  - Incomplete answers (missing sign, units or working that the success standard asks for) are not marked correct. The skill says what is missing and asks for it, without supplying it or a convention.
- **`lk-explain` (EP1, EP3):**
  - Analogies must be consistent with the distinction being taught.
  - Corrected values are given as approximate, with a suggestion to check a standard table or the source.
  - Causal explanations are given only when they are the established ones; otherwise the skill says it is unsure.
- **`lk-recall` (RC4):** on stop, end in one short reply and give a recap only if asked. The recap counts a question as answered only if the learner answered it.
- **`lk-review` (RV1, RV3, RV4):**
  - The plan labels each item as retrieval or practice and includes both when the material allows.
  - A pasted recap keeps items in its own subject and setting.
  - Ending with "finish", "done" or after the last item always produces the summary, including items that were not reached. "Stop" ends and offers the summary in one line.
- **`lk-diagnose` (DG1 note):** step 5 now says not to state the corrected final answer before the learner chooses how to proceed.
- **`lk-practice`, `lk-diagnose`, `lk-transfer`:** the stop rule now has the same wording as `lk-recall`: end in one reply and recap only if asked.
- **X1, X2:** redesigned so the learner triggers the handoff situation instead of waiting for the skill to suggest one.

**Rerun needed:** PR3, PR4, PR5 and PR2 (feedback rules changed); DG1 and DG6; EP1, EP2, EP3 and EP5; RC1 and RC4; RV1, RV3 and RV4; TR4 (stop wording); and X1, X2 (redesigned). Run them against the commit after `19150f7`.

### Rerun 1 after the fixes

- **Host / model:** same as the first run (Codex CLI 0.159.3, gpt-5.6-terra medium, Windows 11 Pro)
- **Date:** 2026-10-01
- **Skill version:** commit `a45e841`. Only the skill under test was installed each time; the installed `lk-review` contained the new summary rule. PR1 and TR1 were rerun only as setup for PR5 and TR4. X2 ran on a `codex exec fork` of the DG1 session.

| # | Observed (summary) | Status |
|---|---|---|
| PR2 | "Correct… ΔU = +25 kJ." Offered another problem. | Pass |
| PR3 | Named the sign error and invited a retry, but didn't credit the correct Q and handed over both signed values (in a different convention) for the retry | **Fail** (borderline) |
| PR4 | "Your magnitude is right: 25 kJ. To make it complete, state the sign, units, and energy-balance equation. Is your result ΔU = +25 kJ?" Nothing marked correct and no reasoning invented. The question proposes the sign itself, which is a minor issue. | Pass |
| PR5 | Hint without values; "Skipped…"; "Stopped." | Pass |
| DG1 | Credited Q, located W = +800 J and a likely cause, then offered the three choices. It did **not** state +500 J. | Pass |
| DG6 | Full solution; not described as a failed attempt | Pass |
| EP1 | Consistent analogy ("total thermal energy" against temperature) and an accurate distinction | Pass |
| EP2 | Flagged line 3 and gave a separate, better version | Pass |
| EP3 | Called line 5 "likely a transcription error" and gave ≈0.385 with a correct per-mole reason. It didn't mention aluminium or suggest checking a table or the source; it settled the question with its own web-search citation. | **Fail** |
| EP5 | Simpler version; "Stopped." | Pass |
| RC1 | Flagged lines 3 and 5, then asked one question and waited | Pass |
| RC4 | "Stopped. If you want, I can give a brief recap of what was asked." No unrequested recap. | Pass |
| TR4 | Full solution with what carried over and what changed; "Stopped." The generated TR1 task (P_ext = 1.00 atm) was not well-posed: the gas is still at about 2.46 atm at 20.0 L, so a stop would be needed. | Pass (task issue noted) |
| RV1 | The plan labels each item (retrieval or practice) and includes both; it flagged lines 3 and 5 and asked one item | Pass |
| RV3 | Drifted to mechanics again. The recap only says "P1", so the subject is genuinely unclear from the recap alone. | **Fail** |
| RV4 | A summary now appears ("no questions were answered"), but the asked-but-unanswered item was labelled "not reached" | **Fail** (borderline) |
| X1 | "`$lk-diagnose` isn't available in this session, but we can do the same focused diagnosis here." It used P3 and −35 kJ without asking for them again. | Pass |
| X2 | Suggested `$lk-coach` or `$lk-practice` as options. After "no, keep going here" it jumped to the full solution (+500 J) instead of returning to the pending choice. | **Fail** (borderline) |

### Fixes after rerun 1

- **`lk-practice` (PR3, PR4, TR1 note):**
  - Wrong answers start by saying explicitly what is right, then name the error. The corrected values are not handed over; the learner fixes the step in their own convention.
  - When something is missing, ask for it without proposing the value.
  - Generated tasks must be well-posed.
- **`lk-transfer` (TR1 note):** generated variations must be well-posed, for example with a stop when the external pressure is below the final gas pressure.
- **`lk-explain` (EP3):** if the source of the wrong value is recognisable (another substance, unit, typo), say so. Always end a correction by suggesting the learner confirm it in a table, their textbook or the note's source, even after finding a reference.
- **`lk-review` (RV3, RV4):**
  - If a recap doesn't make the subject clear, ask one short question instead of guessing. The RV3 expected result was updated to match.
  - Summary categories now separate "asked but not answered" from "not reached (never asked)".
- **All seven new skills (X2):** after a declined or unavailable handoff, pick up exactly where the conversation left off, repeating any pending question or choice. A decline is not a request for the answer.

**Rerun needed:** PR1, PR3, PR4, TR1, EP3, RV3, RV4, X1, X2. Run them against the commit after `a45e841`.

### Rerun 2

- **Host / model:** same as before (Codex CLI 0.159.3, gpt-5.6-terra medium, Windows 11 Pro)
- **Date:** 2026-10-01
- **Skill version:** commit `e85eb1d`. Only the skill under test was installed each time. RV1 and DG1 were run only as setup for RV4 and X2; X2 ran on a fork of DG1.

| # | Observed (summary) | Status |
|---|---|---|
| PR1 | One physically consistent task (rigid tank, so W = 0) with a success standard; it waited. It was **not labelled as generated**. | **Fail** |
| PR3 | "Your heat term is right: Q = −5 kJ…" Named the sign error and invited a retry, with no values handed over. | Pass |
| PR4 | Noted the missing sign, units and equation, and asked "What is your signed value of ΔU…?" without proposing one | Pass |
| TR1 | Physically consistent variation (P_ext = 249 kPa = P_final; it equilibrates at 20.0 L). But there was no explicit invitation to attempt it, and the success standard ("use a physically consistent work expression") hinted at what changes. | **Fail** (borderline) |
| EP3 | "0.90 J/(g·K) is closer to aluminum… Confirm the value… in its data table or textbook." The reason given (heavier atoms) is correct. | Pass |
| RV3 | "The recap… doesn't identify the subject yet… What subject/topic was P1 about?" | Pass |
| RV4 | "Only the first-law sign-convention question was asked, and it was not answered; the other planned ideas were not reached." | Pass |
| X1 | "`$lk-diagnose` isn't available… I can diagnose it here." It continued with P3 and its context. | Pass |
| X2 | After "no, keep going here" it returned to the pending three-way choice, with no solution and no +500 J | Pass |

Setup-only observation: RV1 didn't flag line 3 before its first question this time; the correction appeared only in the RV4 summary.

### Fixes after rerun 2

- **`lk-practice` (PR1):** generated tasks start with the label "Practice problem (generated):".
- **`lk-transfer` (TR1):**
  - The variation is labelled as generated.
  - The success standard describes only the form of a complete answer and must not hint at the changed method.
  - The message ends with an explicit invitation such as "Try it unaided first. What do you get?"
- **`lk-review` (RV1 observation):** likely errors in the notes are flagged when the plan is presented, before the first item.

**Rerun needed:** PR1, TR1, RV1. Run them against the commit after `e85eb1d`.

