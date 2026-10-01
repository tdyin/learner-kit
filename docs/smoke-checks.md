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
