# Host compatibility

All hosts use the same nine skill packages and the same teaching instructions. Only the setup steps and a small amount of metadata differ between hosts.

## Status labels

- **Verified:** in a recorded environment, installation worked, all nine skills were discovered, and representative tutoring checks passed.
- **Compatible but unverified:** the host's current official documentation supports this setup, but the live checks are incomplete or haven't been run.
- **Pending:** not yet covered. Don't rely on it.

**Activation enforcement** is reported separately from status. It says whether the host itself prevents a skill from loading on ordinary requests (native), or whether only the skill's own "use only when explicitly selected" instruction does (best effort).

## Hosts

| Host | Status at the current revision | Activation enforcement | Setup |
|---|---|---|---|
| Codex CLI | **Verified** at `4cd969a` (portability revision): all nine installed and discovered, CR1–CR5 passed. `lk-coach` has changed since then; CR3 needs a rerun on the new wording. Also verified at `e843702`, before portability (historical). | Native: `agents/openai.yaml` sets `policy.allow_implicit_invocation: false` | [README → Codex](../README.md#codex) |
| Claude Code | **Compatible but unverified.** At `4cd969a`: installation and discovery of all nine passed, and 7 of 8 tutoring checks passed. CC5 (retry fallback) failed; a fix is pushed and needs a rerun. | Native: `disable-model-invocation: true` in `SKILL.md`. Observed working: no skill loaded on an ordinary matching request (CC3). | [README → Claude Code](../README.md#claude-code) |
| Pi coding agent | **Pending** (follow-up to #13) | Not yet configured | Not yet documented |
| NousResearch Hermes Agent | **Pending** (follow-up to #13) | Not yet assessed | Not yet documented |
| Other Agent Skills hosts | Not assessed | Best effort: the instruction in each skill only | [README → Other agents](../README.md#other-agents) |

## Evidence

### Codex CLI

- **Historical (pre-portability):** Codex CLI 0.159.3 on Windows 11, models gpt-6-astra and gpt-5.6-terra (medium), 2026-09-30 to 2026-10-01, skill revisions up to `e843702`. Every release check passed; details are in [release-acceptance.md](release-acceptance.md) and [smoke-checks.md](smoke-checks.md). These results apply to the earlier skill wording. They have not been carried over to the portability revision.
- **Portability revision (`05877f2`), 2026-10-01, Codex CLI 0.159.3 on Linux, no model:**
  - The added `disable-model-invocation` field doesn't stop Codex from loading the skill: `skills/list` reported no errors.
  - One skill and all nine installed from the branch with Codex's `skill-installer`. From a directory outside the repo, all nine were listed with `scope: "user"`.
  - All nine `agents/openai.yaml` files still set `allow_implicit_invocation: false`.
  - **Gap (since closed):** tutoring regression checks were still to run at this point. See the next item.
- **Live run at `4cd969a`, 2026-10-01:** Codex CLI 0.159.3, gpt-5.6-terra (medium), Windows 11. All nine installed with the README command; CR1–CR5 passed: explicit selection, no loading without `$`, the `lk-coach` hint/retry/solution/stop script, `lk-learn` transitions and overrides, and `lk-review` from notes.
- **Remaining gap:** `lk-coach` was edited after this run to fix a Claude Code failure, so CR3 needs a rerun on the new wording.
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
- **Remaining gap:** CC5 needs a rerun on the updated `lk-coach`. Claude Code can be marked Verified once it passes.
- **Known limitation:** `disable-model-invocation` is a Claude Code extension to the Agent Skills format. Claude Code's docs note that strict Agent Skills packaging, such as uploading to claude.ai, rejects fields the specification doesn't allow. These packages are meant for directory installation and aren't packaged for upload.

### Pi coding agent and Hermes Agent

Not covered by this revision. They're follow-ups under #13. Don't treat either host as supported until its row says otherwise.
