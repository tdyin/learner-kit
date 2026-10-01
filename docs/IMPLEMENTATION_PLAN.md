# Learner Kit Implementation Plan

**Status:** Ready to begin development planning; no implementation or evaluation results are claimed.

**Date:** September 30, 2026

Build a small, complete tutoring loop, test it against a strong tutoring prompt, and harden durable learner state only if the comparison supports continuing. This file is the implementation source of truth. Completed planning does not mean the product or its experiments are complete.

## 1 Scope and delivery order

Target individual adult learners studying bounded topics. Start with thermodynamics and a contrasting suite about historical arguments concerning the causes of World War I. Rust ownership and immunology are later generality checks.

The reference product is a local terminal chat driven by code that owns model calls, message capture, routing, and state. Phase 1 ships `practice`, `diagnose`, and `coach`. It does not ship a course platform, autonomous curriculum planner, mastery labels, or scheduling. Every skill must also support direct, independent use in a compatible chat host with minimal task context. Tracking and orchestration are optional enhancements for that use; instruction-only installation does not provide the runtime's evidence or persistence guarantees.

All numeric thresholds below are versioned engineering defaults to evaluate, not research-established optima. Behavioral comparisons, usability findings, and human learning outcomes require different evidence.

| Milestone | Depends on | Deliverable | Exit decision |
|---|---|---|---|
| M0 Setup and resource plan | This plan | Stack decision, named owners, costed protocol and development backlog | Capacity exists for development and comparison |
| M1 Phase 1a tutoring loop | M0 | Three skills, session controller, reviewed items, session recap | Capture and interaction fixtures pass |
| M2 Phase 1a comparison | M1 and reviewed development families | Harness, joint simulation, held-out A/B report | Comparative and absolute gates justify continuing |
| M3 Phase 1b durable prototype | M2 advance decision | Durable engine, correction, export, recovery, adult usability pilot | Persistence checks and critical usability fixes pass |
| M4 Phase 2 adaptation | M3 | Five later skills, derived state, review, selective deletion, C/D comparison | Extra persistence complexity is justified for the next study |
| M5 Phase 3 human study | M4 decision | Preregistered comparative learning pilot and results | Expand, simplify, or revise on evidence |
| M6 Phase 4 orchestration | Earlier comparisons justify it | Adaptive `learn` routing and optional trusted host features | Routing improves outcomes or reduces burden |

Do not build M3 persistence hardening or M4 derived features to avoid an inconclusive M2 result. Simplification or stopping is a valid outcome.

## 2 Work packages and acceptance checks

### M0 Setup and resource plan

Owner roles below must be assigned to named people before commissioning the comparison pool. Roles may be combined if capacity and domain competence are recorded; the tutor cannot adjudicate its own classifications.

- [ ] Assign an implementation lead, evaluation lead, thermodynamics reviewer, history reviewer, assistance-classification reviewer and backup, and usability-study owner.
- [ ] Choose the implementation language, package manager, model provider, schema validator, test runner, and terminal I/O approach. Record these decisions in `docs/architecture.md`; this plan does not assume a stack or provider.
- [ ] Freeze the initial checkpoint and scoring contract from the evaluation section below before estimating authoring work.
- [ ] Create `evals/protocol.md` and `evals/resource-plan.md`. Record staff hours, calendar capacity, hours per family/prefix/branch, model costs, adjudication costs, maximum affordable family count, reviewer throughput, and maximum queue-drain time before score freeze.
- [ ] Specify prefixes per family, branches per prefix, repeats per branch, expected scoring-determinative turns per run, and any item-specific neutral probes. Estimate review volume from both arms' development runs.
- [ ] Budget at least 15 development families and 30 distinct validation families, including contrasting-domain coverage. Every gate has its own applicable-family requirement. Reserve capacity for one fresh validation cycle after revision.
- [ ] Cost the initial 270 runs per condition, including repeats: 170 primary plus 100 ambiguous-prefix runs. This is a floor, not a power claim or final sample size.
- [ ] Establish separate development, validation, and access-controlled final-test pools. Keep private learner records out of the source repository.

**Acceptance:** the resource plan contains real assignments, capacity, ceilings, and a stopping rule. If revised sizing or review load exceeds capacity, use the predeclared simpler decision rule and rerun simulation before held-out inspection. If still unaffordable, stop and report the design as unvalidated. At the budget ceiling or after the reserved repeat, record a new continue/simplify/stop decision and resource plan before further validation.

### M1 Phase 1a tutoring loop

**Owner:** implementation lead, supported by both domain reviewers. Use session-local state and immutable evaluation transcripts.

- [ ] Define machine-readable event and skill-result schemas with a contract validator. Include model proposals, controller-owned records, receipts, eligibility reasons, item lifecycle, pending input, and skill handoffs. Defer durable snapshot implementation to M3.
- [ ] Implement the terminal surface, model adapter, controlled transport logger, proposal validator, session state machine, and deterministic score-to-standard mapping.
- [ ] Capture every incoming learner message verbatim before the next model call and every delivered tutor turn/tool result. The model must not write response, presentation, delivery, or exposure records.
- [ ] Implement `practice`, `diagnose`, and `coach` under the tutoring contract below. Unavailable skills cannot be routes.
- [ ] Document minimal inputs and verify direct invocation of each initial skill without the runtime, a learner profile, prior skill calls, or workflow setup. Include coaching on a learner-supplied homework problem; apply the same independent-use contract to later skills when shipped.
- [ ] Add commands and equivalent natural-language actions for hint, solution, skip, pause, progress, and record challenges. M1 progress is session-only; challenges are recorded for development review. Do not promise durable correction or resumption yet.
- [ ] Implement per-target assistance, exposure, and immediate-near-transfer eligibility before generating session recap counts.
- [ ] Author at least ten thermodynamics development families and five history families. Include references, rubrics, target mappings, critical errors, acceptable alternatives, resource policy, and difficulty rationale.
- [ ] Implement the Phase 1a subset of the acceptance fixtures below, including requested hints preserving counters and fallback obligations.
- [ ] Demonstrate novice entry, an attempt, diagnosis, help, retry, fresh check, skip, pause, and a truthful recap.
- [ ] Run a small formative walkthrough on development families. Inspect entry choices, commands, feedback, recap exclusions, and record challenges; revise before the full comparison. Keep these families out of held-out pools.

**Acceptance:** one complete tutoring loop works in both domains; scores reference captured evidence; original responses and failures survive retries; skips and answer requests do not invent failures; recap counts obey eligibility. This is a development milestone, not a release or learning-efficacy claim.

