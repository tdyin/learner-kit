<div align="center">

# 🎓 Learner Kit

**A study buddy for the “wait, why?” moments.**

Bring your curiosity, your notes, or that one problem that refuses to make sense.

[Install](#-installation) · [Get started](#-get-started) · [Pick your help](#-start-with-these-three)

</div>

Learner Kit gives your AI assistant a few useful tutoring habits: explain an idea, leave room for you to try, and give feedback on your reasoning. Built for adult self-learners and university students, each skill works on its own. Start with one and just talk.

## 📚 Why Learner Kit?

Ever read an explanation, thought “got it,” then drawn a blank when it was your turn?

Inspired by **_Make It Stick_** (Brown, Roediger, and McDaniel, 2014), Learner Kit brings active study into the conversation:

- 🧠 **Retrieve:** try to recall an idea before looking at the answer.
- ✏️ **Have a go:** make an attempt, get feedback, and try again.
- 🔀 **Mix it up:** explain, practise, and apply ideas in a different situation.
- 🪞 **Reflect:** notice what you could do yourself and where a hint helped.

The aim is to give you more chances to do the thinking—with help when you need it.

## 🚀 Installation

Start with the three beginner skills: `lk-learn`, `lk-coach`, and `lk-recall`. Open your app's instructions below.

<details>
<summary><strong>Codex</strong> — paste this into a Codex chat</summary>

Use Codex's built-in skill installer:

```text
$skill-installer install skills/lk-learn, skills/lk-coach, and skills/lk-recall from https://github.com/tdyin/learner-kit
```

After installation, open a new chat, type `$`, and select `lk-learn`. The skills are available across your projects.

</details>

<details>
<summary><strong>Claude</strong> — install the starter skills in Claude Code</summary>

Run these commands in a terminal to copy the skills into your personal Claude Code skills folder.

**macOS / Linux**

```sh
git clone https://github.com/tdyin/learner-kit.git
mkdir -p ~/.claude/skills
cp -R learner-kit/skills/lk-learn learner-kit/skills/lk-coach learner-kit/skills/lk-recall ~/.claude/skills/
```

**Windows PowerShell**

```powershell
git clone https://github.com/tdyin/learner-kit.git
New-Item -ItemType Directory -Force "$HOME/.claude/skills"
Copy-Item -Recurse learner-kit/skills/lk-learn, learner-kit/skills/lk-coach, learner-kit/skills/lk-recall "$HOME/.claude/skills/"
```

Start a new Claude Code session and select `/lk-learn`.

These commands are for **Claude Code**. Claude Desktop Chat uses plugin installation through its interface; support for that surface is still being verified.

</details>

Want the plugin bundle, desktop setup, another host, or help updating? See the [detailed installation guide](docs/install.md) and [compatibility notes](docs/compatibility.md).

## 💬 Get started

Then select **`lk-learn`** in your app's skill picker and try:

```text
I have 20 minutes. Help me understand why heat and temperature
are different, then give me something to try.
```

Reply naturally from there. You select the skill once for that activity; it continues as you answer.

## ✨ Start with these three

| Today’s mission | Pick | Try saying… |
|---|---|---|
| 🧭 “Help me learn this.” | [`lk-learn`](skills/lk-learn/SKILL.md) | “Walk me through this topic, then let me practise.” |
| 🧑‍🏫 “I’m stuck on a problem.” | [`lk-coach`](skills/lk-coach/SKILL.md) | “Hints only, please. Here’s the problem…” |
| 🧠 “What do I actually remember?” | [`lk-recall`](skills/lk-recall/SKILL.md) | “Give me a short quiz from these notes.” |

**Not sure? Start with `lk-learn`.** It combines explanation, practice, and recall in a guided session.

## 🎛️ You’re in the driver’s seat

“Give me a hint.” “Make it easier.” “Show the solution.” “Stop.” Tell the tutor what you need. Switching skills is optional and stays your choice.

Diagrams and tables help when an idea is hard to picture. Say **“more visuals”** or **“text only”** to set your preference. Where supported, sourced images can bring real examples into the conversation too.

Feedback distinguishes your own attempt from what you completed with help. These are model instructions, so explanations and grading can still be wrong. Check important claims against your course material.

## 🧰 More tools, when you want them

<details>
<summary>Got a specific study task? Open the rest of the toolkit.</summary>

Each of these also works on its own—use whichever fits the moment.

| When you want to… | Skill |
|---|---|
| Map an unfamiliar topic and find a starting point | [`lk-explore`](skills/lk-explore/SKILL.md) |
| Dig into one concept with intuition and examples | [`lk-explain`](skills/lk-explain/SKILL.md) |
| Work on a practice problem and get feedback | [`lk-practice`](skills/lk-practice/SKILL.md) |
| Find the wrong turn in your reasoning | [`lk-diagnose`](skills/lk-diagnose/SKILL.md) |
| Apply a familiar method when the situation changes | [`lk-transfer`](skills/lk-transfer/SKILL.md) |
| Revisit notes or a pasted session recap | [`lk-review`](skills/lk-review/SKILL.md) |

</details>

Learner Kit creates no learner profiles or saved learning records. Your app may retain chat history under its own settings.

Independent of the *Make It Stick* authors and publisher. Code and original instructions: [GNU GPL v3](LICENSE). External source images retain their own usage conditions.
