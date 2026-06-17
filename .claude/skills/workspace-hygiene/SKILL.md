---
name: workspace-hygiene
description: On-demand workspace audit — review change scope, clean temp artifacts, verify commit focus.
---

# workspace-hygiene

Use this skill for an on-demand audit of workspace state before committing or opening a pull request.

> **Note:** Formatting, linting, and build checks are handled by the always-on `pre-commit-checks` and `post-edit-diagnostics` rules. This skill covers the manual review steps that those rules cannot automate.

## Triggers

- Before creating a pull request
- After large refactoring or multi-file operations
- When workspace state feels inconsistent or has unintended changes

## Required behavior

1. Run `git diff --stat` and confirm only the expected files were modified — flag any unintended changes.
2. Ensure commits are focused and atomic — one logical change per commit. Suggest splitting if a commit mixes unrelated concerns.
3. Remove temporary artifacts: `console.log`, `debugger` statements, TODO comments added during development, and leftover scratch files.
4. Verify no secrets, `.env` fragments, or credentials appear in staged changes.
5. If the branch has many commits, suggest squashing or reordering for a clean PR history.

## Examples

- After a refactor touching 10 files, run `git diff --stat` to confirm only expected files changed.
- Before opening a PR, scan staged changes for leftover debug logging.
- Suggest splitting a commit that mixes a bug fix with an unrelated style change.

## When NOT to use

- Exploratory prototyping where polish is premature
- Work-in-progress branches explicitly marked as drafts