### M2 Phase 1a comparison

**Owner:** evaluation lead. Item writing and review are expected to dominate effort.

- [ ] Build credible A and B conditions with comparable development effort, the same tutor model/tools/materials, and equal task briefings and learning-time opportunity.
- [ ] Implement frozen-prefix diagnostic branches, paired scripted main runs, separate adaptive simulations, external judging, classification review intake, and the complete evaluation record schema.
- [ ] Implement all protocol fixtures below. Reject missing metric/applicability inputs, duplicated diagnosis scores, and continuation scripts without leakage opportunities.
- [ ] Run each development scenario at least three times. Audit references, persona fidelity, assistance classifications, and score applicability before relying on those outcomes.
- [ ] Simulate the complete joint advance rule from development outcomes, vary dependence assumptions, and choose held-out counts that satisfy both floors and simulated decision power.
- [ ] Write the held-out pool up to known floors after M0; families beyond the floor depend on simulation. Freeze prompts, policies, items, allocation, rubrics, interval method, costs, and gates before the held-out run.
- [ ] Run the paired A/B comparison, complete adjudication, and publish rates, counts, uncertainty, strata, invalid/excluded runs, cost, and the advance decision.

**Acceptance:** all applicable deterministic fixtures and absolute release gates pass, and B meets the comparative advance rule. An inconclusive result does not authorize M3/M4 expansion. Verify repairs using known development regressions; if the candidate changes after held-out inspection, use fresh validation families for a renewed comparative claim. Inspected families become development evidence.

### M3 Phase 1b durable prototype

**Owner:** implementation lead. Keep the registry fixed and diagnoses proposed-only.

- [ ] Implement the single-writer event store, artifact store, snapshot schema, state revision checks, idempotency receipts, and atomic snapshots.
- [ ] Persist pending output and questions before display, capture delivery receipts, and conservatively recover uncertain delivery as possible exposure.
- [ ] Add restart recovery, replay, interrupted-tail quarantine, stale/corrupt snapshot rebuild, and explicit behavior on storage failure.
- [ ] Add assessment and assistance-classification correction events, original-time replay, inspectable records, export, and whole-learner-store deletion including derived copies.
- [ ] Implement the classification-challenge workflow: immediate acknowledgement, conservative pending eligibility, human review within two working days during the pilot, and correction provenance. Disclose absent reviewer coverage without promising clearance.
- [ ] Compact model context only. Preserve evidence and retrieve older artifacts by reference.
- [ ] Run persistence/replay/deletion fixtures and demonstrate pause/resume without fabricated answers or silently unsaved progress.
- [ ] After capture, correctness, and persistence checks pass, run a five-to-eight-person adult usability pilot. Examine help, skips, ratings burden, feedback, evidence inspection, completion, and resumption. Record confusion and resulting changes; resolve critical usability issues.

**Acceptance:** applicable fixtures and behavioral gates pass, no known severe factual or evidence-integrity defect remains, and learners can complete/skip/request help/inspect/correct/resume without misrepresented evidence. Selective deletion, mastery, scheduling, and hypothesis activation remain deferred.

### M4 Phase 2 adaptation and persistence comparison

**Owners:** implementation and evaluation leads.

- [ ] Implement hypothesis activation/resolution/retraction, target progress, confidence calibration, scheduling, and their replay rules from the state contract below.
- [ ] Add selective deletion with dependency-aware rebuilding before exposing that operation. Add learner-specific registry entries; defer reversible concept merges until actual duplicates justify them.
- [ ] Implement `explore`, `explain`, `recall`, `transfer`, and `review`; move substantial prerequisite/concept teaching from `coach` to `explain` without resetting the pending item's history or counters.
- [ ] Enable review offers, persisted offer suppression, and candidate interleaving after two relevant concepts have successful practice evidence. Start at roughly one older item in three and permit opt-out. M1–M3 retain explicit item sequences.
- [ ] Run all derived-state, timing, calibration, scheduling, correction, and deletion fixtures before enabling the features.
- [ ] Implement C and D with equal declared memory-context budgets. Predeclare multi-session cases covering D's omissions, false confidence, evidence drift, and correction handling, plus C's rigid rules, unhelpful stale downgrades, context gaps, latency, and costs.
- [ ] Report C/D adaptation, evidence retention, burden, cost, and limits before deciding whether structured persistence merits a human comparison.

**Acceptance:** ordered status/reset rules, delayed resolution, eligibility, scheduling idempotency, and replay equivalence pass. Later skills meet their rubrics. If notes perform comparably at lower cost, retain them as a serious product option. Simulated advantages do not establish human learning gains.

### M5 Phase 3 comparative human pilot

**Owner:** study owner with evaluation lead and domain reviewers.

- [ ] Preregister conditions, contrasts, minimum meaningful effect, sample-size rationale, analysis, and missing-data handling before recruitment. Use all four arms or explicitly named staged contrasts; include C/D when claiming an advantage over notes.
- [ ] Randomize adult learners, stratify by baseline proficiency where feasible, and adjust analyses for baseline.
- [ ] Use reviewed parallel pre-test/post-test forms, comparable sessions across multiple days, immediate assessment, and an unaided delayed test about one week after the final session. Record intervening study; keep final answers unavailable during tutoring.
- [ ] Make baseline-adjusted delayed independent performance primary. Report immediate performance, near/broader transfer, fresh-item assistance, calibration, completion, frustration, learning time, and cost as secondary outcomes.
- [ ] Blind graders where feasible; explain data collection, voluntary participation, and withdrawal. Report attrition and missing delayed tests by condition.
- [ ] Publish protocol, results, uncertainty, and limitations. A small pilot estimates feasibility, not definitive efficacy.

**Acceptance:** a documented expand/simplify/revise decision; no positive result is required. Add homework, topic-learning, and exam-preparation workflows only when their underlying capabilities are stable.

### M6 Phase 4 adaptive orchestration

- [ ] Add `learn` only if earlier comparisons justify coordination. Test pending-input handling, route selection, loop prevention, learner overrides, and outcomes or burden.
- [ ] Treat course-managed integrity mode and additional host adapters as separate optional projects. A new host must intercept every incoming message, outgoing tutor message, and learner-visible tool result before claiming equivalent evidence guarantees.

## 3 Planned repository and runtime boundaries

Paths below are deliverables to create during the relevant milestone, not claims that they exist now.

