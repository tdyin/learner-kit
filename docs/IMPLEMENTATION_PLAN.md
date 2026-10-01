# Learner Kit: First Release Implementation Plan

**Status:** Implemented and merged (PRs #7, #8 and #9). All nine skills are on `main`. Every release check has a recorded pass except TR1, which needs a rerun on the current `lk-transfer` wording. See [release-acceptance.md](release-acceptance.md) for the evidence and the remaining caveats.
**Design interview:** Complete. The user confirmed the release scope and recorded decisions.
**Release specification:** [GitHub issue #1](https://github.com/tdyin/learner-kit/issues/1), labeled `ready-for-agent`.
**Scope:** Nine standalone tutoring skills.
**Delivery target:** One developer, 1–2 days (approximately 12–16 focused hours).

## 1. Release goal

Ship all nine skills so a learner can use any one directly in an existing compatible chat host:

`lk-explore`, `lk-explain`, `lk-practice`, `lk-diagnose`, `lk-coach`, `lk-recall`, `lk-transfer`, `lk-review`, and `lk-learn`.

The first release is a collection of skill instructions, examples, and setup documentation. Codex is the first supported host; keep the skill instructions portable, but verify installation and invocation only in Codex for this release. It uses the host's model and visible conversation. Each skill accepts ordinary language and the relevant learning material; none requires a custom runtime, learner profile, database, prior skill invocation, or workflow setup.

The primary audience is adult self-learners and university students. Adjust explanation depth and task difficulty using their requests and attempts rather than assuming a fixed proficiency level.

Support both supplied material and topic-only requests. Prefer relevant material the learner supplies; otherwise generate explanations and exercises from the requested topic. Distinguish generated exercises from source material, and acknowledge uncertain answers or claims.

If supplied material appears incorrect, flag the discrepancy and explain the reasoning. Distinguish the source's claim from the proposed correction. Verify or ask for context when uncertain rather than silently adopting or rewriting the claim.

For example:

> Coach me through this homework problem. Here is the question and where I am stuck.

The learner receives useful coaching immediately, or a short clarification if essential context is missing. They do not need to start `lk-learn`, complete a diagnostic exercise, or enter a practice sequence.

This plan replaces the previous runtime and research roadmap as the implementation source of truth for release 1. All nine skills ship in this release. Persistent tracking and formal evaluation are separate future decisions, not prerequisites.

## 2. What each skill does

| Skill | Minimum starting context | First-release behavior | Example request |
|---|---|---|---|
| `lk-explore` | Topic or learning goal | Give a short map of roughly four to seven concepts, key prerequisites, connections, and a suggested starting point. Ask about background only when it changes the advice. | “Map out what I need to understand about thermodynamics.” |
| `lk-explain` | Concept, question, or supplied material | Explain using intuition and a relevant example, adding formalism and assumptions when useful. Offer an optional check for understanding. | “Explain why heat and temperature are different.” |
| `lk-practice` | Topic, goal, or supplied problem | Present one problem with a clear success standard, wait for an answer, give feedback, and offer help or another problem. | “Give me a first-law energy-balance problem.” |
| `lk-diagnose` | Problem and actual answer or reasoning | Identify the observed error and plausible causes using the learner's words. Ask up to two focused questions if useful; acknowledge uncertainty and avoid persistent misconception labels. | “Where did my reasoning go wrong in this solution?” |
| `lk-coach` | Problem and desired help; an attempt is optional | Help the learner make the next step through hints, a short explanation, or a worked example. Support retries and full-solution requests. | “Help me get started on this homework question.” |
| `lk-recall` | Topic or source material | Ask one retrieval question at a time, wait for the answer, then give feedback. Agree on whether the learner wants to answer from memory or use references. | “Quiz me from memory on these notes.” |
| `lk-transfer` | A source example, method, or familiar concept | Offer a task with one meaningful change in context, representation, or assumptions. Discuss what carries over and what changes after the attempt. If no source example is available, ask for one or establish a simple example first. | “Help me apply this energy-balance method to a different system.” |
| `lk-review` | Notes, topics, a pasted recap, or visible conversation history | Select a small set of relevant ideas to revisit, mix retrieval with practice as appropriate, and summarize gaps observed in this review. Without supplied history, ask what to review. | “Review these notes with me before my exam.” |
| `lk-learn` | Learning goal; background and time available when relevant | Suggest a short learning sequence and guide it conversationally. Use the relevant teaching behaviors, offer transitions, and respect learner overrides. It can begin from a goal alone. | “Help me learn energy balances in 30 minutes.” |

### Distinctions that keep the skills useful

- `lk-explore` maps a topic; `lk-learn` guides a session toward a goal.
- `lk-explain` teaches a concept; `lk-coach` helps with the learner's current task.
- `lk-diagnose` investigates reasoning; `lk-coach` helps the learner proceed. Coaching does not require a separate diagnosis first.
- `lk-practice` applies knowledge; `lk-recall` emphasizes retrieval; `lk-transfer` tests application under a meaningful change.
- `lk-review` revisits selected material. It does not calculate due dates, infer forgotten knowledge from missing records, or maintain a review schedule.

## 3. Independence and optional composition

Every skill must work when installed and invoked on its own. Its instructions include enough teaching guidance to finish its core task without loading another skill.

Use the `lk-` prefix consistently in installed skill names, directory names, and invocation examples. Learners explicitly select a skill to begin; matching an ordinary request must not activate it automatically. Once selected, continue the activity naturally using the visible conversation. Routine teaching transitions within `lk-learn` do not require selecting another skill.

When skills are available together, they can share context already visible in the conversation. A suggested handoff should carry the goal, current problem, learner attempt, help already given, and pending question. Do not make the learner repeat that information when it is already available.

`lk-learn` is an optional entry point. It can guide a session using its own concise instructions; companion skills provide more focused guidance when the host supports loading them. Automatic routing, programmatic dispatch, and host-specific handoff machinery are outside release 1.

If a companion skill is unavailable or a transition is declined, continue useful help in the current skill. For example, `lk-coach` can explain a prerequisite without requiring `lk-explain`.

A learner may end any activity or choose a different skill. There is no required order through the nine skills.

Within `lk-learn`, move naturally between explanation, practice, and other activities while briefly describing the next step. Do not ask permission for every routine transition. Ask before changing the learning goal or substantially increasing difficulty, and always honor learner overrides.

## 4. Shared teaching rules

Include the relevant rules directly in each skill. Small amounts of repeated instruction are acceptable; do not build a shared loading framework.

- Ask one substantive question at a time and wait for an actual learner reply.
- Use supplied context first. Ask only for information needed to provide useful help.
- Offer beginners a short example when useful; let experienced learners attempt a task first. Respect the learner's preferred approach.
- Make the task and success standard clear before practice or retrieval. When reference use matters, agree on it without claiming to monitor external behavior.
- Give a bounded hint when a hint is requested. Do not reveal the whole solution merely because the learner is stuck.
- After two unsuccessful coached retries on the same task, offer a different explanation, analogous worked example, easier task, or break. Do not repeat ineffective hints indefinitely.
- Honor explicit requests for a solution, skip, easier task, or stop. Asking for a solution before attempting a task does not create a failed answer.
- Mention of homework or graded work does not automatically trigger questions about course rules. Start useful help and honor assistance limits the learner supplies. Clarify only when those limits conflict with the requested help; otherwise provide hints or full solutions according to the learner's request. Do not introduce course-management or policy-enforcement infrastructure.
- Ground feedback in the actual answer. Distinguish a clear error from an uncertain interpretation or a defensible alternative.
- Verify calculations and source claims with available references or tools when needed. State uncertainty if verification is unavailable; never invent citations, quotations, or learner evidence.
- Distinguish an initial answer from a coached retry. Success immediately after an explanation is useful practice, not proof of lasting mastery.
- Offer a brief recap when useful: material covered, help needed, and a suggested next step. Avoid mastery percentages, confidence scores, or unsupported claims of improvement.

These are instructions to a model, not deterministic guarantees. Manual checks verify observed behavior in the supported host.

## 5. Context and continuity

Use the current conversation as working context. No files containing learner records are automatically created or updated by the skills.

If the learner wants to continue in a new chat, offer a short recap they can copy and supply later. Treat a pasted recap as learner-provided context, not verified history. Do not require it for any skill to work.

`lk-review` can work from notes or a topic list without previous sessions. `lk-diagnose` needs an actual answer to diagnose; if none is supplied, ask for it. Never reconstruct an attempt that was not provided.

## 6. Deliverables and repository layout

```text
README.md
CONTEXT.md
LICENSE
docs/
  IMPLEMENTATION_PLAN.md
  smoke-checks.md
  release-acceptance.md
skills/
  lk-explore/SKILL.md
  lk-explain/SKILL.md
  lk-practice/SKILL.md
  lk-diagnose/SKILL.md
  lk-coach/SKILL.md
  lk-recall/SKILL.md
  lk-transfer/SKILL.md
  lk-review/SKILL.md
  lk-learn/SKILL.md
  (each skill also has agents/openai.yaml)
examples/
  thermodynamics.md
```

Existing agent configuration stays in place.

Each skill file contains a clear name and task description, minimum inputs, a short procedure, learner controls, limitations, and one example invocation. Follow the supported host's skill format. Every skill directory also includes `agents/openai.yaml` with `policy.allow_implicit_invocation: false` to implement the explicit-selection choice. Avoid large policy tables, internal event formats, and output schemas.

The README explains user-wide installation in Codex using the existing skill installer, with a choice of one skill or all nine. Install the complete selected directories, including their invocation settings. Verify the actual discovery location in the installed Codex version before documenting commands; do not assume the repository's `skills/` directory is discovered automatically. No custom installer is required.

Include an explicit invocation example per skill, a direct `lk-coach` homework walkthrough, and the limits of conversation-only context. Verify installation and invocation outside the learner-kit repository as well as within it. Additional hosts are optional documentation work after the core checks pass.

The example file contains a small verified thermodynamics reference set: concept notes, five problems with expected reasoning and answers, common mistakes, and at least one transfer variant. Record the source used to check the material, including units and sign conventions. Keep solutions out of learner-facing questions until feedback or a solution is appropriate.

Thermodynamics is the main check topic, not a restriction on the skills. Add one short conceptual or argumentative example to the check document to catch instructions that assume every answer is numerical. This is a portability check, not a second subject suite.

## 7. Implementation order and time budget

| Work | Budget | Completion evidence |
|---|---|---|
| Verify one host's skill format and install a minimal skill | 1 h | A skill loads and responds through the documented invocation |
| Write `lk-coach`, `lk-practice`, and `lk-diagnose` | 2–3 h | Direct homework help and an attempt/help/retry loop work |
| Write `lk-explore`, `lk-explain`, `lk-recall`, `lk-transfer`, and `lk-review` | 3–4 h | Each works independently with supplied context |
| Write `lk-learn` and check optional transitions | 1–2 h | A short guided session works without required companion loading |
| Prepare and verify examples | 1–2 h | Reference material and answers are checked |
| Complete README, run checks, and fix failures | 4 h | Installation and all release checks have recorded results |

**Day 1:** establish the host format, write the core skills, and extend to the remaining standalone skills.

**Day 2:** finish `lk-learn`, verify examples, exercise all nine skills, and fix problems in setup or teaching behavior.

The estimate assumes an available model and a host that already supports skill files. It covers a usable first release, not broad subject validation. If time runs short, cut extra hosts, extra examples, and automatic handoffs first. Keep all nine skills and their basic checks in scope. Report a remaining blocker honestly rather than marking unfinished skills complete.

## 8. Lightweight release checks

Check the learner-visible behavior in a real host. No evaluation service, automated judge, or comparison study is required.

### One independent-use check per skill

Run these in fresh conversations with only the tested skill available. In particular, `lk-learn` must be useful when the eight companions are unavailable.

| Skill | Scenario | Expected result |
|---|---|---|
| `lk-explore` | Learner names an unfamiliar topic | Gives a concise map and a practical starting point |
| `lk-explain` | Learner asks about heat versus temperature | Explains the distinction accurately with an example |
| `lk-practice` | Learner requests an energy-balance problem | Presents one task, waits, then gives answer-specific feedback |
| `lk-diagnose` | Learner supplies a solution with a sign error | Identifies the actual error and supports the explanation from the answer |
| `lk-coach` | Learner supplies homework without a prior attempt | Helps them start without forced onboarding or another skill |
| `lk-recall` | Learner supplies notes for a memory quiz | Asks one question, waits, then gives feedback |
| `lk-transfer` | Learner supplies a familiar worked problem | Changes one meaningful dimension and invites an attempt |
| `lk-review` | Learner supplies notes in a fresh chat | Reviews the supplied material without requiring a saved profile |
| `lk-learn` | Learner supplies a goal and a short time budget | Proposes a manageable sequence and begins interactively |

### Shared behavior checks

- A correct first answer receives accurate feedback without unnecessary coaching.
- An ambiguous answer prompts clarification or uncertainty rather than a confident invented diagnosis.
- A bounded hint request does not immediately reveal the full solution.
- Two unsuccessful coached retries lead to a different approach or an exit option.
- Solution, skip, and stop requests are honored; no answer or failure is invented.
- A recap distinguishes an initial error from a successful coached retry.
- A declined or unavailable handoff does not block assistance or lose visible context.
- A new chat without history prompts only for necessary material; no prior learning record is assumed.
- The conceptual or argumentative example receives appropriate feedback without an invented numerical rubric.
- A likely error in supplied notes is flagged with reasoning; uncertainty leads to verification or clarification rather than a fabricated correction.
- `lk-learn` proceeds through routine transitions without repeated permission prompts, but asks before changing the goal or substantially increasing difficulty.
- Homework help begins without automatic course-rule questions; conflicting learner-supplied assistance limits prompt clarification.
- Both single-skill installation and all-nine installation work from the README. With all nine installed, explicit invocations select the intended skill, especially `lk-review` and `lk-learn`.
- Each skill's installed name and directory use the `lk-` prefix; its invocation settings disable implicit selection. In a fresh chat, a matching request without selecting a skill does not load that skill.
- User-wide installation makes selected skills available outside this repository. A directly selected skill remains useful across follow-up turns without repeated selection.

Record the host/model, date, scenario, observed result, and any issue in `docs/smoke-checks.md`. Fix failures and rerun affected scenarios. A second person trying the setup is useful if available, but reviewer recruitment is not a release dependency.

Block completion for broken installation, a missing or unusable skill, known incorrect reference answers, fabricated learner evidence, unwanted full-answer disclosure during a hint check, or ignored stop requests. Passing these checks supports a basic usability claim only; it does not demonstrate improved learning outcomes.

## 9. Out of scope for release 1

- Custom terminal or web applications, backend services, accounts, and model-provider integrations.
- Deterministic controllers, routing engines, event schemas, transport logging, receipts, replay, snapshots, and recovery.
- Persistent learner profiles, automatic note storage, correction queues, evidence exports, and deletion workflows.
- Mastery calculations, misconception lifecycle tracking, confidence calibration, spaced-review scheduling, and reminders.
- Large question banks, multiple reviewed subject suites, named reviewer teams, and human adjudication processes.
- A/B/C/D comparisons, simulated learners, held-out pools, power analysis, preregistered studies, and learning-efficacy claims.
- Plugin marketplace submission and support for multiple host integrations.

Future work requires a concrete need observed during use. There are no mandatory follow-on milestones attached to this release.

## 10. Definition of done

Evidence for each item is in [release-acceptance.md](release-acceptance.md) and [smoke-checks.md](smoke-checks.md).

- [x] All nine skill files exist and load in the documented host.
- [ ] Each skill passes its independent-use check with no companion skills installed. **Pending for `lk-transfer` only:** TR1 passed at `56520ea`, but the skill's well-posedness wording changed afterwards (`82735ce`). TR1 must be rerun on the current wording. The other eight skills have recorded passes.
- [x] `lk-coach` handles homework directly with an optional attempt and no workflow setup.
- [x] `lk-review` works from supplied material; `lk-learn` guides a session without a runtime.
- [x] Shared behavior checks pass and outcomes are recorded.
- [x] Example answers have been verified and sources recorded.
- [x] README installation and invocation instructions work for one skill and all nine.
- [x] All nine `lk-` names and explicit-selection settings are verified; user-wide installation works outside this repository.
- [x] Limitations on memory, grading reliability, and learning claims are documented.

**Open caveats** (not blocking):

- Some checks passed on the wording just before the final targeted fixes and were not repeated afterwards.
- Only Codex CLI 0.159.3 has been verified.

The full list is in [release-acceptance.md](release-acceptance.md).
