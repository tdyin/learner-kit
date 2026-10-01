# Learner Kit: First Release Implementation Plan

**Status:** Ready for implementation; skills and checks are not implemented yet.
**Scope:** Nine standalone tutoring skills.
**Delivery target:** One developer, 1–2 days (approximately 12–16 focused hours).

## 1. Release goal

Ship all nine skills so a learner can use any one directly in an existing compatible chat host:

`explore`, `explain`, `practice`, `diagnose`, `coach`, `recall`, `transfer`, `review`, and `learn`.

The first release is a collection of skill instructions, examples, and setup documentation. It uses the host's model and visible conversation. Each skill accepts ordinary language and the relevant learning material; none requires a custom runtime, learner profile, database, prior skill invocation, or workflow setup.

For example:

> Coach me through this homework problem. Here is the question and where I am stuck.

The learner receives useful coaching immediately, or a short clarification if essential context is missing. They do not need to start `learn`, complete a diagnostic exercise, or enter a practice sequence.

This plan replaces the previous runtime and research roadmap as the implementation source of truth for release 1. All nine skills ship in this release. Persistent tracking and formal evaluation are separate future decisions, not prerequisites.

## 2. What each skill does

| Skill | Minimum starting context | First-release behavior | Example request |
|---|---|---|---|
| `explore` | Topic or learning goal | Give a short map of roughly four to seven concepts, key prerequisites, connections, and a suggested starting point. Ask about background only when it changes the advice. | “Map out what I need to understand about thermodynamics.” |
| `explain` | Concept, question, or supplied material | Explain using intuition and a relevant example, adding formalism and assumptions when useful. Offer an optional check for understanding. | “Explain why heat and temperature are different.” |
| `practice` | Topic, goal, or supplied problem | Present one problem with a clear success standard, wait for an answer, give feedback, and offer help or another problem. | “Give me a first-law energy-balance problem.” |
| `diagnose` | Problem and actual answer or reasoning | Identify the observed error and plausible causes using the learner's words. Ask up to two focused questions if useful; acknowledge uncertainty and avoid persistent misconception labels. | “Where did my reasoning go wrong in this solution?” |
| `coach` | Problem and desired help; an attempt is optional | Help the learner make the next step through hints, a short explanation, or a worked example. Support retries and full-solution requests. | “Help me get started on this homework question.” |
| `recall` | Topic or source material | Ask one retrieval question at a time, wait for the answer, then give feedback. Agree on whether the learner wants to answer from memory or use references. | “Quiz me from memory on these notes.” |
| `transfer` | A source example, method, or familiar concept | Offer a task with one meaningful change in context, representation, or assumptions. Discuss what carries over and what changes after the attempt. If no source example is available, ask for one or establish a simple example first. | “Help me apply this energy-balance method to a different system.” |
| `review` | Notes, topics, a pasted recap, or visible conversation history | Select a small set of relevant ideas to revisit, mix retrieval with practice as appropriate, and summarize gaps observed in this review. Without supplied history, ask what to review. | “Review these notes with me before my exam.” |
| `learn` | Learning goal; background and time available when relevant | Suggest a short learning sequence and guide it conversationally. Use the relevant teaching behaviors, offer transitions, and respect learner overrides. It can begin from a goal alone. | “Help me learn energy balances in 30 minutes.” |

### Distinctions that keep the skills useful

- `explore` maps a topic; `learn` guides a session toward a goal.
- `explain` teaches a concept; `coach` helps with the learner's current task.
- `diagnose` investigates reasoning; `coach` helps the learner proceed. Coaching does not require a separate diagnosis first.
- `practice` applies knowledge; `recall` emphasizes retrieval; `transfer` tests application under a meaningful change.
- `review` revisits selected material. It does not calculate due dates, infer forgotten knowledge from missing records, or maintain a review schedule.

## 3. Independence and optional composition

Every skill must work when installed and invoked on its own. Its instructions include enough teaching guidance to finish its core task without loading another skill.

When skills are available together, they can share context already visible in the conversation. A suggested handoff should carry the goal, current problem, learner attempt, help already given, and pending question. Do not make the learner repeat that information when it is already available.

`learn` is an optional entry point. It can guide a session using its own concise instructions; companion skills provide more focused guidance when the host supports loading them. Automatic routing, programmatic dispatch, and host-specific handoff machinery are outside release 1.

If a companion skill is unavailable or a transition is declined, continue useful help in the current skill. For example, `coach` can explain a prerequisite without requiring `explain`.

A learner may end any activity or choose a different skill. There is no required order through the nine skills.

## 4. Shared teaching rules

Include the relevant rules directly in each skill. Small amounts of repeated instruction are acceptable; do not build a shared loading framework.

- Ask one substantive question at a time and wait for an actual learner reply.
- Use supplied context first. Ask only for information needed to provide useful help.
- Offer beginners a short example when useful; let experienced learners attempt a task first. Respect the learner's preferred approach.
- Make the task and success standard clear before practice or retrieval. When reference use matters, agree on it without claiming to monitor external behavior.
- Give a bounded hint when a hint is requested. Do not reveal the whole solution merely because the learner is stuck.
- After two unsuccessful coached retries on the same task, offer a different explanation, analogous worked example, easier task, or break. Do not repeat ineffective hints indefinitely.
- Honor explicit requests for a solution, skip, easier task, or stop. Asking for a solution before attempting a task does not create a failed answer.
- When the learner identifies graded work, clarify any relevant assistance rules. Do not introduce course-management or policy-enforcement infrastructure.
- Ground feedback in the actual answer. Distinguish a clear error from an uncertain interpretation or a defensible alternative.
- Verify calculations and source claims with available references or tools when needed. State uncertainty if verification is unavailable; never invent citations, quotations, or learner evidence.
- Distinguish an initial answer from a coached retry. Success immediately after an explanation is useful practice, not proof of lasting mastery.
- Offer a brief recap when useful: material covered, help needed, and a suggested next step. Avoid mastery percentages, confidence scores, or unsupported claims of improvement.