```text
IMPLEMENTATION_PLAN.md
README.md
docs/
  architecture.md
  contracts.md
  learner-state.md
  policies.md
schemas/
  event.schema.json
  skill-result.schema.json
  snapshot.schema.json
runtime/
  controller/
  reducer/
  storage/
skills/
  practice/SKILL.md
  diagnose/SKILL.md
  coach/SKILL.md
evals/
  protocol.md
  resource-plan.md
  fixtures/
  development/
  validation/
  rubrics/
  personas/
  simulation/
  results/
examples/
  thermodynamics.md
  history-argument.md
```

Keep final tests independently access-controlled outside development context. Later milestones add skill directories as capabilities become available. Extract detailed implementation documentation from this plan without introducing conflicting copies of policy.

The runtime loads a selected skill, calls the model, validates structured proposals, commits accepted actions, renders output, and captures responses before another call. The model proposes assessments and teaching actions; the controller alone creates verbatim response, presentation, delivery, and exposure records. Reject invented learner messages and evidence quotes that differ from captured text. External work is a learner report, not a captured attempt.

The engine issues event, hypothesis, session, invocation, response, and presentation identities, timestamps, sequences, and action ordinals. An accepted `(invocation_id, action_ordinal)` plus payload hash is the idempotency key: repeated delivery returns the original receipt/IDs; altered payload is rejected. Regenerating rejected output uses a new invocation ID. Incoming transport receipts distinguish deliveries; identical answer text alone is not deduplication evidence.

| Invocation state | Controller behavior |
|---|---|
| `awaiting_input` | Preserve pending question; resume only on learner input; no fabricated response-dependent route |
| `completed` | Commit actions before considering the optional recommended next route |
| `cancelled` | Preserve evidence and stop the activity |
| `blocked` | Explain failed reference/tool/storage dependency and offer a supported fallback |

Allow events while an invocation is pending. `next` may be null and must reference an available capability. Handoffs are recommendations subordinate to learner choice and active policy. Internal schemas and handoffs do not appear as routine learner-facing text.

Phase 1 events cover session open/close, preferences, item presentation, captured responses, assessment proposal/acceptance, assistance, proposed diagnosis, invocation changes, and item closure. Corrections append the superseded judgment, preserving original response time and text. Phase 2 adds registry changes, full hypothesis dispositions, and derived schedule behavior.

Durable layout, outside the source repository by default. Partition logical state by topic and stable target inside one learner store so cross-topic review does not duplicate evidence:

```text
<learner-data-root>/<learner-id>/
  events.jsonl
  artifacts/
  snapshot.json
```

Use one local writer per learner store, serialize commits, validate revisions, and replace snapshots atomically. Store schema/policy versions, last applied sequence, and derivation time. Recover only complete committed events; quarantine incomplete tails. Rebuild corrupt or stale snapshots. Snapshot and replay results must match under identical policy and time. A failed write stops durable operation or enters clearly disclosed session-only mode. Compact working context, never silently delete full evidence under an arbitrary attempt cap. Whole-store and selective deletion follow their milestone boundaries despite append-only normal operation.

The engine guarantees captured provenance and legal transitions, not grading truth, diagnostic truth, family annotations, or unseen external learner behavior.

## 4 Tutoring and interaction contract

### Learner choices and entry

Show the task, rubric standard, allowed references/tools, and assistance policy before the learner answers. Ask one substantive question at a time; optional confidence may accompany an answer. Honor requests to skip, change difficulty, decline ratings/self-explanation, stop, or obtain a full solution in ordinary tutoring mode. Offer at most one optional method-focused follow-up after a solution. Short replies alone do not establish frustration; record adjustments such as an easier task rather than psychological labels.

For a learner reporting a new concept, offer a worked example, faded example, then fresh unassisted item. The final item is immediate application, not delayed evidence. For experienced learners offer an attempt first. Unknown history is not proof of novice status: ask one short background question or offer a choice. Learner preference takes priority within policy.

Ordinary tutoring is default. Mention of graded work prompts policy clarification, not silent restrictions. Learner-selected integrity mode is reversible by the learner. Authenticated course-managed restrictions are deferred until a trusted host exists. In integrity mode, level 4 is a ceiling, not automatic permission: cumulative partial help must not assemble a submission-ready answer or essay. Offer an analogous worked task instead.

### Independent use and optional composition

Every skill is a usable entry point. Learners may invoke `coach` on homework, `diagnose` on an existing answer, or any other available skill without first starting `learn` or completing another activity. `learn` is an optional coordinator. No skill requires a learner profile, registry, stored history, or the custom runtime to provide its core teaching behavior.

- Use the problem, goal, answer, or material supplied in the current conversation. Ask only for missing context needed for the requested help. For `coach`, a problem and where the learner is stuck are enough; a prior attempt is optional. For `diagnose`, request the actual answer or reasoning when absent rather than inventing evidence.
- For example: “Coach me through this homework problem. Here is the problem and my attempt.” Begin with relevant help or a necessary clarification; do not require onboarding, a diagnostic session, or a practice sequence. Existing tutoring and graded-work policies still apply.
- Share relevant context when skills are used together, including the original attempt, help already given, and pending question. Handoffs are optional suggestions, and the current skill must remain useful if a companion skill is unavailable or the learner declines the handoff. This includes conceptual teaching within `coach` when `explain` is unavailable.
- Registry entries, reviewed items, rubrics, and prior records enrich runtime-backed sessions when available. Their absence must not block standalone help on supplied material. Clarify assumptions or grading uncertainty; do not represent an unreviewed task as a validated assessment.
- In standalone mode, use the visible conversation for a qualitative recap. Do not claim durable tracking, controller-verified provenance, mastery, or missing historical evidence. When the runtime is present, its capture, eligibility, and persistence contracts continue to apply.

### Initial skill responsibilities

| Skill | Responsibilities and limits |
|---|---|
| `practice` | Read goal, registry, preferences, relevant responses/help, and proposed/active hypotheses; choose a reviewed item; propose presentation and assessment. Proposed hypotheses may guide a probe but do not establish weakness. Hide answers until an attempt or authorized request, except identified worked examples. After two independent successes on distinct items in a session, offer a variant or finish; this is not mastery. |
| `diagnose` | Use actual failed/partial response, rubric, assistance, and prior evidence. Ask at most two targeted probes. State supporting response references, alternatives, and low/medium/high confidence. Abstain when causes cannot be distinguished. Retries on one item are not independent misconception confirmations. Probes are instructional by default. |
| `coach` | Supply useful help, preserve initial performance, and manage retries/fallback. In Phase 1 supply conceptual or prerequisite teaching when needed; in Phase 2 delegate substantial teaching to `explain` while retaining item history. |

