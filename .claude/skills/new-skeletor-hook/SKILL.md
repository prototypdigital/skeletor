---
name: new-skeletor-hook
description: Scaffold a skeletor use* animation hook — ref-stable via useRef(builder).current, built on RN Animated (never Reanimated), typed from Animation.ts. Use when adding a hook to the skeletor library.
profiles:
  - frontend
  - fullstack
---

# new-skeletor-hook

Use this skill when adding a `use*` hook to the `@prototyp/skeletor` library, so it matches the existing `useAnimateSequence` / `useLoopAnimation` / `useAnimationTimeline` shape.

## Triggers

- "add a skeletor hook" / "scaffold a `use*` animation hook"
- A new file is about to be created under `src/hooks/` in the skeletor repo

## Protocol

### Step 1 — Decide what the hook wraps

A skeletor hook is a thin, ref-stable wrapper over a pure builder in `src/utils/animations.ts`.

```text
Does a builder for this behavior already exist in utils/animations.ts (animateSequence, loopAnimation, createAnimationTimeline, …)?
  YES → the hook just wraps it in useRef(...).current
  NO  → add the pure builder to utils/animations.ts FIRST (it must return an ElementAnimation<Keys>), then write the hook
```

### Step 2 — Type from Animation.ts

Generic over `AnimatableStyleKeys`, take an `AnimationStyle<Styles>` (and optional `AnimationConfiguration`), return `ElementAnimation<Styles>`. Import these from `../models`. Never invent local animation types.

### Step 3 — Make the return ref-stable

Call the builder exactly once and pin it with `useRef(...).current` so re-renders don't rebuild the animation (which would restart it):

```ts
// BAD — builder runs every render; the Animated.Value set is recreated, animations jump/restart.
export const useFade = (styles, config) => animateSequence(styles, config);

// GOOD — ref-stable, typed, built on the existing util builder.
import { useRef } from "react";
import type { AnimatableStyleKeys, AnimationConfiguration, AnimationStyle, ElementAnimation } from "../models";
import { animateSequence } from "../utils";

export const useFade = <Styles extends AnimatableStyleKeys>(
  styles: AnimationStyle<Styles>,
  config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
  return useRef(animateSequence(styles, config)).current;
};
```

### Step 4 — Honor the Animated conventions

In the builder, default `native` to `true` (`useNativeDriver: !!native`), default `isInteraction` to `false`, and expose `forward` / `backward` / `start` / `reverse` / `reset` on the returned `ElementAnimation`. Never use Reanimated. Any unavoidable `any` gets a `// biome-ignore lint/suspicious/noExplicitAny: <reason>`.

### Step 5 — Register the barrel

Add `export * from "./useFade";` to `src/hooks/index.ts`. Use relative imports only. Do not author inside the `src/hooks/skeleform` submodule.

## Completion checklist

- [ ] Hook returns `useRef(builder(...)).current` — builder called once, reference stable
- [ ] Generic over `AnimatableStyleKeys`; returns `ElementAnimation<Styles>`; types imported from `../models`
- [ ] Built on RN `Animated` via a `utils/animations.ts` builder; no Reanimated
- [ ] `native` defaults true, `isInteraction` defaults false; `forward`/`backward`/`reset` exposed
- [ ] Exported from `src/hooks/index.ts`; relative imports only; any `any` has a biome-ignore + rationale
- [ ] `biome check --write src` passes

## When NOT to use

- Scaffolding a component — use `new-skeletor-primitive` instead
- Adding a non-animation hook with no `ElementAnimation` return — follow the structure/types rules but skip the animation-specific steps
- Working in a consumer app rather than the skeletor library
