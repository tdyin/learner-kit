# Installation, first use, and updates

Package candidate: **1.1.1**. Teaching instructions have one authoritative home in `skills/`; the OpenAI root manifest and Claude manifest differ only in host metadata. Neither desktop has passed fresh-install/update/permission/rendering acceptance for this candidate. See [compatibility](compatibility.md). Dated check records are kept locally.

## Codex Desktop native catalog

The project-owned catalog is separate from the official public directory. It requests no connectors, authentication, hooks, or installer framework.

For this unpublished working tree, use the local checkout as the catalog root:

```sh
codex plugin marketplace add C:/Dev/learner-kit
```

Use your actual clone path on other machines. Restart Codex Desktop, open its Plugins directory, choose **Learner Kit catalog**, and install **Learner Kit**. Start a new chat; use the skill picker to explicitly select `lk-coach`, then send `Hints only for -3 + 2. I find signed numbers hard to picture.` In a namespaced picker/command interface, look for `learner-kit:lk-coach`. Continue the same chat without reselecting. Decline any suggested handoff unless you want another skill.

After these files are published to GitHub, the Git-backed alternative is `codex plugin marketplace add tdyin/learner-kit --ref main`. Do not advertise that command as working against the remote until its catalog and manifests are published. Adding a marketplace alone does not verify installation or teaching behavior.

**Update:** for the local catalog, pull the desired published revision into the checkout and restart the desktop app, following its plugin refresh/update controls. For the Git catalog, refresh with `codex plugin marketplace upgrade learner-kit-catalog`, then restart and use the desktop update flow. Confirm the **installed cached** package version and changed skill content, not just this checkout. Local cache folders can be labeled `local`; read the installed `plugin.json` version. Verify all nine still appear and permission controls remain before accepting the update. If the installed cache remains stale, record the gap and use the host's supported remove/reinstall flow; do not manually overwrite it.

Sources checked 2026-10-03: [OpenAI packaging, marketplace, cache and refresh guidance](https://developers.openai.com/plugins/build/plugins). Availability differs across surfaces; record the actual Codex Desktop build. This documentation supports the path, not a claim that it ran here.

## Claude Desktop Chat native plugin

Use the **Chat** surface. Code and Cowork evidence does not substitute for Chat.

After the catalog is published, open **Customize → Plugins → Add → Add marketplace**, enter `https://github.com/tdyin/learner-kit`, and select Learner Kit from its catalog. The GitHub repository must expose `.claude-plugin/marketplace.json`. Before publication, a developer can zip the root plugin folder with `.claude-plugin/plugin.json` and the shared `skills/`, then use **Add → Upload plugin**. Exclude `.git`, `.local/checks`, `docs/results/`, `docs/smoke-checks.md`, and `docs/release-acceptance.md` from an upload; no local result record, cached photograph or transcript belongs in the package. To package only committed files from the repository root, use `git archive --format=zip --output=../learner-kit-plugin.zip HEAD`; commit the intended local changes before creating that archive. There is no custom installer.

In Chat, type `/`, filter for `learner-kit`, and select the intended skill explicitly; the namespaced form is `learner-kit:lk-coach`. Continue only that authorized activity. Installation consent and account sync do not authorize automatic tutoring. Claude's docs describe automatic matching in Chat and do not establish enforcement of our Claude Code metadata there. Do not treat this as verified permission-safe Chat support until the unselected/selected checks below pass. A demonstrated automatic activation is a failed requirement; withhold verified support and report the gap.

**Update:** use installed-plugin management in Customize → Plugins to check/update the package from its marketplace; for an uploaded test package, use the supported remove/upload replacement flow with a new version. Record the actual controls and installed version/content observed in your build. If no supported update is available, mark that requirement blocked or unverified rather than claiming a source edit updated the account package. Recheck discovery and permission behavior after replacement.

Sources checked 2026-10-03: [Claude plugin installation and selection](https://claude.com/docs/plugins/overview), [surface support](https://claude.com/docs/plugins/platform-support), [package layout/testing](https://claude.com/docs/plugins/build). This catalog is project-owned, not an official listing.

## Desktop acceptance checklist, per host

Record app/surface/build, date, source revision, installed package version and content identity, model, each observation, and pass/fail/blocked/unverified. Keep Codex and Claude outcomes independent.

1. Fresh native installation. All nine skills discoverable and selectable. Check installed instructions/metadata match the release, not a stale direct install; resolve duplicate skills.
2. New **unselected** relevant chat: `Explain why -3 + 2 is negative.` Confirm no skill activation using available loading/history evidence. Model prose alone may be insufficient; mark unverified if activation is not observable.
3. Select `lk-coach`, ask for a bounded hint; continue with the synthetic incorrect/ retry prompts in [checks](checks.md). No repeated permission for continuation. A suggested companion skill remains inactive until authorized.
4. Update from an actually installed earlier version through the native documented flow. Record before/after version **and content**, discovery of all nine, and retained activation policy/behavior. CLI 1.1.0 → 1.1.1 was observed; neither Desktop has verified before/after installed-plugin evidence yet.
5. Reuse only affected math/history branches; the user personally checks text diagram and photo display in the app. Record desktop rendering separately from CLI/model/image inspection. Stop after relevant checks pass.

## Existing directory installations and troubleshooting

Existing individual skill installation remains supported. Codex's skill installer can install `https://github.com/tdyin/learner-kit/tree/main/skills/lk-coach`; start a new chat afterwards. Claude Code uses personal `~/.claude/skills`; Pi supports `pi install git:github.com/tdyin/learner-kit`; Hermes can load `~/.hermes/skills`. These mechanisms have the limited evidence in [compatibility](compatibility.md), and are not desktop Chat acceptance.

For missing skills, check the installed package is enabled, its source/cached version, and start a new chat after refresh. Duplicate direct and plugin installations make invocation ambiguous; remove the obsolete installation through the host's supported mechanism. For runner authentication failures, use a terminal where `codex login status` works; do not copy credentials or assume the chat's authentication config is available to child processes. For image retrieval/inspection/display gaps, state the missing capability and use text with provenance; a link never becomes a viewed image by assertion.
