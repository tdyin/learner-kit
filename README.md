<div align="center">

# 🎓 Learner Kit

**Nine focused tutoring skills for AI agents like Codex, Claude Code, Pi, and Hermes. Pick the help you need, when you need it.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Hosts: Codex | Claude Code | Pi | Hermes](https://img.shields.io/badge/hosts-Codex%20%7C%20Claude%20Code%20%7C%20Pi%20%7C%20Hermes-black.svg)](docs/compatibility.md)
[![Skills: 9](https://img.shields.io/badge/skills-9-brightgreen.svg)](#-the-skills)

</div>

Learner Kit is for adult self-learners and university students who want real tutoring, not a learning platform. Paste a homework problem, a page of notes, or just a topic, choose a skill, and start. There's no account to create, no profile to fill in, and no required order to follow.

- 🧩 **Standalone.** Every skill works on its own. Install one or all nine.
- 🎯 **Explicit only.** A skill starts when you select it with your agent's command, for example `$lk-coach` in Codex or `/lk-coach` in Claude Code. Codex, Claude Code and Pi can block automatic loading natively. Elsewhere, including Hermes, only the skill's own instruction keeps it from starting on its own, which is best effort ([details](docs/compatibility.md)).
- 💬 **Conversation-only.** The skills use only what's in the chat and never create or update learner records. Your host (Codex, Claude Code, Pi, Hermes, …) may still keep chat history under its own settings.
- 🙋 **You stay in control.** Ask for a hint, the full solution, an easier task, a skip, or a stop at any time.

## 📚 Where the idea comes from

Learner Kit is inspired by **_Make It Stick: The Science of Successful Learning_** by Peter C. Brown, Henry L. Roediger III and Mark A. McDaniel (Belknap Press of Harvard University Press, 2014; ISBN 978-0-674-72901-8). Its main message is that the study habits that *feel* productive, like rereading and highlighting, often aren't the ones that make learning last. Effortful practice is.

Each skill turns one of the book's ideas into something you can do in a chat:

| Idea from the book | Where you'll find it |
|---|---|
| **Retrieval practice:** pulling an idea from memory strengthens it more than rereading | `lk-recall` asks one question at a time, from memory first. `lk-review` mixes recall into revision. |
| **Generation:** trying before being shown the answer | `lk-practice` and `lk-transfer` ask for your attempt before giving feedback. `lk-coach`'s hints move you one step and leave the next one to you. |
| **Varied practice:** applying a method in new conditions | `lk-transfer` changes one meaningful thing about a problem you already know |
| **Interleaving:** mixing different kinds of practice instead of drilling one thing | `lk-learn` and `lk-review` alternate explanation, practice and recall in a single session |
| **Elaboration:** connecting new ideas to what you already know | `lk-explain` and `lk-explore` link concepts, examples and prerequisites |
| **Reflection and calibration:** seeing clearly what you can do unaided | `lk-diagnose` and the honest recaps keep your first attempt separate from what you managed with help, so a lucky retry isn't mistaken for mastery |
| **Spacing:** coming back to material over time | `lk-review` makes coming back easy with a pasted recap. It doesn't schedule reviews; when to come back is up to you. |

Learner Kit is an independent project, not affiliated with or endorsed by the authors or publisher. It applies the book's ideas as tutoring habits. It does not claim measured learning gains.

## ✨ The skills

| | Skill | What it does | Try it (after selecting the skill) |
|---|---|---|---|
| 🗺️ | `lk-explore` | Maps a topic: the key concepts, prerequisites, connections, and where to start | Map out what I need to understand about thermodynamics. |
| 💡 | `lk-explain` | Explains a concept with intuition and an example, plus formalism where useful | Why are heat and temperature different? |
| ✏️ | `lk-practice` | Gives one problem with a clear success standard, then feedback on your answer | Give me a first-law energy-balance problem. |
| 🔍 | `lk-diagnose` | Finds where your answer or reasoning went wrong, and why | Where did my reasoning go wrong? [problem + your working] |
| 🧑‍🏫 | `lk-coach` | Helps with a homework problem through hints, explanations, worked examples, or a full solution. You don't need to attempt it first. | Coach me through this homework problem. [problem] |
| 🧠 | `lk-recall` | Runs a quiz of a set length (Quick, Standard or Deep), one retrieval question at a time with a progress bar. Difficulty adapts to your answers, and it ends with a summary. | Quiz me from memory on these notes: [notes] |
| 🔀 | `lk-transfer` | Tests a method you know by changing one meaningful thing | Help me apply this energy-balance method to a different system. |
| 🔁 | `lk-review` | Reviews notes, topics, or a pasted recap. No saved history needed. | Review these notes with me before my exam: [notes] |
| 🧭 | `lk-learn` | Runs a short guided session toward your goal: explanation, practice, and recall, paced to your time | Help me learn energy balances in 30 minutes. |

A skill may suggest switching to another one, for example from `lk-practice` to `lk-diagnose`. Switching is always optional. If you decline, or the other skill isn't installed, it carries on from where you left off.

## 🚀 Install

The same nine skill folders work in every supported host. Install them **user-wide** so they're available in every project. No host loads this repository's `skills/` folder automatically, so install them even if you've cloned the repo. See [docs/compatibility.md](docs/compatibility.md) for what has been verified on each host.

| Host | Select a skill | Status |
|---|---|---|
| [Codex](#codex) | `$lk-coach …` | Verified at `4cd969a`; known `lk-coach` hint issue on the current wording |
| [Claude Code](#claude-code) | `/lk-coach …` | Verified |
| [Pi](#pi) | `/skill:lk-coach …` | Compatible but unverified (**not tested**) |
| [Hermes](#hermes) | `/lk-coach …` | Compatible but unverified (**not tested**); explicit-only is best effort |
| [Other agents](#other-agents) | Your agent's own way | Not assessed |

### Codex

Codex installs skills with its built-in **`$skill-installer`** into `$CODEX_HOME/skills` (by default `~/.codex/skills`).

**One skill.** In any Codex chat (replace `lk-coach` with the skill you want):

```text
$skill-installer install https://github.com/tdyin/learner-kit/tree/main/skills/lk-coach
```

Or run the installer script directly:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo tdyin/learner-kit --path skills/lk-coach
```

**All nine.** Pass **one** `--path` followed by every skill path. If you repeat `--path`, only the last one is kept.

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo tdyin/learner-kit --path \
  skills/lk-explore skills/lk-explain skills/lk-practice skills/lk-diagnose \
  skills/lk-coach skills/lk-recall skills/lk-transfer skills/lk-review skills/lk-learn
```

The installer copies each whole skill folder, including `agents/openai.yaml`. That file sets `allow_implicit_invocation: false`, which keeps the skill explicit-only in Codex.

- **Check:** start a **new** Codex session from any directory and type `$`. Each installed skill appears with a "Learner Kit: …" name.
- **Use:** `$lk-coach Here's my homework…`
- **Update:** the installer won't overwrite an existing skill. Delete `~/.codex/skills/<name>`, then install again.

### Claude Code

Claude Code reads personal skills from `~/.claude/skills/<name>/SKILL.md`. Copy the skill folders there:

```bash
git clone --depth 1 https://github.com/tdyin/learner-kit.git /tmp/learner-kit
mkdir -p ~/.claude/skills

# One skill (replace lk-coach with the skill you want)
cp -R /tmp/learner-kit/skills/lk-coach ~/.claude/skills/

# Or all nine
cp -R /tmp/learner-kit/skills/lk-* ~/.claude/skills/
```

On Windows PowerShell, use `Copy-Item -Recurse` into `$HOME\.claude\skills\`.

Each `SKILL.md` sets `disable-model-invocation: true`, so Claude Code loads the skill only when you invoke it and never on its own.

- **Reload:** Claude Code notices new skills in `~/.claude/skills/` during a session. If that folder didn't exist when the session started, run `/reload-skills`.
- **Check:** type `/` and look for the `lk-` skills.
- **Use:** `/lk-coach Here's my homework…`
- **Update:** refresh the clone first with `git -C /tmp/learner-kit pull`, or clone it again if `/tmp` was cleared. Then delete the old folder from `~/.claude/skills` and copy the new one in.

### Pi

> [!WARNING]
> Not tested. This setup follows Pi's [skills](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md) and [packages](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md) documentation, but no Learner Kit check has been run in Pi.

Pi reads personal skills from `~/.agents/skills/<name>/SKILL.md`.

**All nine as a Pi package.** Pi finds the skills in the repository's `skills/` folder:

```bash
pi install git:github.com/tdyin/learner-kit
```

**One skill, or all nine by copying:**

```bash
git clone --depth 1 https://github.com/tdyin/learner-kit.git /tmp/learner-kit
mkdir -p ~/.agents/skills
cp -R /tmp/learner-kit/skills/lk-coach ~/.agents/skills/   # one skill
cp -R /tmp/learner-kit/skills/lk-* ~/.agents/skills/       # or all nine
```

Each `SKILL.md` sets `disable-model-invocation: true`, which Pi documents as making a skill available only through its explicit command.

- **Reload:** run `/reload` in an open session after installing or updating.
- **Use:** `/skill:lk-coach Here's my homework…`
- **Update:** for the package, follow Pi's package documentation. For copied folders, run `git -C /tmp/learner-kit pull`, then replace the folders.

### Hermes

> [!WARNING]
> Not tested. This setup follows Hermes's [skills](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md) and [skill-authoring](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/creating-skills.md) documentation, but no Learner Kit check has been run in Hermes.

Hermes reads skills from `~/.hermes/skills/` and picks up new skills without a restart.

```bash
git clone --depth 1 https://github.com/tdyin/learner-kit.git /tmp/learner-kit
mkdir -p ~/.hermes/skills
cp -R /tmp/learner-kit/skills/lk-coach ~/.hermes/skills/   # one skill
cp -R /tmp/learner-kit/skills/lk-* ~/.hermes/skills/       # or all nine
```

If you already keep skills in `~/.agents/skills` (for example for Pi), you can instead add that folder under `skills.external_dirs` in your Hermes config.

- **Use:** `/lk-coach Here's my homework…`
- **Explicit-only is best effort here.** Hermes's documentation describes no setting that stops the model from loading an installed skill on its own; Hermes doesn't document the `disable-model-invocation` field, so don't rely on it. Each skill tells the model to run only when you select it, but an ordinary request might still start one.
- **Update:** run `git -C /tmp/learner-kit pull`, then replace the folders.

### Other agents

The skills use the [Agent Skills](https://agentskills.io) folder format: each skill is a folder with a `SKILL.md` that has a `name` and `description`. Other agents that support this format may be able to use them:

1. **Find where your agent loads skills from**, and whether it can install from a folder or a Git repository. Check your agent's documentation; there's no universal path or command.
2. **Install whole folders**, for example all of `skills/lk-coach/`, not just the `SKILL.md`.
3. **Find how your agent selects a skill by name**, such as a slash command or a skill menu.
4. **Check its activation controls.** Look for a manual-only or "don't load automatically" setting. Learner Kit sets `disable-model-invocation: true` (understood by Claude Code and Pi) and has a Codex `agents/openai.yaml`; other agents may ignore both. Without a native control, explicit-only is best effort.

Supporting the same file format doesn't make an agent behave the same way. An unlisted agent hasn't been checked, and its activation and teaching behavior need their own verification.

## 🧑‍🏫 Example: homework coaching

Select `lk-coach` once (`$lk-coach` in Codex, `/lk-coach` in Claude Code or Hermes, `/skill:lk-coach` in Pi), then just talk. The activity continues across replies.

```text
Here's my thermo homework: 2.0 mol of an ideal gas expands isothermally
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
- **Verification varies by host.** Claude Code 2.1.282 is verified: all nine skills were discovered and the representative tutoring checks passed. Codex CLI 0.159.3 was verified at an earlier revision. Pi and Hermes have **not been tested**; their setup follows their official documentation. On the current `lk-coach` wording it has a known issue: a hint sometimes gives away the step it asks about. Checks used mostly thermodynamics material plus one non-numerical argument. Other hosts, models, and subjects may behave differently. See [docs/compatibility.md](docs/compatibility.md).
- **Instructions, not guarantees.** The skills are instructions to a model. Observed behavior is recorded in [docs/smoke-checks.md](docs/smoke-checks.md).

## 📁 Repository layout

```text
skills/lk-<name>/SKILL.md            Skill instructions (one directory per skill)
skills/lk-<name>/agents/openai.yaml  Codex UI metadata and explicit-only policy
docs/compatibility.md                Host support, activation controls, and evidence
examples/thermodynamics.md           Checked reference material used for verification
docs/smoke-checks.md                 Recorded installation and behavior checks
docs/release-acceptance.md           Release 1 acceptance record (spec checks mapped to evidence)
LICENSE                              GNU General Public License v3.0
```

## 📄 License

Learner Kit is free software: you can redistribute it and modify it under the terms of the [GNU General Public License v3.0](LICENSE).
