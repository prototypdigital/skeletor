---
description: Prefer early returns and guard clauses over nested conditionals.
paths:
  - '**'
---

# Early returns

Use early returns and guard clauses to keep control flow flat and readable.

## Patterns

- Return early for invalid input, missing data, or edge cases at the top of functions.
- Avoid `else` blocks when the `if` branch returns or throws.
- Flatten nested `if`/`else` chains by inverting conditions.

## Examples

```ts
// BAD — deeply nested
function process(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doWork(user);
      }
    }
  }
  return null;
}

// GOOD — guard clauses
function process(user) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;

  return doWork(user);
}
```
