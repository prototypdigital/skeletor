---
name: code-review
description: Structured code review — intent-first, diff-focused, severity-tiered findings with actionable fix suggestions.
---

# code-review

Use this skill when reviewing a pull request or a set of code changes before merge.

## Triggers

- Pull request review (any size)
- Post-implementation self-review before opening a PR
- Peer review requested by a teammate

## Required behavior

1. The agent MUST establish intent before reading any code — run `git log --oneline origin/master..HEAD` and `git diff --stat origin/master..HEAD`, read the PR description if available, and state the intent in one sentence. A finding is only valid if it conflicts with the stated intent or introduces unacceptable risk.
2. The agent MUST review the diff, not the full files — run `git diff origin/master..HEAD` and focus on changed lines and their enclosing function or block. Full files should only be read when a change cannot be understood without broader context.
3. The agent MUST reason before critiquing — for each changed area, trace: (a) what the code does after the change, (b) what inputs it accepts and their valid ranges, (c) what can go wrong. Only raise a finding once a concrete consequence can be stated, not a theoretical one.
4. The agent MUST format every finding using Conventional Comments labels with a file and line reference (see Finding format below).
5. The agent MUST check these categories in priority order: correctness, security, error handling, API contracts, performance, test coverage.
6. The agent MUST write a summary after all findings: restate the PR intent, count findings by severity, give a merge verdict (Block / Request changes / Approve with suggestions / Approve), and cite one specific `praise`.
7. The agent SHOULD acknowledge one thing done well per review — cite file and line, not a generic compliment.
8. The agent MUST NOT comment on formatting, whitespace, or style without a project style-guide reference — these belong to automated tools.
9. The agent MUST NOT raise speculative findings — every finding needs a concrete consequence, not a theoretical one.
10. The agent MUST NOT flag issues already caught by CI (type errors, lint failures, failing tests reported in the pipeline).

## Finding format

Every finding must include a file and line reference (`src/foo.ts:42`).

```
<label>(<optional-scope>): <what in one sentence>

<why — one or two sentences on the consequence if not fixed>

<fix — corrected snippet or concrete alternative, if applicable>
```

| Label | Blocks merge? | Meaning |
|---|---|---|
| `issue` | Yes | Correctness bug, security vulnerability, or data loss risk — must fix before merge |
| `warning` | Recommended | Concrete regression or bad pattern likely to cause problems — strongly advised to fix |
| `suggestion` | No | Worth considering; optional improvement |
| `nitpick` | No | Purely stylistic, no behavioral impact; author can ignore |
| `praise` | — | Something done well — always cite a specific file and line |

Note: `issue`, `suggestion`, `nitpick`, and `praise` follow the Conventional Comments spec. `warning` is a project-level extension for major-but-non-blocking findings.

## Examples

- A PR adds an API endpoint without input validation → `issue(security): src/routes/upload.ts:34 — user-supplied filename passed to fs.writeFile with no sanitisation; path traversal can write to arbitrary paths`
- A PR switches from `Promise.all` to sequential awaits in a loop → `warning(performance): src/jobs/sync.ts:88 — sequential awaits over N items degrades from O(1) to O(N) wait time; use Promise.all to restore concurrent execution`
- A PR extracts a 60-line function into two focused helpers → `praise: src/sync/transform.ts:12-34 — splitting resolveProfiles into two helpers makes the branching logic easy to follow without scrolling`

## When NOT to use

- Automated formatting-only PRs (no behavior change)
- Generated code (migrations created by a tool, lock file updates)
- Work-in-progress draft PRs explicitly not ready for review
- Vendored or third-party code outside the PR author's control
