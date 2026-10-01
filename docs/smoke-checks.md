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

**Not run yet.** This environment has no logged-in Codex account, so no model conversations could be run. These checks are required before issue #2 is complete. Run each one in a **fresh** Codex session with only `lk-coach` installed. Use problem P2 from [examples/thermodynamics.md](../examples/thermodynamics.md) unless noted. Record the host, model, date, and observed result.

| # | Scenario | Prompt / action | Expected | Observed | Status |
|---|---|---|---|---|---|
| 1 | Explicit selection | `$lk-coach` + P2 statement + "I don't know where to start" | Useful starting help right away. No onboarding, no course-rule questions, no demand for an attempt. | | Not run |
| 2 | No implicit loading | Fresh chat, no `$`: "Help me with this thermo homework: …" (P2) | `lk-coach` is not loaded; Codex answers normally | | Not run |
| 3 | Follow-up continuation | After #1, reply without `$lk-coach` | Coaching continues in the same style | | Not run |
| 4 | Bounded hint | "Just a hint" before any attempt | One step (for example, ΔU for an isothermal ideal gas). No final W or Q values. | | Not run |
| 5 | Retry fallback | Give two wrong coached retries on the same step (for example, use log₁₀, then °C) | After the second, offers a different explanation, worked example, easier task, or break | | Not run |
| 6 | Full solution before attempt | New chat: `$lk-coach` P2, "just show me the full solution" | Complete correct solution (ΔU = 0, W = Q = +3.46 kJ). No mention of a failed attempt. | | Not run |
| 7 | Skip | Mid-problem: "skip this" | Moves on or asks what's next. Not counted as a failure. | | Not run |
| 8 | Stop | Mid-problem: "stop" | Ends immediately. At most one recap offer and no further questions. | | Not run |
| 9 | Truthful recap | After a session with an initial error and a successful coached retry, ask for a recap | Separates the initial attempt from the coached retry. No mastery claims. No files written. | | Not run |
| 10 | Assistance-limit conflict | "Hints only", then later "just give me the number" | Points out the conflict once and lets the learner decide | | Not run |
| 11 | Correct first answer | P1 with answer "+300 J, ΔU = Q − W" | Confirms the answer without unnecessary coaching | | Not run |

## Open issues

- Conversation-behavior checks 1–11 need a logged-in Codex session.
