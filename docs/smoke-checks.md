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

**How to run these checks.** They need a logged-in Codex session. Results for each run, and the fixes made between runs, are recorded at the end of this section. Run each check in a **fresh** session with **only the skill under test installed**, so companion skills are unavailable. Problems, notes and prompts are in [examples/thermodynamics.md](../examples/thermodynamics.md). For every check: confirm the skill is selected only by `$name`, wait for real answers, and look for no fabricated learner work, no mastery claims, and no files written.

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

### Rerun 3

- **Host / model:** same as before (Codex CLI 0.159.3, gpt-5.6-terra medium, Windows 11 Pro)
- **Date:** 2026-10-01
- **Skill version:** commit `bd99a65`. Only the skill under test was installed each time.

| # | Observed (summary) | Status |
|---|---|---|
| PR1 | Starts with "Practice problem (generated):"; physically consistent; gives a success standard and waits | Pass |
| TR1 | "Generated variation — change: reversible → irreversible", with P_ext = 150 kPa and a mechanical stop at 20.0 L (consistent; W = 1.50 kJ). The success standard covers only the form of the answer, and the message ends "Try it unaided first. What do you get?" | Pass |
| RV1 | Flags lines 3 and 5 before the first item; the plan mixes retrieval with a calculation; it asks one item | Pass |

### Status for issues #3, #4, #5

Every check now has a recorded Pass on at least one run.

The latest skill wording at `bd99a65` was not rerun in full. Checks that passed on earlier runs were not repeated after later edits touched shared sections of their skills:
- the stop wording;
- the instruction to return to a pending question after a declined handoff.

Those checks are EX1–3, EP1–2, EP4–5, RC1–3, DG2–5, TR2–3, RV2 and X3.

If a fully current record is needed before closing the issues, do one full pass at the final commit.


**Change after rerun 3:** a review comment led to `lk-review` labelling each item "(from your notes)" or "(generated)". RV1–RV4 have not been rerun since this change.

## Issue #6: lk-learn and full-release installation

### Installation and discovery

