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
| Codex CLI | **Compatible but unverified** at the portability revision: installation and discovery of all nine re-checked, tutoring regression checks pending. **Verified** at `e843702`, before portability (historical, see below). | Native: `agents/openai.yaml` sets `policy.allow_implicit_invocation: false` | [README → Codex](../README.md#codex) |
| Claude Code | **Compatible but unverified.** Set up from the official documentation; live checks pending. | Native (documented): `disable-model-invocation: true` in `SKILL.md` | [README → Claude Code](../README.md#claude-code) |
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
  - **Gap:** no tutoring regression checks with a model yet. The checks to run are listed in [smoke-checks.md](smoke-checks.md#portability-issue-14-claude-code-and-codex).
- **Known limitation:** Codex's skill-creator `quick_validate.py` reports `disable-model-invocation` as an unexpected key. That validator is an authoring aid; the Codex loader accepts the field.

### Claude Code

- **Documentation reviewed:** [Claude Code skills](https://code.claude.com/docs/en/skills), 2026-10-01:
  - Personal skills live in `~/.claude/skills/<skill-name>/SKILL.md` and are available in all projects.
  - You invoke a skill with `/skill-name`, and text after it is passed as arguments.
  - `disable-model-invocation: true` "prevent[s] Claude from automatically loading this skill", and its description is kept out of context.
  - Claude Code picks up changes under `~/.claude/skills/` within the current session. If that folder didn't exist when the session started, run `/reload-skills`.
- **Live checks:** not run yet. This environment runs inside a Claude Code session, and nested Claude Code sessions weren't started without the maintainer's approval. The checks to run are listed in [smoke-checks.md](smoke-checks.md#portability-issue-14-claude-code-and-codex).
- **Known limitation:** `disable-model-invocation` is a Claude Code extension to the Agent Skills format. Claude Code's docs note that strict Agent Skills packaging, such as uploading to claude.ai, rejects fields the specification doesn't allow. These packages are meant for directory installation and aren't packaged for upload.

### Pi coding agent and Hermes Agent

Not covered by this revision. They're follow-ups under #13. Don't treat either host as supported until its row says otherwise.