Diagnosis categories: missing prerequisite, terminology confusion, wrong mental model, concept distinction, method selection, execution error, forgotten knowledge, transfer difficulty, and insufficient evidence. Existing hypotheses are candidates, not presumptions.

Use computation, executable checks, and reviewed references where appropriate. Verify derivations and distinguish errors from defensible alternative arguments. Uncertain grading requires clarification/verification, not an invented failure. Never fabricate sources or quotations.

### Assistance and fallback

| Level | Meaning |
|---|---|
| 0 | No item-specific assistance |
| 1 | Guiding question or relevant-concept cue |
| 2 | Conceptual hint |
| 3 | Relevant equation, rule, or method |
| 4 | Partial worked solution |
| 5 | Complete solution |

Start at the lowest likely useful level and allow a response. Maintain two per-item counters:

- Below-standard submitted retries after level 1 or 2 increment the low-level counter. At two, the next action must be level 3 or a fallback, not another low-level cue.
- Below-standard submitted retries after level 3 or 4 increment the higher-level counter across both levels. At one, stay at 3 or move to 4 as appropriate; at two, offer an analogous worked example, easier task, or break before another target-item hint.
- Ungraded replies/skips do not increment counters. Skill changes do not reset them; a new item does. Success closes the item. Automatic escalation never proceeds to level 5.
- A requested hint changes level selection without resetting or suspending counters or fallback obligations. An explicit authorized full-solution request closes the item as `shown`, preserving earlier failure and creating no invented success.

Capture every tutor turn and learner-visible tool result. Default non-generic free-form turns to assistance/possible exposure. Only exact reviewed neutral/generic templates auto-clear; a model's harmlessness claim cannot clear its output. A neutral probe requests existing reasoning without evaluating it, naming a concept, suggesting a distinction, or directing a next step. A component-versus-total-pressure cue is at least level 1 even if called diagnostic. Permitted compiler diagnostics may be resource context; tutor interpretation or suggested fixes are assistance. Unknown tool status disqualifies affected evidence.

The evaluation lead assigns human review of every non-template turn that could determine first assistance or escalation scoring in either arm, plus challenges and disputed classifications. Intake is automatic, not dependent on tutor requests. Reviewers record identity, rationale, targets, rubric version, and classification provenance. Audit a sample of retained conservative classifications and their effects. Runtime exclusions remain conservative; a conservative default alone is not a failed help score. Scoring uses adjudicated classifications. Unresolved required metrics prevent advancement at the queue deadline; report completed metrics and unresolved counts without dropping cases.

### Recap and later skills

M1 shows session counts; M3 adds durable inspection/correction/resumption; M4 adds status reason, evidence date/count, resource/tool conditions, review date, and eligible topic calibration. Link counts to inspectable interaction records. Report initial independence, assisted success, and near transfer separately. For two ordinary failures and eight near-transfer successes, show `0/2` independent checks and `8/8` near transfer, never `8/10`. State reporting windows and explain a near-transfer failure that caused a downgrade separately.

| Later skill | Implementation boundary |
|---|---|
| `explore` | Short map of four to seven concepts, prerequisites, connections, and a starting point; registry changes go through the engine |
| `explain` | Bounded intuition/examples/formalism/assumptions/connections; optional self-explanation waits for a real response and may be declined |
| `recall` | Retrieval session under explicit resource conditions; can involve conceptual or procedural work |
| `transfer` | Record source task and variation dimension; start with one changed dimension; a coached comparison is assistance, not uncued assessment |
| `review` | Select due targets, delegate delivery, and never apply its own scheduling update |

## 5 Evidence and derived state contract

### Item and target records

Registry entries have stable IDs, display names, aliases, topics, and prerequisite references that resolve or are explicitly external. Targets may be concepts or rubric-criterion skills. Progress, hypotheses, and schedules are keyed by assessed target; merely tagged concepts receive no score. Exact known aliases may resolve automatically; ambiguous semantic matches remain separate. No dynamic merges in Phase 1.

Items declare before response: stable item/family/presentation IDs, prompt, rubric/version, assessed targets, criterion mappings, planned eligibility, allowed resources/tools, and these independent dimensions:

| Dimension | Values |
|---|---|
| Task type | conceptual, procedural, argument, implementation |
| Resource condition | closed_book, open_resource |
| Resource adherence | confirmed, unknown, violated |
| Variation | familiar, parameter, context, representation, assumption |
| Purpose | instruction, practice, diagnostic, assessment, review |

Purpose cannot override realized eligibility. Closed book excludes notes, worked examples, external explanations, and answer-generating help, but permits fixed source material and explicitly allowed tools. Compiler-permitted tasks and execution-prohibited prediction tasks remain distinguishable. Adherence is reported or observed, not a claim of universal monitoring. Different IDs must represent genuinely different tasks; families identify related variants.

Retain ordered verbatim responses and timestamps, criterion scores/evidence/uncertainty, domain-derived `meets_standard`/`below_standard`/`ungraded`, assistance and exposure order, optional pre-feedback confidence, and inclusion/exclusion reasons per response-target pair. Preserve first and final performance separately. Item lifecycle is active/interrupted/closed, with completed/shown/skipped/abandoned closure. Unanswered presentation is not failure; interrupted work stays resumable until closed or superseded.

The model proposes criterion scores; the engine applies the reviewed frozen mapping. Preserve partial credit. Calculations may require method, units, and tolerance. The initial illustrative history rubric scores claims, evidence, causal reasoning, and counterarguments from 0–3, with at least 2 on every required criterion and no fabricated evidence for item success. Domain reviewers must approve actual thresholds and alternative defensible answers; never fit thresholds to a learner's response. A target can succeed even if another criterion or the overall item fails.

### Independence and recent instruction

Derive `I` (independent) and `N` (immediate near transfer) per response-target pair before applying outcome rules. `I` requires the first substantive response to a fresh eligible reviewed item, no preceding item-specific help/feedback affecting that target, no prior answer exposure for it, confirmed resource adherence, and a definitive grade. Uncertainty about assistance/exposure/adherence/grading excludes the affected pair. Item-level independence requires all targets in the item standard.

Help affects every assessed target unless a reviewed content-to-target mapping or audited correction establishes narrower scope. Model self-labels cannot narrow scope. Complete solutions/shared resource violations affect all targets. Diagnostic probes, faded examples, and repeated items remain instructional evidence.

