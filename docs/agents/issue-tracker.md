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

## Pull requests as a triage surface

PRs as a request surface: no.
