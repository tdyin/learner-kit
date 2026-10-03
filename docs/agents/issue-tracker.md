# Issue tracker: GitHub

Issues and specs live in tdyin/learner-kit on GitHub.
Use the gh CLI from this repository.

- Publish: gh issue create --title "..." --body-file <file>
- Read: gh issue view <number> --comments
- List: gh issue list --state open
- Comment: gh issue comment <number> --body-file <file>
- Label: gh issue edit <number> --add-label "<label>"
- Close: gh issue close <number>

Use temporary UTF-8 files for multiline bodies.

## Pull request issue links

For every PR, link its implementation tickets in GitHub's **Development** section and verify the linked issue numbers. Description references alone do not satisfy this preference. Keep parent specifications as related references unless the PR completes them. Development links close issues when the PR merges into the default branch; record outstanding acceptance in the PR and keep it draft until ready.

## Pull requests as a triage surface

PRs as a request surface: no.