Recent instruction is a worked/faded example or level 3+ help affecting the target, across any family. Apply the same conservative target-scope rule. Set `N` if instruction occurred in the current session or previous 24 hours; restarting the interface cannot clear instructional episodes or timestamps. Durable qualification requires a later session without new relevant instruction and at least 24 hours since the latest such instruction. Level 1–2 cues on another item do not trigger `N`.

For a multi-target essay, reviewed instruction affecting evidence use may leave causal reasoning eligible if the mapping establishes that scope. Item-level confidence still becomes ineligible if any required target is near transfer.

| Metric | Eligible evidence and treatment |
|---|---|
| Displayed target performance / recap independent count | Definitive `I` and not `N`; exclude near-transfer successes and failures |
| Separate near-transfer report | Definitive `I` and `N`, both outcomes |
| Default topic calibration | Pre-feedback item confidence and definitive item grade; every required target is `I` and not `N`; one item, one observation |
| Optional target calibration | Explicit target-specific confidence and that pair `I` and not `N`; never reuse item confidence |
| Mastery successes / hypothesis resolution / box promotion | Successful `I` and not `N`, plus respective timing requirements |
| Mastery and box resets | Any unsuccessful `I`, including `N`, for the affected target only |
| Two-failure weak-status history | All `I`, including both `N` outcomes; near-transfer success can end that sequence without establishing mastery |

Filter eligibility before selecting recent windows. Ungraded evidence never enters success fractions. Near-transfer success cannot positively qualify mastery/resolution/promotion; near-transfer failure can reset mastery and boxes. Explained downgrade reasons must not silently alter the displayed fraction.

### Phase 2 hypotheses and progress

| Hypothesis disposition | Rule |
|---|---|
| Proposed | A response suggests a possible cause; usable for selecting probes in Phase 1 |
| Active | Rubric-backed support on at least two distinct items, not retries/assertion counts |
| Resolved | Two successful independent distinct targeted checks after latest support, neither near transfer; at least one in a later session at least 24 hours after latest support or corrective teaching, whichever is later |
| Retracted | Correction establishes invalid diagnosis or supporting assessment |

Resolution must test the disputed distinction for every named target. New evidence after resolution opens a new proposed episode and retains history. Only active hypotheses block mastery, only for their targets.

For progress, the reset point is the latest unsuccessful independent check. Qualifying successes must follow it, fall within 90 days, and satisfy exposure/timing rules. Evaluate in this order:

1. `unseen`: no substantive response for the target.
2. `weak`: an active hypothesis names it, or its two most recent independent checks within 90 days failed.
3. `mastered`: two qualifying successes on distinct fresh items at least 24 hours apart and on different learner-local dates, with at least one closed-book check and no active hypothesis.
4. `developing`: all other cases with responses.

An independent failure invalidates earlier mastery successes, including near-transfer failure. One failure yields developing unless the weak rule applies; recovery needs two new qualifying successes. Assisted success neither resets nor restores qualification. Aged-out evidence can yield developing with `evidence_stale` without asserting forgetting. Recompute time-dependent views at session opening, store derivation time and response-local timezone, and report evidence count/date, hypotheses, and assistance. Mastery is bounded to the registered target and sampled tasks, not broad transfer.

### Phase 2 confidence and calibration

Ask: “How likely is it that this answer meets the stated success standard without further help?” Show the standard first. Offer 0/25/50/75/100 percent or a probability from 0–1; do not reinterpret an unlabeled 1–5 scale. Ratings are optional and pre-feedback.

Request at most three default ratings per session, only on first responses predicted to qualify. A rating later excluded still consumes the burden budget; predicted near-transfer items do not prompt one. For target performance show up to the latest 20 eligible pairs within 90 days, separately for ordinary and near-transfer evidence. State caps/windows; the recap uses that session's window. These fractions are not probabilities of mastery.

Default calibration pools one observation per eligible item within one declared topic, using up to the latest 20 within 90 days. Let `p` be confidence and `y` item success; compute `mean(p - y)`. Do not pool incompatible policies/topics or split an item rating into criteria.

- Fewer than ten pairs: `insufficient_evidence`.
- Gap above 0.20: `confidence_above_observed_accuracy`.
- Gap below -0.20: `confidence_below_observed_accuracy`.
- Otherwise: `no_large_gap_detected`.

Report paired count, coverage among otherwise eligible items, exclusions/reasons, policy, and difficulty mix. Default coverage cannot reach ten in fewer than four sessions. Optional target calibration needs ten explicitly target-scoped eligible ratings. Difficulty and selective omissions limit interpretation; flags guide offers, not forced activity or global learner labels.

### Phase 2 scheduling

The engine updates each explicitly assessed target once from closure/evidence; review delegation never duplicates updates. Boxes 1–5 have provisional intervals 1, 3, 7, 14, and 30 local days. The anchor is the original local date of the scheduling response, not later closure/correction. Record whether the target was due at presentation.

Apply exclusions before initialization/promotion. Shown-only, post-solution reconstructed/copied, skipped, and ungraded interactions cannot initialize or advance/postpone schedules. Eligible evidence before exposure survives. An independent failure takes precedence over initialization/promotion/assisted success. Every qualifying failure reset, including an assisted failure, sets box 1 due next local day after failure; multiple failures use the latest failure date.

1. First closed item with eligible definitive evidence initializes box 1 due the next local day after that response, unless failure reset applies; do not also promote.
2. Due independent first-response success outside near transfer advances one box, capped at 5, scheduling its interval from the response date. Near-transfer success leaves the due date unchanged.
3. Due independent failure resets box 1; assisted retries cannot undo it.
4. A due review starting with assistance drops one box, floored at 1, if completed successfully without full-solution exposure; a definitive failed response resets box 1. Use the resulting interval, so box 5 assisted success becomes box 4 and 14 days. At most one assisted demotion per target/local day; independent failure can still reset.
5. Shown/skipped/ungraded or abandoned-without-grade interactions leave schedules unchanged. Earlier qualifying failure still applies; requesting an easier task is not failure.
6. Independent failure outside review also resets box 1, including near transfer. Early success never promotes or pushes an existing due date later.

At most one promotion per target/local day. Later independent failure overrides it; later success cannot restore it that day. Replayed events have no effect. Scheduling uses first-response evidence and closure rules, not every retry. Boxes and mastery describe different things.

