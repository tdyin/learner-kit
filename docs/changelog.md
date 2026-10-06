# Release history

## 1.2.0 — plugin candidate, 2026-10-06

`lk-coach` now absorbs `lk-diagnose` and `lk-practice`: it diagnoses an attempt automatically, guides the learner through the fix, and runs practice on request. The retry limit and its "different explanation, example, easier exercise, or break" menu are gone; the coach changes approach on its own when a step keeps failing. `lk-learn` absorbs `lk-explore` (topic maps), `lk-recall` absorbs `lk-review` (review mode, inferred from the request), and `lk-explain` absorbs `lk-transfer` (transfer tasks). All five merged skills (`lk-diagnose`, `lk-practice`, `lk-explore`, `lk-review`, `lk-transfer`) are removed, taking the package from nine skills to four: `lk-coach`, `lk-learn`, `lk-recall`, `lk-explain`. The check runner gains a Claude Code CLI host (`--host claude`); one passing host is enough for scoped skill-behaviour checks. Desktop acceptance remains independent and pending, and the installed-update path from 1.1.x is unchecked; see [compatibility](compatibility.md).

## 1.1.1 — plugin candidate, 2026-10-03

Tightened required recall progress at question-count setup; hiding required progress remains a known issue. Added scoped synthetic-history activation inspection and numeric-minus normalization in objective checks. Desktop acceptance remains independent and pending; see [compatibility](compatibility.md). Detailed check results stay local.

## 1.1.0 — plugin candidate, 2026-10-03

Proactive text visuals and session preferences across all nine skills; capability-checked sourced images; repeatable cheap checks and bounded math/history conversations; shared native plugin manifests and project catalogs. No generated illustration or HTML teaching interface.

Desktop installation, updates, activation enforcement, and user rendering acceptance remain pending independently per host. See [checks](checks.md), [compatibility](compatibility.md) and [install/update guidance](install.md). This candidate is not an official marketplace listing or a verified desktop release.

## Earlier source releases

Earlier releases used individual skill directories. Native plugin packaging begins with the 1.1.x candidates; desktop support requires its own installation/update/activation/display checks. Historical acceptance and smoke-check records stay local.
