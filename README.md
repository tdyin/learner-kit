<div align="center">

# 🎓 Learner Kit

**Nine focused tutoring skills for Codex. Pick the help you need, when you need it.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Host: Codex](https://img.shields.io/badge/host-Codex%20CLI-black.svg)](#-install)
[![Skills: 9](https://img.shields.io/badge/skills-9-brightgreen.svg)](#-the-skills)

</div>

Learner Kit is for adult self-learners and university students who want real tutoring, not a learning platform. Paste a homework problem, a page of notes, or just a topic, choose a skill, and start. There's no account to create, no profile to fill in, and no required order to follow.

- 🧩 **Standalone.** Every skill works on its own. Install one or all nine.
- 🎯 **Explicit only.** A skill starts only when you select it with `$lk-…`. Ordinary chats are never hijacked.
- 💬 **Conversation-only.** The skills use only what's in the chat and never create or update learner records. Your host, such as Codex, may still keep chat history under its own settings.
- 🙋 **You stay in control.** Ask for a hint, the full solution, an easier task, a skip, or a stop at any time.

## ✨ The skills

| | Skill | What it does | Try it |
|---|---|---|---|
| 🗺️ | `lk-explore` | Maps a topic: the key concepts, prerequisites, connections, and where to start | `$lk-explore Map out what I need to understand about thermodynamics.` |
| 💡 | `lk-explain` | Explains a concept with intuition and an example, plus formalism where useful | `$lk-explain Why are heat and temperature different?` |
| ✏️ | `lk-practice` | Gives one problem with a clear success standard, then feedback on your answer | `$lk-practice Give me a first-law energy-balance problem.` |
| 🔍 | `lk-diagnose` | Finds where your answer or reasoning went wrong, and why | `$lk-diagnose Where did my reasoning go wrong? [problem + your working]` |
| 🧑‍🏫 | `lk-coach` | Helps with a homework problem through hints, explanations, worked examples, or a full solution. You don't need to attempt it first. | `$lk-coach Coach me through this homework problem. [problem]` |
| 🧠 | `lk-recall` | Quizzes you one retrieval question at a time, from memory or with your notes open | `$lk-recall Quiz me from memory on these notes: [notes]` |
| 🔀 | `lk-transfer` | Tests a method you know by changing one meaningful thing | `$lk-transfer Help me apply this energy-balance method to a different system.` |
| 🔁 | `lk-review` | Reviews notes, topics, or a pasted recap. No saved history needed. | `$lk-review Review these notes with me before my exam: [notes]` |
| 🧭 | `lk-learn` | Runs a short guided session toward your goal: explanation, practice, and recall, paced to your time | `$lk-learn Help me learn energy balances in 30 minutes.` |

A skill may suggest switching to another one, for example from `lk-practice` to `lk-diagnose`. Switching is always optional. If you decline, or the other skill isn't installed, it carries on from where you left off.

## 🚀 Install

Learner Kit installs with Codex's built-in **`$skill-installer`** into `$CODEX_HOME/skills` (by default `~/.codex/skills`), so the skills are available in every project.

> [!NOTE]
> Codex does **not** load this repository's `skills/` folder automatically. Install the skills even if you have cloned the repo.

### One skill

In any Codex chat (replace `lk-coach` with the skill you want):

```text
$skill-installer install https://github.com/tdyin/learner-kit/tree/main/skills/lk-coach
```

Or run the installer script directly:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo tdyin/learner-kit --path skills/lk-coach
```

### All nine

Pass **one** `--path` followed by every skill path. If you repeat `--path`, only the last one is kept.

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo tdyin/learner-kit --path \
  skills/lk-explore skills/lk-explain skills/lk-practice skills/lk-diagnose \
  skills/lk-coach skills/lk-recall skills/lk-transfer skills/lk-review skills/lk-learn
```

The installer copies each whole skill directory, including `agents/openai.yaml`. That file sets `allow_implicit_invocation: false`, which is what makes the skill explicit-only.

<details>
<summary><b>Check the install, or update a skill</b></summary>

- **Check:** start a **new** Codex session from any directory and type `$`. Each installed skill appears with a "Learner Kit: …" display name.
- **Update:** the installer refuses to overwrite an existing skill. Delete `~/.codex/skills/<name>`, then install again.

</details>

## 🧑‍🏫 Example: homework coaching

Select a skill once, then just talk. The activity continues across replies.

```text
$lk-coach Here's my thermo homework: 2.0 mol of an ideal gas expands isothermally
and reversibly at 300 K from 10.0 L to 20.0 L. Find W, Q and ΔU.
I don't know where to start. Hints only, please.
```

1. **Start from the problem.** Say what help you want, for example "hints only", "walk me through it", or "just check my answer". You don't need any setup or a first attempt.
2. **One step at a time.** You get a bounded hint or the next idea, and one question. Answer when you're ready.
3. **Try again.** Answers after help count as coached retries, kept separate from your first attempt. If two retries on the same task don't work, the coach offers a different explanation, a worked example, an easier task, or a break.
4. **Stay in control.** Say "show me the full solution", "give me an easier one", "skip", or "stop" at any time. Asking for the solution isn't counted as a failed attempt.
5. **Your rules.** Mentioning homework doesn't trigger questions about course rules. If you set a limit, such as "no final answers", the coach keeps to it and checks with you if you later ask for something that conflicts.
6. **Recap (optional).** Ask for a short recap to paste into a new chat later. Nothing is saved automatically.

## ⚠️ Limitations

- **Conversation-only memory.** Skills see only the current chat. A pasted recap is treated as something you supplied, not as a verified record.
- **Grading can be wrong.** Feedback comes from the host model. It should state uncertainty, but it can still misjudge an answer.
- **Not a mastery measure.** Getting something right just after help shows the help worked for that problem, not that you've learned it for good.
- **Verified in Codex only.** Installation and behavior checks were run with Codex CLI 0.159.3, mostly on thermodynamics material plus one non-numerical argument. Other hosts, models, and subjects may behave differently. The remaining caveats are listed in [docs/release-acceptance.md](docs/release-acceptance.md).
- **Instructions, not guarantees.** The skills are instructions to a model. Observed behavior is recorded in [docs/smoke-checks.md](docs/smoke-checks.md).

## 📁 Repository layout

```text
skills/lk-<name>/SKILL.md            Skill instructions (one directory per skill)
skills/lk-<name>/agents/openai.yaml  Codex UI metadata and explicit-only policy
examples/thermodynamics.md           Checked reference material used for verification
docs/smoke-checks.md                 Recorded installation and behavior checks
docs/release-acceptance.md           Release 1 acceptance record (spec checks mapped to evidence)
docs/IMPLEMENTATION_PLAN.md          Release 1 plan
LICENSE                              GNU General Public License v3.0
```

## 📄 License

Learner Kit is free software: you can redistribute it and modify it under the terms of the [GNU General Public License v3.0](LICENSE).