Offer due work at session start once, never mid-problem: prioritize active misconceptions/weak evidence, then calibration concerns, then oldest date. Decline suppresses the session offer; “next session” or a selected future date persists an offer preference separate from evidence/due dates. Explicit review remains available. Near-transfer success or skipping may leave a target due without forcing repeated offers. External reminders need opt-in and host support.

## 6 Evaluation contract

### Conditions and claim boundaries

| Arm | Configuration | Interpretation |
|---|---|---|
| A | Strong single prompt, shared teaching principles, session-local context | Practical baseline |
| B | Modular skills/controller, session-local evidence | B/A measures the combined package, not modularity alone |
| C | Same modular package with persistent evidence/adaptation | C/B adds persistence and its adaptation, using the same skill/controller/policy versions |
| D | Strong prompt plus model-maintained learner notes via simple text read/write | C/D compares practical structured versus inexpensive persistence packages |

A/B start each new session without prior profiles/transcripts. C gets persisted evidence; D chooses and updates notes without an evidence reducer. Give C/D equal declared memory-context budgets and record storage/update costs. All conditions share a transport logger that adds no hidden rules/state to baselines. Keep model, tools, materials, concepts, and learning time comparable. Judge learner-visible evidence, withholding B/C internals; event format itself earns no credit. Record latency, tokens, cost, assistance, and time on task.

A separate ablation is required to isolate modularity or the deterministic engine. Scripted/simulated results show interaction behavior, not human learning. Deterministic tests establish transitions, not semantic grading truth. Usability needs observed users; learning claims need comparative human evidence.

### Fixed diagnosis checkpoint

Freeze a shared visible prefix: item, resources, standard, any common prior interaction, and an identical scripted initial failed response. Domain reviewers classify diagnosability from this evidence before runs; hidden persona causes do not suffice. B's checkpoint state contains only captured prefix events. Immediately after the failure, launch isolated diagnostic and main continuations. Main prompts do not mention the checkpoint.

Diagnostic prompt:

> Explain the error or difficulty in the initial response, citing the learner evidence and your uncertainty. Distinguish an observed error from a persistent misconception. If the cause is unclear, say so.

No subsequent main-run probe/hint/learner reaction enters diagnosis. The diagnostic branch cannot affect main transcript, state, or learner; its cost is evaluation cost. Never supply reference causes. Missing/ambiguous/abstaining explanations on diagnosable prefixes are misses, with coverage and abstention reported. An accurate error explanation need not assert persistent misconception. Ambiguous prefixes have a separate unsupported-confident-diagnosis gate. Supplemental runs without an initial failure are inapplicable; later self-correction does not erase the initial error.

All other decision metrics use the untouched main run. Evaluate useful probing and revised explanations there descriptively, without inferring explicit diagnosis from a hint or regenerating outcomes. Diagnosis accuracy means elicited inference from identical evidence, not spontaneous diagnosis or proof that diagnosis caused better help. Report the descriptive diagnosis-correctness/help-appropriateness table by branch category, with counts/missingness; any pooled table shows its mixture and creates no extra gate.

### Help scoring and scripted mixture

Primary help cases have prefixes judged diagnosable. Both arms use paired learner scripts with common starting evidence, response rules, and predetermined continuation/exit conditions. Freeze a designed mix of 60% continuation, 20% self-correction, 20% exit/refusal; it does not represent deployment prevalence. Report strata separately, test plausible alternative mixes in development, and rerun protocol/simulation before any pre-inspection mix change. Adaptive results stay supplemental.

| Outcome | Score | Earliest applicable decision |
|---|---|---|
| Targeted assistance | 1 | First adjudicated assistance addresses the reference cause while needed and wanted |
| Justified no help | 1 | Independent success, including after neutral probing, or explicit skip/end/refusal before any earlier help failure; tutor respects it |
| Untargeted/unnecessary assistance | 0 | First assistance misses the cause, offers no relevant support, or follows success/refusal |
| Needed help withheld | 0 | Learner remains below standard and wants to continue when tutor ends/stalls/reaches the predeclared limit without targeted help |

Freeze acceptable actions, limits, and no-help branches. Judge withholding at termination/limit, not eventual closure. Later success/withdrawal cannot erase a failure, and later targeted help cannot repair an untargeted first hint. Keep every valid applicable run, including no-help cases. Ambiguous prefixes are outside this primary denominator. Unresolved scoring ambiguity requires adjudication, not silent removal.

Report all outcome counts, splitting self-correction from exit/refusal; continuation/completion, exclusions, scheduled-pool coverage, and assistance coverage. Conditional targeting among assisted runs is descriptive and unavailable when no assistance occurs, not 100%.

Every primary continuation script must include both enough below-standard retries to test escalation and a bounded-hint/next-step request on a hidden-answer task. The rubric specifies unwanted disclosure; requesting a hint is not full-solution authorization. Leakage is a crossed attribute, not another branch category. Predeclare leakage/escalation applicability before tutor behavior. Early termination or improper disclosure cannot remove a case from its denominator; grade each behavior under its rubric. Authorized full-solution requests are separate coverage cases and not leakage violations.

### Sampling and records

Use `(family_id, prefix_id, branch_id, repeat_id)` for a paired run. Prefixes nest in families; branch instances nest in prefixes, with categories recurring. Freeze counts/allocations. Each scored run launches a fresh diagnosis and main continuation for each arm; hide branch identity from diagnosis. Do not copy a diagnosis generation into multiple observations. Prefix repeats remain correlated.

Maintain family-disjoint development/validation/final pools. Initial development coverage is ten primary-domain and five contrasting-domain families. Once validation informs tuning, treat it as development. Final tests stay independently maintained and hidden until freeze; revisions informed by them need fresh final families. Reject trivial renaming across splits. Within a unit, teaching examples/variants may share a family but must be reported as near transfer; broader transfer needs distinct tasks/contexts.

Evaluation records retain paired arm scores named `diagnosis_accuracy`, `help_appropriateness`, `escalation_compliance`, and `no_answer_leakage`; applicability, validity/adjudication, and exclusion reason per score; family/prefix/branch/repeat; domain/persona; reference diagnosability; assistance occurrence; help category/subtype; continuation/completion. A missing explanation on an applicable diagnosable case is zero; invalid/inapplicable is not zero. Reject incomplete inputs.

Resample whole families with every paired arm, prefix, branch, repeat, outcome, and applicability flag intact. Compute each rate on its own applicable records in the joint resample. Report unique prefixes/families and run counts. Families may contain different diagnosable/ambiguous prefixes, but a prefix cannot belong to both. Supplemental coverage must not alter the primary mix.

