<div align="center">

# 🎓 Learner Kit

**A study buddy for the “wait, why?” moments.**

Bring your curiosity, your notes, or that one problem that refuses to make sense.

[Install](#-installation) · [Get started](#-get-started) · [Pick your help](#-the-skill-set)

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

Learner Kit has four skills: `lk-learn`, `lk-coach`, `lk-recall`, and `lk-explain`. Open your app's instructions below.

<details>
<summary><strong>Codex</strong> — paste this into a Codex chat</summary>

Use Codex's built-in skill installer:

```text
$skill-installer install skills/lk-learn, skills/lk-coach, skills/lk-recall, and skills/lk-explain from https://github.com/tdyin/learner-kit
```

After installation, open a new chat, type `$`, and select `lk-learn`. The skills are available across your projects.

</details>

<details>
<summary><strong>Claude</strong> — install the skills in Claude Code</summary>

Run these commands in a terminal to copy the skills into your personal Claude Code skills folder.

**macOS / Linux**

```sh
git clone https://github.com/tdyin/learner-kit.git
mkdir -p ~/.claude/skills
cp -R learner-kit/skills/lk-learn learner-kit/skills/lk-coach learner-kit/skills/lk-recall learner-kit/skills/lk-explain ~/.claude/skills/
```

**Windows PowerShell**

```powershell
git clone https://github.com/tdyin/learner-kit.git
New-Item -ItemType Directory -Force "$HOME/.claude/skills"
Copy-Item -Recurse learner-kit/skills/lk-learn, learner-kit/skills/lk-coach, learner-kit/skills/lk-recall, learner-kit/skills/lk-explain "$HOME/.claude/skills/"
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

## ✨ The skill set

| Today’s mission | Pick | Try saying… |
|---|---|---|
| 🧭 “Help me learn this.” | [`lk-learn`](skills/lk-learn/SKILL.md) | “Map this topic, walk me through it, then let me practise.” |
| 🧑‍🏫 “I’m stuck on a problem.” | [`lk-coach`](skills/lk-coach/SKILL.md) | “Hints only, please. Here’s the problem and my attempt…” |
| 🧠 “What do I actually remember?” | [`lk-recall`](skills/lk-recall/SKILL.md) | “Quiz me on these notes,” or “Review my notes with me.” |
| 💡 “Why does this work?” | [`lk-explain`](skills/lk-explain/SKILL.md) | “Explain this idea, then test me on it in a new situation.” |

**Not sure? Start with `lk-learn`.** It combines explanation, practice, and recall in a guided session.

## 🎛️ You’re in the driver’s seat

“Give me a hint.” “Make it easier.” “Show the solution.” “Stop.” Tell the tutor what you need. Switching skills is optional and stays your choice.

Diagrams and tables help when an idea is hard to picture. Say **“more visuals”** or **“text only”** to set your preference. Where supported, sourced images can bring real examples into the conversation too.

Feedback distinguishes your own attempt from what you completed with help. These are model instructions, so explanations and grading can still be wrong. Check important claims against your course material.

Learner Kit creates no learner profiles or saved learning records. Your app may retain chat history under its own settings.

Independent of the *Make It Stick* authors and publisher. Code and original instructions: [GNU GPL v3](LICENSE). External source images retain their own usage conditions.
