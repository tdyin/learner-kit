# 🎓 Learner Kit

Nine focused tutoring skills for adult self-learners and university students. Bring a topic, problem, or notes; choose the help you need and start talking. Every skill works on its own, with no profile or required sequence.

| Skill | Help it gives |
|---|---|
| `lk-explore` | Map a topic, its prerequisites, and a starting point |
| `lk-explain` | Understand an idea through intuition and examples |
| `lk-practice` | Try a problem and get feedback on your answer |
| `lk-diagnose` | Find where your reasoning went wrong |
| `lk-coach` | Work through a problem with hints or a requested solution |
| `lk-recall` | Quiz yourself from memory, one question at a time |
| `lk-transfer` | Apply a familiar method when something changes |
| `lk-review` | Revisit notes or a pasted session recap |
| `lk-learn` | Follow a short guided explanation, practice, and recall session |

## Install and start

The **1.1.1 plugin candidate** bundles all nine shared skills. Use the [native Codex Desktop catalog path](docs/install.md#codex-desktop-native-catalog) or the [Claude Desktop Chat plugin path](docs/install.md#claude-desktop-chat-native-plugin). The local checkout can be tested now; the GitHub catalog path requires these packaging files to be published first. This is a project-owned catalog, separate from an official marketplace listing.

Desktop acceptance is pending: fresh installation, installed updates, activation behavior, and personal rendering checks have not been verified for this release. Claude Chat's permission enforcement is an unresolved gap. [Compatibility and prior host evidence](docs/compatibility.md) show what has actually been checked. Existing individual-skill installs remain available through [directory installation guidance](docs/install.md#existing-directory-installations-and-troubleshooting).

Select `lk-coach` in your host's skill picker, then send:

```text
Hints only for -3 + 2. I find signed numbers hard to picture.
```

Continue replying without selecting it again. Say “show the solution,” “easier,” “skip,” or “stop” whenever you want. Switching to another skill is optional and needs your permission. An ordinary relevant chat does not authorize a tutoring skill to start.

## How the tutoring works

Useful text diagrams and tables appear proactively when an idea is hard to picture; simple facts get concise answers. Say “more visuals” or “text only” to set a preference for the conversation. Mermaid is used only where rendering is known. Sourced photographs need provenance, actual image inspection, and supported display; missing capabilities are stated. Generated illustrations and interactive HTML are deferred.

`lk-recall` keeps its required progress bar and completion summary even with text-only preferences. Early stop ends it immediately without a summary. Feedback distinguishes your initial attempt from an answer after help, and makes no lasting-mastery claim.

There are no learner records created by these skills. Temporary sourced-image handling is permitted when required by the host; your host may retain conversation history under its own settings. Supplied notes can be wrong, and model explanations and grading can be wrong too.

The project is inspired by *Make It Stick* (Brown, Roediger, and McDaniel, 2014): retrieval, varied practice, generation, and reflection. It is independent of the authors/publisher and makes no claim of measured learning gains.

## More

- [Install, update, and troubleshooting](docs/install.md)
- [Compatibility and verification limits](docs/compatibility.md)
- [Repeatable checks and review rubric](docs/checks.md)
- [Release history](docs/changelog.md)
- [Mathematics example](examples/mathematics.md), [history sources](examples/history/README.md), and [earlier thermodynamics material](examples/thermodynamics.md)

Code and original instructions: [GNU GPL v3](LICENSE). External source images retain their own usage conditions.
