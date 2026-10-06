# Host compatibility

All hosts use the same four skill packages and teaching instructions. Host manifests and setup steps differ. Detailed check results are local references, excluded from commits and pushes; this page describes support boundaries and known limitations.

## Plugin candidate: 1.2.0

Neither Codex Desktop nor Claude Desktop Chat has completed fresh-install, installed-update, activation and personal display acceptance. CLI execution and package validation do not establish desktop behavior. Follow the [per-host checklist](install.md#desktop-acceptance-checklist-per-host) and [repeatable checks](checks.md).

Known limitations:

- `lk-recall` can omit its required progress bar when asked to hide progress. Required progress and completion grouping remain requirements even with text-only preferences.
- `lk-coach` can disclose the answer in a hint. Preserve bounded help and review cues against the actual learner attempt.
- Claude Desktop Chat explicit-only enforcement is unresolved. Its documentation describes automatic skill matching; withhold verified Chat support until direct selected/unselected checks establish permission behavior.
- Text diagrams, Mermaid and photographs depend on the host's display capabilities. The user personally checks rendering in each desktop app.

## Installation and activation controls

Installation support and activation policy are separate. A shared file format does not establish equivalent behavior across hosts.

| Host | Setup | Activation boundary |
|---|---|---|
| Codex Desktop | [Native project catalog](install.md#codex-desktop-native-catalog) | Codex metadata requests `allow_implicit_invocation: false`; direct desktop enforcement requires verification. |
| Claude Desktop Chat | [Native plugin](install.md#claude-desktop-chat-native-plugin) | Explicit-only Chat enforcement remains unresolved; Claude Code behavior does not carry over. |
| Codex CLI | Native project catalog or [individual directories](install.md#existing-directory-installations-and-troubleshooting) | Codex metadata sets `allow_implicit_invocation: false`; inspect actual loading/injection separately from response text. |
| Claude Code | [Individual directories](install.md#existing-directory-installations-and-troubleshooting) | `disable-model-invocation: true` requests manual-only use. Code acceptance does not establish Chat acceptance. |
| Pi coding agent | [Individual directory/package setup](install.md#existing-directory-installations-and-troubleshooting) | `disable-model-invocation: true` is the documented explicit-command control; current live behavior remains unverified. |
| NousResearch Hermes Agent | [Individual directories](install.md#existing-directory-installations-and-troubleshooting) | No native manual-only control is established; explicit-only instructions are best effort. |
| Other Agent Skills hosts | Host-specific setup | Discovery, permission controls and tutoring behavior require independent verification. |

Keep selected/unselected activation, teaching quality, image inspection and desktop display as separate dimensions. Record pass, fail, blocked or unverified in local results with the actual source/installed version, host, model and observation. Preserve earlier records locally rather than carrying their passes forward to new instructions or another surface.
