# Small repeatable checks

Run from the repository root with Node.js 22 or later. There are no package installs or separate judge calls.

```sh
node scripts/validate.mjs
node --test scripts/checks.test.mjs
node scripts/run-checks.mjs math --preflight
node scripts/run-checks.mjs math --model YOUR_AVAILABLE_CODEX_MODEL
```

`history` selects two history conversations; `both` selects math and history. Repeat `--scenario ID` to run only affected branches (IDs are in `scripts/scenarios.mjs`). `--skill-prefix learner-kit:` selects namespaced plugin skills; omit it for direct user-skill installations. `--model` must name a model available to your signed-in account. `LK_CODEX_BIN` may point to an executable; no shell wrapper is used.

## Prerequisites and stopping

Cheap validation checks all four source folders, required files, the repository's small YAML subset, activation configuration, and local file links. It does not prove installed discovery, runtime permission behavior, external-schema compliance, or rendering. JavaScript syntax checks replace typechecking in this dependency-free JavaScript project: `node --check scripts/<file>.mjs`.

The sole adapter uses Codex CLI `exec --json` and exact thread-ID `exec resume`, supported by [non-interactive Codex](https://developers.openai.com/codex/noninteractive). It preflights version, `login status`, and app-server `skills/list` from a fresh temporary directory outside the repo. Install all nine source-revision skills first. Duplicate/missing skills, stale instructions, or stale activation metadata block execution. A missing home directory must be fixed in the calling shell's environment; the runner never changes account configuration or copies credentials. Authenticate with Codex's supported login flow. Network/model access is also required; a failed turn is reported rather than retried indefinitely.

Before execution the runner prints scenario count, maximum assistant turns, model, scope, and zero planned retries. Defaults: 180 seconds per assistant turn, 20 seconds per discovery request, 8 MB process output, at most the fixed scenario turns. No automatic retry or further subject/host expansion. It submits only fixed, clearly labeled synthetic inputs, sequentially, after a completed assistant turn. A missing reply, failed process, or objective divergence ends that branch without sending dependent learner answers. Relevant checks passing ends the run; broaden only for a recorded failure, unresolved shared change, or release requirement. No routine approval gate.

Math: seven fresh conversations, at most twenty-five assistant turns, including targeted recall branches. History: two fresh conversations, at most seven turns. Both: nine conversations, at most thirty-two turns. The hide-progress regression currently fails on the tested model; use --scenario to run independent branches after a divergent run stops. No separate model judge. All nine share instruction changes, but these branches focus model work on explanation/coaching and ordinary unselected chat rather than a full skill matrix. Recall's visual feedback changes require targeted recall regression checks before claiming release acceptance; its fixed-slot, bar, completion-summary, and early-stop rules remain authoritative.

## History fixture

Read [history provenance](../examples/history/README.md). `node scripts/fetch-history.mjs` downloads the fixed photograph into ignored local outputs, verifies its hash, and refuses changed content. Cache reuse is the default. Use `--refresh` only when checking changed retrieval behavior; this does not silently replace the pinned fixture. History preflight requires that cache and the written-source file. Attach the actual bytes using Codex's image input. Runtime/model image support is a prerequisite, not a caption or URL substitute. First-time retrieval failure is blocked; a hash mismatch is fail.

The image has educational usage conditions and is not redistributed under this project's GPL. The source image is cached locally; the fixture metadata and written-source excerpt are committed. The runner neither searches for new material each run nor collects real learner conversations.

## Evidence and review

Reports and raw JSONL events/synthetic transcripts live only in `.local/checks/`. Reports identify Git revision/dirty state, package version, date, OS, host/version/surface, model, scenario, status, observations, and limits. Exit codes: 0 observed pass, 1 fail, 2 blocked, 3 unverified. Automated objective passes still leave qualitative, activation, image-inspection, and desktop-rendering outcomes unverified until reviewed. Headless output never verifies a desktop display.

`node scripts/review-activation.mjs .local/checks/<run-directory>` inspects only exact synthetic thread IDs in Codex's own session files. It checks completed-turn coverage, skill injections/reads, and unexpected companion loads; absent/incomplete history stays unverified. It writes `activation.json` beside the synthetic transcript. This adds no model calls and does not inspect other learner conversations. Other history formats may need a scoped adapter change, not a claim based on prose alone.

Review the transcript and raw events with this short rubric. Record pass/fail/blocked/unverified and quote the supporting turn/event in a concise dated record under ignored `docs/results/`. Results and transcripts are for local reference and are excluded from commits and pushes. Unreviewed judgments stay unverified. There is no automatic text-match quality score.

| Check | Evidence needed |
|---|---|
| Useful proactive visual | The initial hard-to-picture prompt gets an accurate, helpful representation without an extra request. Labels, directions, and reused meaning are consistent; simple facts stay concise. |
| Teaching safeguards | One substantive question, genuine waiting, bounded cues without the answer, feedback tied to the actual incorrect reasoning, work after help distinct from unaided work, brief stop. In `math-coach-retries`, the coach offers all four fallback choices after the second unsuccessful answer following help, without another corrective hint or final answer. Responses and the recap use ordinary language without retry labels, counts, or explanations of the limit; the recap still distinguishes unaided work from work after help. |
| Preference and source care | Text-only preference persists; speed alone creates no learner label. Source errors are flagged, not silently adopted; claims/uncertainty remain distinct. |
| Activation | Discovery plus exact skill loading/injection evidence for selected and unselected chats. Absence of a shell read alone is insufficient: skills may be injected. Inspect host session/history evidence when available; without it mark unverified. Continuation needs no re-selection; another skill needs authorization. |
| History content and pixels | Inspect the actual attached image with an image-capable tool. Cite visible details separately from archive identities/date and interpretation. Document byte hash/tool/revision. A caption alone cannot pass. |
| Recall regression | Use the recall branches in `scripts/scenarios.mjs`, adding affected cases as needed: unchanged slot on hint/clarification/declined handoff, required bar and final grouped summary even with text-only preference, no summary/progress after early stop. |
| Desktop display | The user personally verifies the diagram/photo in each target app. Record app/surface/version and installed version separately from headless checks. |

Statuses: pass = observed satisfaction; fail = observed contradiction; blocked = a missing prerequisite prevented checking; unverified = absent or insufficient evidence. Keep these dimensions separate. Older smoke-check and release-acceptance records are ignored local references; preserve their original revisions/dates locally.
