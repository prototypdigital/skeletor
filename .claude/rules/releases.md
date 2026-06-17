---
description: Release and versioning conventions for @prototyp/skeletor
paths:
  - '**'
---

## Commits

This repo uses [release-please](https://github.com/googleapis/release-please) to drive versioning and publishing. Every commit landing on `master` MUST follow [Conventional Commits](https://www.conventionalcommits.org/).

### Effect on versioning

| Prefix | Bump | Example |
|---|---|---|
| `feat:` | minor | `feat: add foo helper` |
| `fix:` / `perf:` | patch | `fix: handle null input in bar` |
| `feat!:` or `BREAKING CHANGE:` footer | major | `feat!: drop Node 18 support` |
| `chore:` / `docs:` / `ci:` / `refactor:` / `test:` / `style:` / `build:` | none | `chore: bump deps` |

### Rules

- Use the imperative mood: "add X", not "added X" or "adds X"
- Keep the subject line under 72 chars
- Scopes are optional but helpful: `feat(auth): ...`, `fix(parser): ...`
- Squash-merge PRs — the squash commit is what release-please reads, so phrase the PR title as a conventional commit

### Releases

Do not manually create GitHub Releases or git tags. release-please opens a PR titled `chore(master): release X.Y.Z` whenever there are releasable commits; merging that PR cuts the tag, GitHub Release, and npm publish (OIDC + provenance) in one chained workflow run.
