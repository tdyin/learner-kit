# Host compatibility

All hosts use the same nine skill packages and the same teaching instructions. Only the setup steps and a small amount of metadata differ between hosts.

## Status labels

- **Verified:** in a recorded environment, installation worked, all nine skills were discovered, and representative tutoring checks passed.
- **Compatible but unverified:** the host's current official documentation supports this setup, but the live checks are incomplete or haven't been run. Where no check has run at all, the table says **not tested**.
- **Pending:** not yet covered. Don't rely on it.

**Activation enforcement** is reported separately from status. It says whether the host itself prevents a skill from loading on ordinary requests (native), or whether only the skill's own "use only when explicitly selected" instruction does (best effort).

## Hosts

| Host | Status (recorded evidence) | Activation enforcement | Setup |
|---|---|---|---|
| Codex CLI | **Verified** at `4cd969a`: all nine installed and discovered, CR1–CR5 passed. On the latest tested `lk-coach` revision (`5b7cec0`), `lk-coach` has a **known issue**: in 2 of the last 4 CR3 runs, a hint gave away the answer to the step it asked about. All other `lk-coach` behavior passed. | Native: `agents/openai.yaml` sets `policy.allow_implicit_invocation: false` | [README → Codex](../README.md#codex) |
| Claude Code | **Verified.** CC1–CC4 and CC6–CC8 passed at `4cd969a`, with all nine installed and discovered. CC5 (`lk-coach`) passed at `4a1d03a` and again at `5b7cec0`; only the `5b7cec0` run used the final `lk-coach` wording. One line in `lk-explain` changed afterwards (`fcd0346`): its example of another skill now names `lk-practice`. This didn't change the teaching behavior and wasn't rerun. | Native: `disable-model-invocation: true` in `SKILL.md`. Observed working: no skill loaded on an ordinary matching request (CC3). | [README → Claude Code](../README.md#claude-code) |
| Pi coding agent | **Compatible but unverified — not tested.** Setup follows Pi's official documentation; no install or tutoring check has been run in Pi. | Native (documented, not observed): Pi supports `disable-model-invocation: true` in `SKILL.md` | [README → Pi](../README.md#pi) |
| NousResearch Hermes Agent | **Compatible but unverified — not tested.** Setup follows Hermes's official documentation; no install or tutoring check has been run in Hermes. | **Best effort.** Hermes's documentation describes no manual-only control. Only each skill's "use only when explicitly selected" instruction applies. | [README → Hermes](../README.md#hermes) |
| Other Agent Skills hosts | Not assessed. Each agent needs its own verification. | Depends on the agent. Best effort if it has no native control. | [README → Other agents](../README.md#other-agents) |

`lk-recall`'s fixed-length adaptive quiz (issue #18) came after these results. Its checks (RA1–RA16) have had one Codex run, with failures that led to wording fixes; reruns on the fixed wording are pending, and it hasn't been checked in Claude Code. Details are in [smoke-checks.md](smoke-checks.md#issue-18-adaptive-lk-recall-quizzes).

## Evidence

### Codex CLI

- **Historical (pre-portability):** Codex CLI 0.159.3 on Windows 11, models gpt-6-astra and gpt-5.6-terra (medium), 2026-09-30 to 2026-10-01, skill revisions up to `e843702`. Every release check passed; details are in [release-acceptance.md](release-acceptance.md) and [smoke-checks.md](smoke-checks.md). These results apply to the earlier skill wording. They have not been carried over to the portability revision.
- **Portability revision (`05877f2`), 2026-10-01, Codex CLI 0.159.3 on Linux, no model:**
  - The added `disable-model-invocation` field doesn't stop Codex from loading the skill: `skills/list` reported no errors.
  - One skill and all nine installed from the branch with Codex's `skill-installer`. From a directory outside the repo, all nine were listed with `scope: "user"`.
  - All nine `agents/openai.yaml` files still set `allow_implicit_invocation: false`.
  - **Gap (since closed):** tutoring regression checks were still to run at this point. See the next item.
- **Live run at `4cd969a`, 2026-10-01:** Codex CLI 0.159.3, gpt-5.6-terra (medium), Windows 11. All nine installed with the README command; CR1–CR5 passed: explicit selection, no loading without `$`, the `lk-coach` hint/retry/solution/stop script, `lk-learn` transitions and overrides, and `lk-review` from notes.
- **`lk-coach` reruns (CR3):** passed at `0ffcb87`, then failed at `4a1d03a` (hint stated ΔU = 0) and at `5b7cec0` (hint gave the work formula it had just asked for). The retry fallback, full solution and stop passed every time.
- **Known issue:** with gpt-5.6-terra, `lk-coach` hints sometimes give away the answer to the step being asked about, even though the skill forbids it. This is disclosed rather than hidden. Other skills are unaffected as far as tested.
- **Known limitation:** Codex's skill-creator `quick_validate.py` reports `disable-model-invocation` as an unexpected key. That validator is an authoring aid; the Codex loader accepts the field.

### Claude Code

- **Documentation reviewed:** [Claude Code skills](https://code.claude.com/docs/en/skills), 2026-10-01:
  - Personal skills live in `~/.claude/skills/<skill-name>/SKILL.md` and are available in all projects.
  - You invoke a skill with `/skill-name`, and text after it is passed as arguments.
  - `disable-model-invocation: true` "prevent[s] Claude from automatically loading this skill", and its description is kept out of context.
  - Claude Code picks up changes under `~/.claude/skills/` within the current session. If that folder didn't exist when the session started, run `/reload-skills`.
- **Live run at `4cd969a`, 2026-10-01:** Claude Code 2.1.282, claude-opus-5-5, Windows 11, run headless (`claude -p`). Skills were copied into `~/.claude/skills` as the README describes.
  - **Discovery:** all nine appear in the session's `skills` and `slash_commands` lists. Checked from the init event, not the interactive `/` menu.
  - **Selection and enforcement:** `/lk-…` loads the selected skill, and an ordinary matching request loaded none.
  - **Tutoring:** `lk-learn` transitions and overrides, `lk-review` from notes, and the missing-companion case all passed.
  - **Failure:** in CC5, `lk-coach` gave a third corrective hint instead of the retry fallback; the same text passed on Codex.
- **Follow-up:** CC5 failed at `4cd969a` and `0ffcb87` (third corrective hint, then a retry miscount). It passed at `4a1d03a` and `5b7cec0` after `lk-coach` defined retries per whole problem and tightened the fallback. Claude Code 2.1.282 with claude-opus-5-5 is now Verified.
- **Known limitation:** `disable-model-invocation` is a Claude Code extension to the Agent Skills format. Claude Code's docs note that strict Agent Skills packaging, such as uploading to claude.ai, rejects fields the specification doesn't allow. These packages are meant for directory installation and aren't packaged for upload.

### Pi coding agent

- **Documentation reviewed** (2026-10-01): [Pi skills](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md) and [Pi packages](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md).
  - User skills live in `~/.agents/skills/`.
  - `disable-model-invocation: true` makes a skill "available only through its explicit command".
  - You invoke a skill with `/skill:name [arguments]`, and run `/reload` after changes.
  - Unknown frontmatter fields produce warnings, not load failures.
  - Names must be lowercase with hyphens, up to 64 characters; descriptions are capped at 1024 characters.
  - `pi install git:…` discovers skills from a package's `skills/` folder.
- **Package check (no Pi runtime):** all nine `SKILL.md` files meet Pi's name and description limits. Their frontmatter uses only `name`, `description` and `disable-model-invocation`.
- **Live checks:** not run. At the maintainer's direction, Pi wasn't tested in this round. Install, discovery, explicit selection, the no-auto-load check and the tutoring checks are all outstanding. Codex and Claude Code results don't carry over to Pi.

### NousResearch Hermes Agent

- **Documentation reviewed** (2026-10-01): [Hermes skills](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md) and [creating skills](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/creating-skills.md).
  - Skills live in `~/.hermes/skills/`, and extra folders can be added with `skills.external_dirs`.
  - Every installed skill is available as `/skill-name`, and new skills are picked up without a restart.
  - The format is described as compatible with the Agent Skills standard.
- **Activation:** the docs describe no manual-only or "don't load automatically" setting. The only related controls, `requires_*` and `fallback_for_*`, are about visibility, not invocation. They don't say how unknown fields such as `disable-model-invocation` are treated, so we make no claim either way. Explicit-only behavior in Hermes is best effort.
- **Live checks:** not run. At the maintainer's direction, Hermes wasn't tested in this round. Install, discovery, explicit selection, observed matching-request behavior and the tutoring checks are all outstanding. Codex and Claude Code results don't carry over to Hermes.

### Other Agent Skills hosts

Sharing the file format doesn't mean an agent will behave the same way. An unlisted agent hasn't been checked; its discovery, activation controls and teaching behavior need their own verification. General setup guidance is in [README → Other agents](../README.md#other-agents).