### Sample floors and joint simulation

Every advance-gate and absolute release-gate rate needs at least 100 applicable scored runs per evaluated condition, across at least 30 distinct families including at least ten in the contrasting domain. Diagnosable and ambiguous diagnosis gates each need their own 100 runs and family coverage; families may overlap through different prefixes. These counts include repeats, not 100 unique prefixes. Descriptive breakdowns do not inherit gate floors. Report unique evidence coverage and do not treat reruns as independent learners.

At 60% continuation, 167 primary runs would supply 100 opportunities arithmetically; preserving exact integer 60/20/20 allocation requires at least 170: 102 continuation, 34 self-correction, 34 exit/refusal. Add 100 ambiguous-prefix runs: **270 per condition, including repeats**. Validity, each metric's family coverage, and decision power can increase this allocation. Use predefined replacements/larger balanced allocations to preserve the mix.

Run development scenarios at least three times, then simulate the complete decision with joint paired outcomes. Explicit inputs include all four applicability/validity models, branch mixture, family/prefix/branch/repeat allocation, within-family dependence, A/B concordance/discordance, and cross-metric dependence. Do not generate arms/metrics independently from marginal rates.

Simulate feasible true 10-percentage-point gains on one metric with no change on others, respecting ceilings. Vary uncertain dependence assumptions. Apply the actual exclusions, floors, interval method, multiplicity adjustment, and advance rule. Choose family counts achieving at least 80% advance probability across the prespecified plausible alternatives; report simulation uncertainty and false advancement under null and guardrail-violation cases. Identify the binding metric/population/coverage constraint. Apply rare-event absolute gates to actual held-out outcomes, not synthesized metric vectors.

Freeze simulation code, inputs, seeds, assumed joint distributions, counts, intervals, and gates. If unaffordable, predeclare one primary rate with an unadjusted interval and other metrics as guardrails with a wider non-degradation margin, such as ten points. Rerun simulation before held-out inspection. If still unaffordable or inconclusive, simplify or justify a new experiment; do not claim advantage.

### Advance and release gates

For A/B, advance only when B improves at least one of the four rates by at least five percentage points, that improvement interval excludes zero, and other intervals exclude degradation worse than five points. Use family-clustered intervals adjusted across four comparisons for simultaneous 95% coverage; freeze the procedure. Take the larger of gate floors and simulated counts.

Absolute candidate gates:

- All deterministic fixtures applicable to the milestone pass.
- Zero observed severe factual errors, fabricated responses, or false independent-success records in the candidate release suite. Report baseline defects without automatically blocking candidate release; shared harness defects can invalidate comparisons.
- At least 90% applicable interaction-rule compliance, with counts and uncertainty.
- At least 80% supported diagnosis accuracy on diagnosable prefixes, counting missing/abstaining/unobservable explanations as misses; at most 10% unsupported confident diagnoses on ambiguous prefixes, with separate coverage.

A severe error teaches an incorrect central concept/method, materially misgrades an answer, or fabricates supporting evidence; humans adjudicate severity against reviewed rubrics. Zero observed errors is a blocking rule, not a deployment error guarantee. Do not apply independent-Bernoulli bounds to correlated rerun counts. Freeze scenario lists/rubrics before evaluation, repair on development regressions, and use fresh confirmation after candidate changes following inspection.

### Persona and judge checks

Cover novice, partial knowledge/misconception, strong learner, answer-seeker, frustrated, and confidently incorrect cases. Cards specify observable starting knowledge, planted errors, allowed changes after instruction, help requests, and confidence. Tutor never sees hidden cards/references. Screen starting states with held-back probes; an independent checker classifies constraints as met/violated/unjudgeable, using code for fixed checks.

Predeclare invalidation, including forbidden methods before teaching, hidden-reference copying, or missing required planted errors. Audit stratified passes/failures and all disputed exclusions, blinded where feasible. More than 10% invalid/unjudgeable in a persona-condition cell makes it unusable until repaired. Use predefined replacements and all-run sensitivity reports; do not discard inconvenient tutor outcomes as persona failures.

Judge against reviewed references with condition identifiers hidden where feasible. Prefer another model family; if shared, disclose and increase human checks. Humans review all severe flags plus stratified passes/failures in every condition; report agreement and adjudicate disputes. Judge agreement alone is not independent corroboration.

For reproducibility record skill/policy/item/rubric versions, model identifiers/settings, tools, dates, costs, and affected regression results. Protect final tests throughout tuning.

## 7 Acceptance fixture inventory

Implement the fixtures below in their milestone. This inventory is mandatory coverage, not a claim that tests already exist. Runtime fixtures belong to M1 for capture/interaction, M3 for durability/correction, and M4 for derived state/scheduling/selective deletion. Protocol fixtures belong to M2. Attach executable test IDs to the tables as implementation proceeds.

### Runtime fixtures

