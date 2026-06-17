---
name: new-skeletor-primitive
description: Scaffold a skeletor primitive (Block/Text-shaped) — own folder, typed style-prop intersection, extract + memoizeStyle, displayName, index.ts barrel. Use when adding a skeletor component.
profiles:
  - frontend
  - fullstack
---

# new-skeletor-primitive

Use this skill when adding a new primitive component to the `@prototyp/skeletor` library (e.g. a new `Card`, `Row`, `Avatar`) so it matches the `Block`/`Text` architecture exactly.

## Triggers

- "add a new skeletor primitive / component"
- "scaffold a `<Name>` component in skeletor"
- A new file is about to be created under `src/components/` in the skeletor repo

## Protocol

### Step 1 — Create the folder + barrel, register it

Never author a loose file. Create the folder layout and register the barrel:

```text
src/components/<Name>/
  <Name>.tsx
  index.ts            →  export * from "./<Name>";
src/components/index.ts   →  add: export * from "./<Name>";
```

Leave the sibling `src/components/package.json` (`{ "name": "components" }`) untouched.

### Step 2 — Type the props as a style-prop intersection

Pick the style facets the primitive needs from the shared models — do not invent a `ViewStyle` blob.

```text
Container-like (Block-shaped)? → Alignment & Spacing & Size & Border & Flex & Position & Animations & ViewProps
Text-like?                     → OwnProps & Spacing & Size & Flex & Position & Animations  (no Alignment/Border)
```

Add JSDoc to any prop with a non-obvious shape (spacing tuples, `[fontSize, lineHeight]`), matching the model's existing `@param`/`@example` comments.

### Step 3 — Build the internal element through the pipeline

Destructure `style`/`animations` out, run the pipeline, apply styles in canonical order, and set `displayName`:

```tsx
const <Name>Element: React.FC<PropsWithChildren<<Name>ElementProps>> = ({ children, ...props }) => {
  const { style, animations, ...rest } = props;
  const animationProps = extractAnimationProperties(animations);
  const skeletorStyle = extractSkeletorStyleProperties(rest);
  const elementStyle = memoizeStyle({ /* element-local color/opacity only */ });

  return (
    <Animated.View {...rest} style={[skeletorStyle, elementStyle, style, animationProps]}>
      {children}
    </Animated.View>
  );
};
<Name>Element.displayName = "<Name>Element";
```

### Step 4 — Resolve defaults from context, props win

For any tunable default, read `useSkeletor()` and let the prop override it (`prop ?? skeletor.defaultX`). If the default is new and global, add it to `SkeletorConfig` + `SkeletorDefaults` (see the `skeletor-context-defaults` rule). Use relative imports only (`../../utils`, `../../models`, `../../hooks`).

### Step 5 — Wrap for variants if needed

If the primitive has a mode (like `Block`'s `scrollable`), add a public `<Name>` wrapper that routes to the element via a `props is …` type guard; otherwise the public component *is* the element. Do not call `StyleSheet.create` anywhere.

## Completion checklist

- [ ] Component lives in `src/components/<Name>/` with `<Name>.tsx` + `index.ts` barrel, registered in `src/components/index.ts`
- [ ] Props are a typed intersection of shared models, not a raw `ViewStyle`
- [ ] Styles flow through `extractSkeletorStyleProperties` + `memoizeStyle`, applied as `[skeletorStyle, elementStyle, style, animationProps]`
- [ ] Internal element has a `displayName`
- [ ] Defaults come from `useSkeletor()` with the prop winning; no hardcoded magic values
- [ ] All imports are relative; no bare `utils`/`models`/`components`/`hooks`; no `StyleSheet.create`
- [ ] `biome check --write src` passes (formatting + import rules)

## When NOT to use

- Editing an existing component's behavior rather than scaffolding a new one — just follow the `skeletor-*` rules inline
- Authoring a `use*` hook — use the `new-skeletor-hook` skill instead
- Working in a consumer app that *uses* skeletor rather than the library itself
