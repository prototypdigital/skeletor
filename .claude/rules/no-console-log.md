---
description: Forbid console.log in production code; use a logger instead.
paths:
  - src/**
---

# No console.log in production code

Never use `console.log` (or `console.warn`, `console.error`, `console.debug`) directly in source files under `src/`.

Use the project logger instead so that log output is structured, level-controlled, and safe to ship.

## Examples

```ts
// BAD
console.log("Fetching page", slug);
console.error("Something went wrong", err);

// GOOD
logger.info("Fetching page", { slug });
logger.error("Something went wrong", { error: err });
```

## Exceptions

CLI entry points and files whose sole purpose is user-facing terminal output may use `console.log` directly. All other `src/` code must use a structured logger.

## Why

- `console.*` calls leak implementation details and unstructured output into production.
- A logger allows log-level filtering, structured metadata, and integration with observability tooling.
