# Learner Kit

Learner Kit supports adult self-learners and university students through independently usable tutoring skills.

Each skill works on its own from your goal or material and the visible conversation. There is no runtime, account, or saved learner profile. Skills are explicit-only: they start when you select them (for example `$lk-coach`) and never activate just because a request matches their topic.

Release 1 targets Codex and includes nine skills:

| Skill | Use it for | Example |
|---|---|---|
| `lk-explore` | Map a topic: key concepts, prerequisites, connections, and where to start | `$lk-explore Map out what I need to understand about thermodynamics.` |
| `lk-explain` | Understand a concept through intuition, an example, and formalism where useful | `$lk-explain Why are heat and temperature different?` |
| `lk-practice` | Get one problem with a clear success standard, then feedback on your answer | `$lk-practice Give me a first-law energy-balance problem.` |
| `lk-diagnose` | Find where your answer or reasoning went wrong, and why | `$lk-diagnose Where did my reasoning go wrong in this solution? [problem + your working]` |
| `lk-coach` | Get help with a homework problem: hints, explanations, worked examples, retries, or a full solution. You don't need to attempt it first. | `$lk-coach Coach me through this homework problem. [problem]` |
| `lk-recall` | Get quizzed one retrieval question at a time, from memory or with notes | `$lk-recall Quiz me from memory on these notes: [notes]` |
| `lk-transfer` | Apply a method you know when one meaningful thing changes | `$lk-transfer Help me apply this energy-balance method to a different system.` |
| `lk-review` | Review notes, topics, or a pasted recap. No saved history is needed. | `$lk-review Review these notes with me before my exam: [notes]` |
| `lk-learn` | A short guided session toward a goal: explanation, practice, and recall in a sequence that fits your time | `$lk-learn Help me learn energy balances in 30 minutes.` |

Each skill works without the others. A skill may suggest switching to another one (for example from `lk-practice` to `lk-diagnose`). Switching is always optional, and if you decline or the other skill isn't installed, it keeps helping.

## Install in Codex

Install skills user-wide with Codex's built-in `$skill-installer`. Codex discovers user skills in `$CODEX_HOME/skills` (by default `~/.codex/skills`). It does **not** discover this repository's `skills/` folder automatically, so you need to install even if you have cloned the repo.

### One skill

Replace `lk-coach` with the skill you want.

In any Codex chat:

```text
$skill-installer install https://github.com/tdyin/learner-kit/tree/main/skills/lk-coach
```

Or run the installer script directly:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo tdyin/learner-kit --path skills/lk-coach
```

This copies the whole `lk-coach` directory, including `agents/openai.yaml`, to `~/.codex/skills/lk-coach`. That file sets `allow_implicit_invocation: false`, which makes the skill explicit-only. Start a new Codex session so the skill is picked up. It is then available in every project, not just this repository.

### Several or all skills

Pass a single `--path` followed by all the skill paths. Repeating `--path` keeps only the last one.

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo tdyin/learner-kit --path \
  skills/lk-explore skills/lk-explain skills/lk-practice skills/lk-diagnose \
  skills/lk-coach skills/lk-recall skills/lk-transfer skills/lk-review skills/lk-learn
```

The installer refuses to overwrite an existing skill. To update a skill, delete `~/.codex/skills/<name>` first.

### Check it is installed

From a directory outside this repository, start `codex` and type `$`. Each installed skill should appear in the list with a "Learner Kit: …" display name.

## Use

Select the skill explicitly, then talk normally. The activity continues across replies without selecting it again.

```text
$lk-coach Here's my thermo homework: 2.0 mol of an ideal gas expands isothermally
and reversibly at 300 K from 10.0 L to 20.0 L. Find W, Q and ΔU.
I don't know where to start. Hints only, please.
```

### Homework walkthrough with `lk-coach`

1. **Start from the problem.** Paste the problem and say what help you want, for example "hints only", "walk me through it", or "I just want to check my answer". You don't need to set anything up or attempt the problem first.
2. **Get one step at a time.** The coach gives a bounded hint or the next idea and asks one question. Answer it (or don't) whenever you are ready.
3. **Try again.** Your answer after help is treated as a coached retry, separate from your first attempt. If two coached retries on the same step don't work, the coach offers a different explanation, an analogous worked example, an easier task, or a break.
4. **Stay in control.** At any time you can say "show me the full solution", "give me an easier one", "skip", or "stop". Asking for the solution is not counted as a failed attempt.
5. **Assistance limits.** Mentioning homework doesn't trigger questions about course rules. If you state a limit (for example "no final answers"), the coach follows it and checks with you if you later ask for something that conflicts with it.
6. **Recap (optional).** When you finish, you can ask for a short recap to paste into a new chat later. Nothing is saved automatically.

## Limitations

- **Conversation-only memory.** Skills use only what is visible in the current chat. There is no saved history. A pasted recap is treated as something you supplied, not as a verified record.
- **Grading can be wrong.** Feedback comes from the host model. It should state uncertainty, but it can still misjudge an answer.
- **Not a mastery measure.** Getting a step correct just after help shows the help worked for that problem. It is not evidence of lasting learning.
- **Verified in Codex only.** Installation and behavior were checked with Codex CLI 0.159.3, mostly with thermodynamics material and one non-numerical argument. Other hosts, models and subjects may behave differently.
- **Instructions, not guarantees.** The skills are instructions to a model. Observed behavior is recorded in [docs/smoke-checks.md](docs/smoke-checks.md).

## Repository layout

```text
skills/lk-<name>/SKILL.md            Skill instructions (one directory per skill)
skills/lk-<name>/agents/openai.yaml  Codex UI metadata and explicit-only policy
examples/thermodynamics.md           Checked reference material used for verification
docs/smoke-checks.md                 Recorded installation and behavior checks
docs/IMPLEMENTATION_PLAN.md          Release 1 plan
```