| Scenario | Required result |
|---|---|
| Direct skill invocation without runtime, profile, or prior workflow | Each available skill provides its core behavior from minimal supplied context or asks only for necessary missing input; run this check in the standalone host as well as the runtime |
| Learner invokes `coach` with a homework problem and optional attempt | Begin useful coaching without requiring `learn`, `practice`, or `diagnose`; preserve any supplied attempt and honor learner controls |
| Companion skill is unavailable or a handoff is declined | Current skill continues useful assistance within its capabilities without a forced route or lost conversation context |
| Guiding question precedes first answer | Answer is assisted; level 0 is impossible |
| Model proposes a learner response or changes its wording | Reject the proposal; preserve the controller-captured message |
| Free-form tutor turn calls itself generic | Default to assisted; the self-label cannot clear eligibility |
| Output delivery is uncertain after a crash | Possible exposure is retained; independence is not assumed |
| Incorrect first answer followed by a successful coached retry | Original failure and assistance survive |
| Full solution requested before any response | Exposure is recorded; no failed answer is invented |
| Accepted invocation and action ordinal are delivered again | Return the original engine-issued IDs; no duplicate effects |
| Same invocation and ordinal arrive with altered payload | Commit rejected |
| Restart while awaiting a response | Pending item resumes without a fabricated answer |
| Stale snapshot or interrupted write | Recover committed evidence and rebuild safely |
| Snapshot rebuild under identical policy and time | Status, calibration, and schedule match replay |
| Target mastered, then fails an independent review | Earlier successes cannot retain mastery |
| Two successes on one day or on the same item | Mastery is not established |
| Evidence expires from the 90-day window | Staleness is reported without inventing a failure |
| Two targeted checks contradict a hypothesis immediately after coaching | Hypothesis stays unresolved until the delayed, unexposed criteria pass |
| Two qualifying targeted checks satisfy the later-session rule | Hypothesis resolves; supporting history remains |
| Several retries exhibit the same error on one item | They do not create two-item misconception support |
| New proposed diagnosis selects the next item | Practice can use it without claiming an active misconception |
| Level 3 failure followed by level 4 failure | Fallback is offered before another automatic target-item hint |
| Two failed retries after level 1 or 2 cues | Next step is level 3 or the fallback, not another low-level cue |
| Fresh family variant follows a worked example | Tag immediate near transfer; exclude from mastery and resolution |
| Different-family item on the same target follows level 3 help | Tag immediate near transfer; exclude from mastery and resolution |
| Essay assesses two targets after reviewed instruction affecting only one | Set near-transfer status only on that response-target pair; preserve the other target's qualification if its conditions pass |
| Target scope of prior help is unknown | Do not clear targets based on the tutor's self-label; conservatively exclude affected or potentially affected pairs |
| Unmapped level 3 help on a two-target item, then a fresh item on either target | Both targets are recently instructed; tag immediate near transfer for each |
| Next item has a near-transfer target | No default confidence rating is requested; the session budget is unchanged |
| Immediate near transfer response is below the standard | Counts as an independent failure; resets mastery qualification and box |
| Two ordinary independent failures and eight independent near-transfer successes | Recap and progress show `0/2` plus separate `8/8`, never a combined `8/10`; use identical eligibility for the same window |
| History response meets the standard with imperfect criterion scores | Record target-specific success without demanding a perfect essay |
| Compiler-permitted check versus execution-prohibited prediction | Preserve resource policies and assess adherence separately |
| Missing confidence or uncertain grade | Exclude from paired calibration; report coverage |
| Multi-criterion item has one confidence rating | Count one topic-calibration pair, not one per criterion |
| Item-level confidence covers both a qualifying target and a near-transfer target | Exclude the item rating from default calibration without discarding the qualifying target's performance evidence |
| Item-level probability is offered as target-level confidence | Reject that reuse; target calibration requires an explicitly target-scoped rating |
| Review delegates delivery to another skill | Engine applies one scheduling decision |
| Same-day successful reviews followed by failure | At most one promotion; failure resets the box |
| Assisted success on a due box 5 review | Drop to box 4 with a 14-day interval |
| Assessment or assistance-classification correction, or explicit data deletion | Rebuild all affected derived decisions |
| First interaction is solution exposure followed by a reconstructed graded response | Do not initialize a schedule |
| Independent failure precedes solution exposure or a successful retry | Reset to box 1 due the next local day after the failed response |
| Item closure or correction occurs on a later date | Preserve the original response-date scheduling anchor |
| Learner suppresses offers until a selected date | Preserve the due date; suppress unsolicited offers until that date |
| Learner disputes assistance classification | Acknowledge the challenge, retain conservative eligibility pending review, and append any accepted correction |
| Learner requests a bounded hint during retries | Counters continue across requested help; after two level 1/2 failures require level 3 or fallback, and after two level 3/4 failures offer fallback before another target-item hint |

### Evaluation fixtures

| Evaluation scenario | Required result |
|---|---|
| Main run elicits reasoning through a reviewed neutral probe | Checkpoint evidence remains the frozen prefix; evaluate useful probing separately on the main run |
| A question cues a concept but supplies no equation or method | Level 1 or 2 assistance for evidence and main-run help scoring; checkpoint remains fixed |
| Free-form probe could determine help or escalation scoring | Automatically queue human adjudication in either arm; retain conservative runtime eligibility and keep the affected metric inconclusive until resolved, preventing advancement if that metric is required |
| Learner self-corrects after a cleared neutral probe | Justified no help scores 1 in the full help-appropriateness denominator |
| Learner explicitly skips before a failed help decision | Respecting the skip scores 1; no assistance is required |
| Learner wants to continue, but tutor withholds help at the declared limit | Score 0 at that boundary; later success or withdrawal cannot repair it |
| Supplemental adaptive run has no initial failure | Diagnosis is inapplicable; report coverage without inventing a miss |
| An observed error is explained accurately without claiming a persistent misconception | Award diagnosis credit under the reviewed prefix rubric |
| Baseline has a severe error and candidate does not | Report the baseline defect; it does not by itself block candidate release |
| Every eligible run has justified no help | Help-appropriateness coverage remains complete; assistance coverage is zero and conditional targeting is unavailable |
| Simulation input omits a named metric or its applicability model | Reject the incomplete input; never synthesize scores or opportunities |
| Continuation script has no reviewed unwanted-disclosure opportunity | Reject it from the primary design before running; repair the script or revise and resize the protocol |
| Tutor terminates early or reveals the solution on a continuation script | Preserve predeclared escalation and leakage applicability; score each behavior under its rubric |
| Initial allocation uses the exact 60/20/20 mix | Schedule at least 170 primary runs plus 100 ambiguous-prefix runs per condition, then apply coverage, validity, and power requirements |
| One diagnosis generation is copied across several branches | Reject duplicate scoring; each scored run needs its own generation and retains its family and prefix cluster |
| Ambiguous cases are counted toward the diagnosable gate floor | Reject the denominator; enforce separate applicable populations |
| Whole families are resampled | Preserve paired A/B repeats, all four named scores, applicability and validity flags, exclusions, assistance occurrence, and help outcome categories together |
| Diagnostic branch is created | Use the same frozen visible prefix in both arms and only prefix events in B state |
| Diagnostic branch produces output | Main transcript, controller state, and simulated learner remain unchanged; branch costs stay separate |
| Diagnosable prefix receives missing or abstaining explanation | Retain the applicable run with diagnosis score zero and report coverage |
| Requested full solution arrives before an answer | Honor the active policy; authorized disclosure is not unwanted leakage |

## 8 Completion and handoff

The first implementation action is M0: assign owners, choose the stack, and create the costed protocol. Then implement the bounded M1 loop. Do not start later milestones merely because their contracts are specified here.

Mark a work package complete only when its artifacts and acceptance evidence are recorded. Maintain a decision log for gates, resource changes, policy versions, and unresolved blockers. This plan consolidates the current design; the superseded proposal and its revision history are not required to implement it.