These are instructions to a model, not deterministic guarantees. Manual checks verify observed behavior in the supported host.

## 5. Context and continuity

Use the current conversation as working context. No files containing learner records are automatically created or updated by the skills.

If the learner wants to continue in a new chat, offer a short recap they can copy and supply later. Treat a pasted recap as learner-provided context, not verified history. Do not require it for any skill to work.

`review` can work from notes or a topic list without previous sessions. `diagnose` needs an actual answer to diagnose; if none is supplied, ask for it. Never reconstruct an attempt that was not provided.

## 6. Deliverables and repository layout

```text
README.md
docs/
  IMPLEMENTATION_PLAN.md
  smoke-checks.md
skills/
  explore/SKILL.md
  explain/SKILL.md
  practice/SKILL.md
  diagnose/SKILL.md
  coach/SKILL.md
  recall/SKILL.md
  transfer/SKILL.md
  review/SKILL.md
  learn/SKILL.md
examples/
  thermodynamics.md
```

Existing agent configuration stays in place.

Each skill file contains a clear name and trigger description, minimum inputs, a short procedure, learner controls, limitations, and one example invocation. Follow the supported host's skill format. Avoid large policy tables, internal event formats, and output schemas.

The README explains how to install either one skill or all nine in one verified host. Include an invocation example per skill, a direct homework-coaching walkthrough, and the limits of conversation-only context. Verify actual installation instructions during implementation. Additional hosts are optional documentation work after the core checks pass.

The example file contains a small verified thermodynamics reference set: concept notes, five problems with expected reasoning and answers, common mistakes, and at least one transfer variant. Record the source used to check the material, including units and sign conventions. Keep solutions out of learner-facing questions until feedback or a solution is appropriate.

Thermodynamics is the main check topic, not a restriction on the skills. Add one short conceptual or argumentative example to the check document to catch instructions that assume every answer is numerical. This is a portability check, not a second subject suite.

## 7. Implementation order and time budget

| Work | Budget | Completion evidence |
|---|---|---|
| Verify one host's skill format and install a minimal skill | 1 h | A skill loads and responds through the documented invocation |
| Write `coach`, `practice`, and `diagnose` | 2–3 h | Direct homework help and an attempt/help/retry loop work |
| Write `explore`, `explain`, `recall`, `transfer`, and `review` | 3–4 h | Each works independently with supplied context |
| Write `learn` and check optional transitions | 1–2 h | A short guided session works without required companion loading |
| Prepare and verify examples | 1–2 h | Reference material and answers are checked |
| Complete README, run checks, and fix failures | 4 h | Installation and all release checks have recorded results |

**Day 1:** establish the host format, write the core skills, and extend to the remaining standalone skills.

**Day 2:** finish `learn`, verify examples, exercise all nine skills, and fix problems in setup or teaching behavior.

The estimate assumes an available model and a host that already supports skill files. It covers a usable first release, not broad subject validation. If time runs short, cut extra hosts, extra examples, and automatic handoffs first. Keep all nine skills and their basic checks in scope. Report a remaining blocker honestly rather than marking unfinished skills complete.

## 8. Lightweight release checks

Check the learner-visible behavior in a real host. No evaluation service, automated judge, or comparison study is required.

### One independent-use check per skill

Run these in fresh conversations with only the tested skill available. In particular, `learn` must be useful when the eight companions are unavailable.

| Skill | Scenario | Expected result |
|---|---|---|
| `explore` | Learner names an unfamiliar topic | Gives a concise map and a practical starting point |
| `explain` | Learner asks about heat versus temperature | Explains the distinction accurately with an example |
| `practice` | Learner requests an energy-balance problem | Presents one task, waits, then gives answer-specific feedback |
| `diagnose` | Learner supplies a solution with a sign error | Identifies the actual error and supports the explanation from the answer |
| `coach` | Learner supplies homework without a prior attempt | Helps them start without forced onboarding or another skill |
| `recall` | Learner supplies notes for a memory quiz | Asks one question, waits, then gives feedback |
| `transfer` | Learner supplies a familiar worked problem | Changes one meaningful dimension and invites an attempt |
| `review` | Learner supplies notes in a fresh chat | Reviews the supplied material without requiring a saved profile |
| `learn` | Learner supplies a goal and a short time budget | Proposes a manageable sequence and begins interactively |

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
- Both single-skill installation and all-nine installation work from the README. With all nine installed, explicit invocations select the intended skill, especially `review` and `learn`.

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

- [ ] All nine skill files exist and load in the documented host.
- [ ] Each skill passes its independent-use check with no companion skills installed.
- [ ] `coach` handles homework directly with an optional attempt and no workflow setup.
- [ ] `review` works from supplied material; `learn` guides a session without a runtime.
- [ ] Shared behavior checks pass and outcomes are recorded.
- [ ] Example answers have been verified and sources recorded.
- [ ] README installation and invocation instructions work for one skill and all nine.
- [ ] Limitations on memory, grading reliability, and learning claims are documented.

**First implementation action:** create and load `coach/SKILL.md`, then use it on one supplied homework problem. Build the remaining skills from that verified standalone pattern.
