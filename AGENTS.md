# @prototyp/skeletor

React-Native UI and functional toolkit — a small in-house library that provides components, hooks, and animation utilities for React Native apps at Prototyp.

## Commands

```bash
yarn build        # Build the library (CommonJS + ESM + TypeScript)
yarn sync:llm-config   # Sync llm/ rules -> all AI tool directories
```

## AI Config Architecture

Source of truth for all AI tool configuration lives in `llm/`:

- `llm/rules/` — scoped rules (frontmatter: `description`, `scope`)
- `llm/agents/` — specialist agent definitions
- `llm/skills/` — on-demand skill workflows

Run `npx bluetemberg sync` (or `yarn sync:llm-config`) to generate tool-specific files in `.cursor/rules/`, `.claude/rules/`, `.github/`. These generated files should not be edited directly.

## Boundaries

### Always

- Run `biome check --write` after editing source files
- Follow existing patterns and conventions
- Use `master` as the default branch (not `main`)

### Ask First

- Adding new dependencies
- Changes to the public component/hook API

### Never

- Edit generated files in `.claude/`, `.cursor/`, `.github/`
- Commit `.env` or secrets
- Manually create GitHub Releases or git tags (release-please handles this)