- **Host:** Codex CLI 0.159.3 (`@openai/codex` from npm) on Linux, in a cloud container
- **Date:** 2026-10-01
- **Model:** none (these checks don't call a model)
- **Source:** branch `claude/happy-davinci-33kg6r` at `15a1c28`, and `main` for the `--url` form

| Scenario | Method | Observed result | Status |
|---|---|---|---|
| `lk-learn` passes Codex's skill format check | `quick_validate.py skills/lk-learn` | `Skill is valid!` | Pass |
| `lk-learn` installs alone from a clean start | Installer with `--path skills/lk-learn` into an empty `CODEX_HOME` | Installed; `openai.yaml` present with `allow_implicit_invocation: false` | Pass |
| All nine install from a clean start | One installer run with one `--path` followed by the nine skill paths, into an empty `CODEX_HOME` | Nine directories installed, all nine with `allow_implicit_invocation: false` | Pass |
| `--url` install form from `main` | `--url https://github.com/tdyin/learner-kit/tree/main/skills/lk-coach` | Installed `lk-coach` | Pass (resolves the open item from issue #2) |
| Discovered user-wide, outside the repo | `codex app-server` `skills/list` from an empty directory outside the repo | With `lk-learn` only: `lk-learn:user`. With all nine: all nine listed with `scope: "user"`. | Pass |

### lk-learn conversation checks

Run each check in a fresh session with **only `lk-learn` installed**, so all eight companions are unavailable. Unless a check gives the learner's reply, the tester may write a short, correct learner answer to the skill's question. Write that answer before reading anything that would give it away, and record it.

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| LN1 | Goal and time | `$lk-learn Help me learn first-law energy balances in 30 minutes. I've done intro mechanics but no thermodynamics.` | A 3–5 step plan that fits 30 minutes. Starts step 1 in the same message. At most one question; no onboarding questionnaire. | | Not run |
| LN2 | Routine transitions | Continue LN1, answering the next two questions correctly | Moves to the next step with a one-line description of what's next. No "shall we continue?" permission prompts. | | Not run |
| LN3 | Goal change needs agreement | Continue LN2: "How does this relate to entropy?" | Answers briefly, then asks before adding entropy to the plan or changing the goal. Doesn't switch on its own. | | Not run |
| LN4 | Learner override | Continue: "Skip the recall check and give me a harder problem." | Skips the recall step and gives a harder problem labelled "Practice problem (generated):". No pushback. | | Not run |
| LN5 | Wrong answers and retry fallback | New session (LN1 prompt). On the first practice task, give a wrong answer, then two more wrong answers after help. | Feedback names the error. After the second unsuccessful coached retry, offers a different explanation, worked example, easier task or break, without another corrective hint. | | Not run |
| LN6 | Stop and truthful recap | Continue LN5: "stop", then "Give me a recap I can paste into a new chat." | Stop ends in one reply, with no unrequested recap. The recap separates the initial attempt from the coached retries and lists steps not reached. No mastery claims, and no files written. | | Not run |
| LN7 | Supplied notes with errors | `$lk-learn Help me learn this in 20 minutes:` + the sample notes from `examples/thermodynamics.md` | The plan uses the notes and flags lines 3 and 5 with reasoning before teaching them | | Not run |
| LN8 | Standalone, no companions | Review LN1–LN7 | No attempt to load another skill. Any `lk-` suggestion is optional, and the session continues when it's declined or the skill is unavailable. | | Not run |
| LN9 | Explicit only | Fresh session, no `$`: "Help me learn first-law energy balances in 30 minutes." | `lk-learn` not loaded | | Not run |

### Final pass at the release commit

Run these at the final commit, so every skill has a recorded result on its final wording:

- **All nine installed:** one install run using the README command. Then `$lk-review` and `$lk-learn` in fresh sessions with the same notes, checking that each selects the intended skill (spec #1 calls these two out).
- **lk-learn:** LN1–LN9.
- **Checks not rerun after their skill's later edits:** EX1–EX3, EP1, EP2, EP4, EP5, RC1–RC3, DG2–DG5, TR2, TR3, RV1–RV4 and X3.

The `lk-coach` checks (1–11) stay valid: `skills/lk-coach` has not changed since `7e7731b`, where checks 3–5 were rerun.

### Final pass results

- **Host:** Codex CLI 0.159.3 on Windows 11 Pro 10.0.26200, logged in with ChatGPT
- **Model:** gpt-5.6-terra, reasoning effort medium
- **Date:** 2026-10-01
- **Skill version:** commit `4c3520e`. Single-skill checks had only the skill under test installed. X3 had the eight original skills. The all-nine checks used the README command with `--ref` for this branch.
- **Install note:** the README command has no `--ref`, so it installs from `main`. That is correct once this PR is merged. Before then, `main` has no `skills/lk-learn`.
- **Skill loading:** every `$`-selected session showed a `<skill>` block for the selected skill only. LN9 showed none.
- **Files:** no Learner Kit session wrote files. In LN9 (plain Codex, no Learner Kit skill), Codex's bundled visualize plugin wrote an HTML file into the working directory. Anyone repeating a "no files written" check should keep plain-Codex sessions separate.

| # | Observed (summary) | Status |
|---|---|---|
| LN1 | A four-step 30-minute plan; started step 1 in the same message and ended with one question | Pass |
| LN2 | "Correct… Next: …" twice; no permission prompts | Pass |
| LN3 | "It's outside our 30-minute first-law plan. Would you like a brief 3-minute bridge to entropy now, or finish the energy-balance practice first?" | Pass |
| LN4 | Skipped recall; gave a harder problem labelled "Practice problem (generated):" | Pass |
| LN5 | Named the errors after the initial attempt and retry 1. After the second unsuccessful retry it **stated ΔU = −120 kJ** and chose an easier task itself, with no choice offered. | **Fail** |
| LN6 | Stop gave "Session stopped." with no unrequested recap. The recap listed help topics and the correct result, but **didn't separate the initial attempt from the two unsuccessful coached retries**, and left out the unanswered easier task. | **Fail** |
| LN7 | Flagged lines 3 and 5 with reasoning before teaching | Pass |
| LN8 | No attempt to load another skill and no `lk-` suggestions across 13 turns | Pass |
| LN9 | Not loaded without `$` | Pass |
| EX1–EX3 | Seven-concept maps with starting points; second-law re-map; "Stopped." | Pass |
| EP1, EP2, EP4, EP5 | Accurate heat vs temperature; line 3 flagged with a suggestion to confirm; second law identified; simpler version; "Stopped." | Pass |
| RC1–RC3 | Line 3 flagged; one question at a time; memory or notes asked; quizzed the corrected version of line 3 | Pass |
| DG2–DG5 | Asked for missing working; confirmed correct answers in both conventions; no learner labels | Pass |
| TR2, TR3 | What carries over and what changes discussed; asked for a source example | Pass |
| RV1 | Plan, flags and one-at-a-time all met, but a calculation with made-up numbers was labelled "retrieval (from your notes)" | **Fail** (borderline) |
| RV2–RV4 | Asked what to review; asked what "P1" was; summary separated "asked but not answered" from "not reached" | Pass |
| X3 | Eight installed: `$lk-review` and `$lk-recall` each loaded only the selected skill | Pass |
| All-nine install | Nine directories, all with `allow_implicit_invocation: false` | Pass |
| All-nine `$lk-review` | Loaded only `lk-review`; flagged lines 3 and 5 | Pass |
| All-nine `$lk-learn` | Loaded only `lk-learn` (the selection check passed), but flagged only line 3 and not line 5 | Pass (selection); note-flagging gap |

Setup-only observation: TR1 (run only as setup for TR2) again generated a variation without a mechanical stop, so the stated final state wasn't reachable. The skill corrected itself in TR2.

### Fixes after the final pass

- **`lk-learn` (LN5):** after the second unsuccessful coached retry, it must not state the correct value or pick the next step. It names what went wrong without the answer, offers the four options, and waits.
- **`lk-learn` (LN6):** the recap reports, for each task, the initial answer, the number and outcome of coached retries, the help given, and whether the task was finished, skipped or left unanswered.
- **`lk-learn` (all-nine note-flagging gap):** it checks every line of supplied notes before planning and flags each likely error before teaching from it.
- **`lk-review` (RV1):** "(from your notes)" only when the question restates the material; anything with made-up numbers, scenarios or wording is "(generated)". Calculate or apply means practice; recall means retrieval.
- **`lk-transfer` (TR1 observation):** before presenting a variation, work out the final state the givens imply, and add a constraint or change the givens if it doesn't match.

**Rerun needed:** LN5, LN6, LN7, the all-nine `$lk-learn` check with the sample notes, RV1, X3 (`lk-review` labels), and TR1. Run them against the commit after `4c3520e`.

### Rerun after the final pass

- **Host / model:** same as the final pass (Codex CLI 0.159.3, gpt-5.6-terra medium, Windows 11 Pro)
- **Date:** 2026-10-01
- **Skill version:** commit `56520ea`. Single-skill checks had only the skill under test installed. All nine were installed with the README command plus `--ref`. X3 had the eight original skills, and only its `$lk-review` half was run. The scratch directory was still empty at the end.
- **Learner answers:** LN5 reused the previous wrong answers with the unit changed (the task matched last run's, in J): initial "Q = +120 J, W = 0, ΔU = +120 J"; retry 1 "Q = −120 J, W = −120 J, ΔU = 0"; retry 2 "Q = −120 J, W = 0, ΔU = +120 J".

| # | Observed (summary) | Status |
|---|---|---|
| LN5 | After retry 2: "That was your second coached retry on this task, so I won't give another corrective hint or the final value. Choose one: a different explanation, an analogous worked example, an easier task, or a short break." No value stated; it waited. Its one-line "what went wrong" strongly implies the sign of ΔU, which is within the rule but close to it. | Pass |
| LN6 | "Stopped." with no recap. The recap gives the initial answer and both coached retries, each marked incorrect, notes the task was "left unfinished after the second coached retry", and lists steps not reached. No mastery claims, no files. | Pass |
| LN7 | Flagged line 3 and line 5 ("0.90 is roughly aluminum") before teaching | Pass |
| All-nine `$lk-learn` + notes | Only `lk-learn` loaded; lines 3 and 5 both flagged under "Corrections to the supplied material" | Pass |
| RV1 | Flagged notes 3 and 5 first; each plan item typed correctly as retrieval or practice; the first item is a real recall question correctly labelled "(from your notes)". A "(generated)" item was not reached without scripted learner answers. | Pass |
| X3 (`$lk-review`, eight installed) | Only `lk-review` loaded; types labelled correctly; the first item restates notes 1 and 6 and is labelled "(from your notes)" | Pass |
| TR1 | "Generated variation — change: reversible → irreversible", with P_ext = 249 kPa = P_final, so the final state at 20.0 L is reachable. The success standard has no hint, and it ends "Try it unaided first. What do you get?" | Pass |

**Change after the reruns:** a review comment pointed out that `lk-transfer`'s final-state check assumed every task has a physical end state. The rule now applies a general well-posedness check (consistent givens, enough information, a defensible answer), and works out the implied outcome only when the task specifies a process or end state. TR1 passed at `56520ea` on the previous wording and has not been rerun.

### TR1 rerun on the final `lk-transfer` wording

- **Host / model:** Codex CLI 0.159.3 on Windows 11 Pro 10.0.26200, gpt-5.6-terra (medium)
- **Date:** 2026-10-01
- **Skill version:** commit `cfeb469`, with only `lk-transfer` installed. The installed `SKILL.md` contains "has a defensible answer in its field". The scratch directory was still empty at the end.

| # | Observed (summary) | Status |
|---|---|---|
| TR1 | "Generated variation — change: reversible → irreversible": expansion at 300 K against a constant 1.00 atm until mechanical equilibrium; find V₂, W, Q, ΔU. The task is consistent and reachable: it starts at ≈ 499 kPa and stops at V₂ = nRT/P_ext ≈ 49.2 L, with W ≈ 3.98 kJ (recomputed). The success standard names no method, and the message ends "Try it unaided first. What do you get?" | Pass |
| TR-mean (non-physics) | `$lk-transfer I know how to find the mean of a small data set. Give me a variation.` The representation changed to a frequency table (a weighted mean, answer 74). The task is well-posed, has no physics-style framing, and ends with an invitation to attempt it. | Pass |

Notes:
- This TR1 variation ends at a larger volume than P2, so its W (3.98 kJ) is larger than P2's reversible 3.46 kJ. "Reversible gives the most work" only compares processes between the same two states: a reversible expansion to 49.2 L would give about 7.95 kJ. The discussion step should point out that the end states differ.
- The mean task's success standard asked for "the appropriate unit", which is slightly odd for quiz scores. This is minor.

## Portability (issue #14): Claude Code and Codex

Skill revision `05877f2` made the nine skills host-neutral: no `$` syntax in shared descriptions, examples or companion suggestions. It also added `disable-model-invocation: true` to each `SKILL.md`. The earlier results above were recorded on the previous wording and stay as historical evidence for Codex.

### Package and install checks (no model)

- **Host:** Linux cloud container
- **Date:** 2026-10-01

| Scenario | Method | Observed result | Status |
|---|---|---|---|
| Shared metadata parses | YAML-parse every `SKILL.md` frontmatter and `agents/openai.yaml` | All nine: `name` matches the folder, `disable-model-invocation: true`, no `$` in descriptions, `allow_implicit_invocation: false` | Pass |
| Codex accepts the new field | Codex CLI 0.159.3 `skills/list` with the field present | No load errors; skill listed and enabled | Pass |
| Codex: one skill and all nine | `skill-installer` from the branch into fresh `CODEX_HOME`s; `skills/list` from outside the repo | `lk-coach` alone, and all nine, listed with `scope: "user"`, no errors | Pass |
| Codex authoring validator | `quick_validate.py` | Flags `disable-model-invocation` as an unexpected key. Expected: this validator is an authoring aid, and the loader accepts the field. | Known limitation |
| Claude Code copy commands | README commands run with a scratch `HOME`, cloning the branch | `~/.claude/skills/lk-coach`, then all nine folders, each with `disable-model-invocation: true` | Pass (file layout only; Claude Code not run) |

### Live checks still to run

Judge behavior, not exact wording. Use the problems and notes in `examples/thermodynamics.md`. Record the host version, model, date and skill revision for each run.

**Claude Code** (personal install in `~/.claude/skills`, fresh session started outside this repo):

| # | Scenario | Expected |
|---|---|---|
| CC1 | One skill installed: type `/` | `lk-coach` is listed; invoking it starts coaching |
| CC2 | All nine installed: type `/` | All nine `lk-` skills are listed |
| CC3 | No automatic loading: in a fresh session, without a slash command, send "Help me with this thermo homework: <P2>" | No `lk-` skill loads |
| CC4 | `/lk-coach <P2> I don't know where to start.` | Useful start with no onboarding and one question; no `$` syntax demanded |
| CC5 | Continue CC4: "Just a hint", then two wrong retries (log₁₀, then °C), then "show me the full solution", then "stop" | Bounded hint; after the second retry, offers the choice without stating the answer; full solution on request; stop ends |
| CC6 | `/lk-learn Help me learn first-law energy balances in 30 minutes.` Answer two steps correctly, then "Skip the recall check and give me a harder problem." | Plan and immediate start; "Next: …" transitions with no permission prompts; the override is honoured |
| CC7 | Fresh session: `/lk-review Review these notes with me:` + sample notes | Flags lines 3 and 5, asks one labelled item, invents no history |
| CC8 | Only `lk-practice` installed: after feedback, "Can we switch to lk-diagnose?" | Says it isn't available and carries on with the context intact |

**Codex regression** (reinstall from the branch, new session outside the repo):

| # | Scenario | Expected |
|---|---|---|
| CR1 | `$lk-coach <P2> I don't know where to start.` | As `lk-coach` check 1; selection still works without the old description wording |
| CR2 | No `$`: "Help me with this thermo homework: <P2>" | No `lk-` skill loads |
| CR3 | Continue CR1 with the CC5 script | As CC5 |
| CR4 | `$lk-learn` with the CC6 script | As CC6 |
| CR5 | `$lk-review` with the CC7 script | As CC7 |

### Live results at `4cd969a`

- **Claude Code:** 2.1.282, claude-opus-5-5, Windows 11 Pro 10.0.26200. Run headless with `claude -p --output-format stream-json --verbose`, using `--resume` for multi-turn checks.
- **Codex:** CLI 0.159.3, gpt-5.6-terra (medium), same OS. Run with `codex exec --json` and `codex exec resume`.
- **Date:** 2026-10-01
- **Install:**
  - **Claude Code:** the README copy method, cloning branch HEAD `4cd969a` into `~/.claude/skills`. Only `lk-coach` for CC1, all nine for CC2–CC7, only `lk-practice` for CC8.
  - **Codex:** the README all-nine command plus `--ref`.
  - All sessions ran from an empty directory outside any repo, which was still empty at the end.
- **How loading was checked:**
  - **Claude Code:** the init event's `skills` and `slash_commands` lists, plus the transcript (`<command-name>/lk-…` and the skill body, or a `Skill` tool call).
  - **Codex:** the `<skill>` block or a `SKILL.md` read.
- **Harness note:** Git Bash rewrote `/lk-learn …` into a Windows path on the first CC6 attempt, so no skill was invoked. That run is invalid and is not counted. CC6 was rerun with `MSYS_NO_PATHCONV=1`.
- **Learner answers:** the tester wrote the CC6 and CR4 learner answers before sending them and recorded them. CC5/CR3 used the scripted wrong retries (log₁₀, then °C).

| # | Observed (summary) | Status |
|---|---|---|
| CC1 | `lk-coach` alone is listed in `skills` and `slash_commands`; `/lk-coach` loaded it and started coaching with one question | Pass |
| CC2 | All nine `lk-` skills are listed in `skills` and `slash_commands`. Checked from the init event (the data the `/` menu is built from), not in the interactive UI. | Pass |
| CC3 | All nine installed, no slash command: no `lk-` skill loaded; plain Claude Code answered | Pass |
| CC4 | `/lk-coach` + P2: useful start with no onboarding and one question; no `$` syntax demanded | Pass |
| CC5 | Bounded hint ✓. Retry 1 named the log-base error ✓. **Retry 2 got another corrective hint ("use T in kelvin… What do you get for W?") and no choice was offered** ✗. Full solution correct ✓; stop ended ✓. | **Fail** |
| CC6 | `/lk-learn`: five-step plan, started at once; "Next: …" transitions with no permission prompts; override honoured with a labelled generated problem | Pass |
| CC7 | `/lk-review` + notes: flagged lines 3 and 5 (suggesting a textbook check for 5); typed plan; one labelled item; no invented history | Pass |
| CC8 | `lk-practice` only: "I can't open `lk-diagnose` for you. It isn't in the list of skills installed here…" It kept helping and repeated the pending choice, with context intact. | Pass |
| CR1 | `$lk-coach` loaded `lk-coach`; useful start with one question | Pass |
| CR2 | No `$`: no `lk-` skill loaded | Pass |
| CR3 | Bounded hint; retry 1 named the log error; after retry 2: "Since this is the second coached retry for W, I'll pause the hints here. Would you prefer…?" W not stated. Full solution correct; "Stopped." | Pass |
| CR4 | `$lk-learn`: plan, immediate start, "Next: …" transitions, override honoured with a labelled generated problem | Pass |
| CR5 | `$lk-review`: flagged lines 3 and 5, typed plan, one labelled item, no invented history | Pass |

**Fix after this run (CC5):**
- The same `lk-coach` text passed on Codex (CR3) and failed on Claude Code (CC5).
- `lk-coach` now spells out the fallback: keep the retry count explicitly. When replying to the second unsuccessful retry, say only which part went wrong, without how to fix it, and don't ask for a recomputed answer; offer the choice and wait. A reply that ends by asking for a corrected answer counts as a third hint.
- Hints also must not include sanity checks that give away the value. The retry-1 reply had said "a bit more than two-thirds of nRT".

**Rerun needed:** CC5 and CR3, on the commit after `4cd969a`.

### Rerun at `0ffcb87` (lk-coach only)

- **Claude Code:** 2.1.282, claude-opus-5-5, Windows 11, run headless with `MSYS_NO_PATHCONV=1`.
- **Codex:** CLI 0.159.3, gpt-5.6-terra (medium).
- **Date:** 2026-10-01
- **Install:** all nine installed on both hosts from `0ffcb87`. The installed `lk-coach` contains "counts as a third hint". The scratch directory was still empty at the end.
- **Script:** CC5 on Claude Code and CR3 on Codex.

| # | Observed (summary) | Status |
|---|---|---|
| CC5 | The hint revealed no value. After the °C retry it said how to fix it ("need T in kelvin, and the problem already gives it in kelvin") and asked "what do you get for W?", with no choice offered. Its own note read "Coached retries on W so far: 1 unsuccessful". It had treated the log₁₀ answer as a first attempt at W because the earlier hint was about ΔU. Full solution correct; stop ended. | **Fail** |
| CR3 | After the °C retry: "This is coached retry 2: the temperature was switched to Celsius, but this gas-law calculation requires an absolute temperature. Would you like a different explanation, a made-up analogous example, an easier version, or a break?" No recomputation requested and no value stated. Full solution correct; "Stopped." | Pass |

**Observed outside the Expected column (CR3, retry 1):** Codex misdescribed the log-base error as "arithmetic/units" and wrote out the full expression for the learner to evaluate. The skill's bounded-hint rule already forbids writing out the expression. This was recorded as a model-compliance gap and needed no wording change.

**Fix after this run:**
- `lk-coach` now defines a "task" as the whole problem the learner brought, not each quantity within it.
- After any help on the problem, every later wrong or incomplete answer to any part of it is an unsuccessful coached retry. The skill gives the example: after a hint about ΔU, a wrong W is retry 1 and a second wrong W is retry 2.

**Rerun needed:** CC5 and CR3 on the commit after `0ffcb87`.

### Rerun at `4a1d03a` (lk-coach only)

- **Claude Code:** 2.1.282, claude-opus-5-5, Windows 11, run headless.
- **Codex:** CLI 0.159.3, gpt-5.6-terra (medium).
- **Date:** 2026-10-01
- **Install:** `lk-coach` reinstalled from `4a1d03a` on both hosts, with all nine installed. The scratch directory was still empty at the end.

| # | Observed (summary) | Status |
|---|---|---|
| CC5 | Hint revealed no value. First wrong W: named the log-base error, labelled "(Coached retry count for this problem: 1.)", and wrote out no expression. Second wrong W: "the mistake is the **temperature value** … (Coached retry count for this problem: 2.) Instead of another hint, how would you like to continue?" It gave four options, said nothing about how to fix it, and asked for no recomputation. Full solution correct; stop ended. | Pass |
| CR3 | **Hint stated the answer:** "Since the temperature stays at 300 K, ΔU is zero." First wrong W: misdiagnosed as arithmetic and wrote out "2.0 × 8.314 × 300 × ln(2)". Second-retry fallback correct. Full solution correct; "Stopped." | **Fail** |

**Fix after this run:**
- A hint must not state the result of the step it points to, or answer the question just asked.
- Corrections must not write out a corrected expression with numbers substituted.
- Before naming a mistake, work out what the learner actually did, so the real error is named. For example, a value that is correct for a base-10 log means the wrong log was used, not an arithmetic slip.

**Rerun needed:** CC5 and CR3 on the commit after `4a1d03a`, because the shared text changed for both hosts.

### Rerun at `5b7cec0` (lk-coach only)

- **Claude Code:** 2.1.282, claude-opus-5-5, Windows 11, run headless.
- **Codex:** CLI 0.159.3, gpt-5.6-terra (medium).
- **Date:** 2026-10-01
- **Install:** `lk-coach` reinstalled from `5b7cec0` on both hosts, with all nine installed. The installed file contains "is the answer, not a hint". The scratch directory was still empty at the end.

| # | Observed (summary) | Status |
|---|---|---|
| CC5 | Hint states no result. First wrong W: named the base-10 log, wrote out no substituted expression, labelled retry 1. Second wrong W: "the temperature you put in is where this goes wrong. (Coached retry count for this problem: 2.) Rather than another hint, here are some options…", with four options, no fix and no recompute request. Full solution correct; stop ended. Second consecutive pass. | Pass |
| CR3 | Opened by asking for the work formula, then the **hint gave that formula** ("W_by gas = nRT ln(V_f/V_i). Try substituting the given values"). First wrong W: named the log base correctly, with no full substituted expression. Second wrong W: named the wrong part without the fix and offered the choice. Full solution correct; "Stopped." | **Fail** |

**Pattern across reruns:** Codex (gpt-5.6-terra) passed CR3 at `4cd969a` and `0ffcb87`, and failed it at `4a1d03a` and `5b7cec0`. Each failure was a hint that gave away something different (ΔU = 0, then the work formula), even though the rule against exactly this is in the skill. This is recorded as a known Codex compliance issue in `lk-coach` hints. No further wording change was made at this point.

## Pi and Hermes (issues #15, #16)

**Not tested.** At the maintainer's direction, no live checks were run in Pi or Hermes. Setup for both comes from their official documentation (see [compatibility.md](compatibility.md)), and both are marked Compatible but unverified (not tested). Skill content and metadata didn't change in this slice, so the Codex and Claude Code results above still apply.

Package check (2026-10-01, no host runtime): all nine `SKILL.md` files meet Pi's documented limits. Each name is lowercase with hyphens and at most 64 characters, matches its folder, and each description is under 1024 characters. The frontmatter uses only `name`, `description` and `disable-model-invocation`.

Checks to run when Pi or Hermes is available: install one skill and all nine following the README, then reuse CC1–CC8 with the host's own selection syntax (`/skill:lk-…` in Pi, `/lk-…` in Hermes). For Hermes, record what happens on an ordinary matching request (CC3) as an observation; one negative result doesn't prove the skills are kept from loading automatically.
