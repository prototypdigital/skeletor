---
description: >-
  Skeletor animations use React Native's built-in Animated API (never
  Reanimated), default native true, return useRef(create...).current for ref
  stability, and expose forward/backward/reset.
paths:
  - 'src/{hooks,utils,models}/**/*.ts'
---

# Skeletor animation conventions

Skeletor builds its animation layer on React Native's built-in `Animated` API. Pulling in Reanimated, or returning a fresh animation object each render, breaks the library's zero-extra-dependency promise and causes animations to restart on every re-render.

## Rules

- Use RN's built-in `Animated` (`Animated.timing`, `Animated.Value`, `Animated.CompositeAnimation`). Never import or suggest `react-native-reanimated`.
- Default `native` to `true` in `AnimationConfiguration` and pass it as `useNativeDriver: !!native`. Only fall back to `false` for properties the native driver cannot animate.
- An animation hook must return `useRef(create…(…)).current` so the composed animation survives re-renders with a stable reference — never call the builder directly in the body.
- The object an animation builder returns must satisfy `ElementAnimation<Keys>`: the interpolated `animations`, a `forward` and `backward` `CompositeAnimation`, and `start` / `reverse` / `reset` triggers.
- Any unavoidable `any` (e.g. the timeline's heterogeneous animation array) must carry a `// biome-ignore lint/suspicious/noExplicitAny: <reason>` comment with a concrete rationale — never a bare `any`.

## Examples

```ts
// BAD — Reanimated, builder called inline (new object every render → restarts),
// native driver forced off, bare any.
import { withTiming } from "react-native-reanimated";

export const useFade = (style: any) => animateSequence(style, { native: false });
```

```ts
// GOOD — built-in Animated, ref-stable, native defaults on, typed.
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

```ts
// GOOD — required biome-ignore with a real rationale for an unavoidable any.
export type AnimationTimelineConfiguration = {
  // biome-ignore lint/suspicious/noExplicitAny: a timeline triggers precomposed animations of mixed key types; a precise union adds no safety here.
  [ms: number]: Array<ElementAnimation<any>>;
};
```

## Gotchas

- `isInteraction` defaults to `false` in skeletor (not RN's default `true`) to avoid stalling `VirtualizedList`s — preserve that default in new builders.
- `reverse()` runs `backward.start()` and `reset()` runs both `forward.reset()` and `backward.reset()`; expose them as-is so callers can compose timelines.
