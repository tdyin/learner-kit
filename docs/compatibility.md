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
| Codex CLI | **Verified** at `4cd969a`: all nine installed and discovered, CR1–CR5 passed. At the current revision (`5b7cec0`), `lk-coach` has a **known issue**: in 2 of the last 4 CR3 runs, a hint gave away the answer to the step it asked about. All other `lk-coach` behavior passed. | Native: `agents/openai.yaml` sets `policy.allow_implicit_invocation: false` | [README → Codex](../README.md#codex) |
| Claude Code | **Verified** at `5b7cec0`: all nine installed and discovered, CC1–CC8 passed. CC5 passed on the final `lk-coach` wording, twice in a row; the other skills haven't changed since their pass at `4cd969a`. | Native: `disable-model-invocation: true` in `SKILL.md`. Observed working: no skill loaded on an ordinary matching request (CC3). | [README → Claude Code](../README.md#claude-code) |
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

### Pi coding agent and Hermes Agent

Not covered by this revision. They're follow-ups under #13. Don't treat either host as supported until its row says otherwise.
