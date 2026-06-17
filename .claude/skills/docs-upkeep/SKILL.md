---
name: docs-upkeep
description: Keep canonical documentation aligned with implementation and workflow changes in the same task.
---

# docs-upkeep

Use this skill when code or workflow changes affect documented behavior.

## Triggers

- Code change that alters documented behavior or public API
- New feature, endpoint, or configuration option that needs documentation
- Workflow, CI, or deployment process change

## Required behavior

1. The agent MUST update affected docs in the same task as the code change (not as a follow-up).
2. The agent MUST keep docs concise and link-based; avoid duplicating information already in code.
3. The agent MUST remove or update stale references (dead links, renamed files, removed features).
4. The agent SHOULD mention doc changes in commit messages or handoff summaries.
5. The agent SHOULD check that code examples in docs still compile and run.

## Examples

- When renaming an API endpoint, update the README, API docs, and any client-side references.
- When adding a new CLI flag, update the `--help` text and the Commands wiki page.
- When changing config schema, update the Configuration docs and example files.

## When NOT to use

- Internal refactors that don't change external behavior or API surface
- Changes to test files only
