# 🎓 Learner Kit

Focused AI tutoring skills for adult self-learners and university students. Bring a topic, a problem, or your notes, then choose the kind of help you want: an explanation, a hint, practice, or a quiz.

Each of the nine skills works on its own. You can start wherever you need help and change direction as you go.

## Choose your help

| What you want to do | Skill |
|---|---|
| Find a starting point in an unfamiliar subject | [`lk-explore`](skills/lk-explore/SKILL.md) |
| Understand an idea through intuition and examples | [`lk-explain`](skills/lk-explain/SKILL.md) |
| Try a problem and get feedback on your answer | [`lk-practice`](skills/lk-practice/SKILL.md) |
| Find where your reasoning went wrong | [`lk-diagnose`](skills/lk-diagnose/SKILL.md) |
| Work through a problem with hints or a requested solution | [`lk-coach`](skills/lk-coach/SKILL.md) |
| Test what you remember, one question at a time | [`lk-recall`](skills/lk-recall/SKILL.md) |
| Apply a familiar method to a different situation | [`lk-transfer`](skills/lk-transfer/SKILL.md) |
| Revisit notes or a pasted session recap | [`lk-review`](skills/lk-review/SKILL.md) |
| Combine explanation, practice, and recall in a guided session | [`lk-learn`](skills/lk-learn/SKILL.md) |

## Get started

1. Follow the [installation guide](docs/install.md) for your app. You can install the plugin bundle or individual skills.
2. Select a skill in your app's skill picker. For example, choose `lk-coach` and send:

   ```text
   Hints only for -3 + 2. I find signed numbers hard to picture.
   ```

3. Reply with your attempt and continue the conversation. You only need to select the skill once for that activity.

Codex Desktop and Claude Desktop Chat support is still being verified. Check [compatibility and known limitations](docs/compatibility.md) before choosing a setup.

## Learn at your pace

Ask for a hint, an easier question, or a fuller explanation. Say “stop” to end the activity. Switching to another skill is your choice.

The skills use diagrams and tables when they help explain an idea. Say “more visuals” or “text only” to set your preference. Where supported, sourced images can help you examine real examples and evidence.

Feedback works from your actual answer and distinguishes what you did independently from what you completed with help. Explanations and grading can still be wrong; check important claims against your course material or other reliable sources.

Learner Kit creates no learner profiles or saved learning records. Your app may retain chat history under its own settings.

## Explore further

- [Examples: mathematics](examples/mathematics.md), [history](examples/history/README.md), and [thermodynamics](examples/thermodynamics.md)
- [Installation, updates, and troubleshooting](docs/install.md)
- [Contributor guidance](docs/agents/contributing.md) and [repeatable checks](docs/checks.md)
- [Release history](docs/changelog.md)

Inspired by *Make It Stick* (Brown, Roediger, and McDaniel, 2014), especially retrieval, varied practice, generation, and reflection. This project is independent of the authors and publisher.

Code and original instructions are licensed under [GNU GPL v3](LICENSE). External source images retain their own usage conditions.
