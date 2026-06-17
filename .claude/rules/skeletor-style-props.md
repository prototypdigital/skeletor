---
description: >-
  Skeletor primitives accept a typed style-prop intersection, convert via
  extractSkeletorStyleProperties + memoizeStyle, and apply styles in canonical
  order — never StyleSheet.create in a body.
paths:
  - src/components/**/*.tsx
---

# Skeletor style-prop pipeline

Every skeletor primitive (`Block`, `Text`, …) is a thin wrapper over an `Animated` view whose styling comes entirely from typed props, not a `StyleSheet`. Breaking the pipeline produces components that ignore `margins`/`paddings`/`flex`, lose the global style cache, and re-create style objects every render.

## Rules

- Type the public props as an intersection of the shared style models, not a hand-written `ViewStyle` blob: `Alignment & Spacing & Size & Border & Flex & Position & Animations` (drop the facets the primitive genuinely cannot use — `Text` omits `Alignment`/`Border`).
- Convert layout props with `extractSkeletorStyleProperties(rest)` — never read `props.margins`/`props.paddings`/`props.flex` by hand. It already normalizes spacing, flex, gap, size, alignment, and position for you.
- Run any element-local style object (color, opacity, background) through `memoizeStyle({...})`. Raw object literals defeat the global style cache and break referential stability.
- Pull animation styles with `extractAnimationProperties(animations)` and apply them as the **last** entry in the style array.
- Apply styles in the canonical order `style={[skeletorStyle, elementStyle, style, animationProps]}` so consumer `style` overrides skeletor defaults and animations override everything.
- Never call `StyleSheet.create` inside a component body — there is no `StyleSheet` import anywhere in `src/components`.

## Examples

```tsx
// BAD — StyleSheet.create in the body, hand-read props, raw style object,
// wrong override order (consumer style can't win), no memoization.
export const Card: React.FC<PropsWithChildren<ViewProps>> = ({ children, style, ...props }) => {
  const styles = StyleSheet.create({
    card: { padding: props.paddings, margin: props.margins, flex: 1 },
  });
  return <View style={[{ opacity: 0.9 }, style, styles.card]} {...props}>{children}</View>;
};

// GOOD — typed intersection, extract → memoize, canonical array order.
type CardProps = Alignment & Spacing & Size & Border & Flex & Position & Animations & ViewProps;

export const Card: React.FC<PropsWithChildren<CardProps>> = ({ children, ...props }) => {
  const { style, animations, ...rest } = props;
  const animationProps = extractAnimationProperties(animations);
  const skeletorStyle = extractSkeletorStyleProperties(rest);
  const elementStyle = memoizeStyle({ opacity: 0.9 });

  return (
    <Animated.View {...rest} style={[skeletorStyle, elementStyle, style, animationProps]}>
      {children}
    </Animated.View>
  );
};
```

## Gotchas

- `extractSkeletorStyleProperties` already calls `memoizeStyle` on its result, so don't wrap its return value again.
- Spread the *rest* of props onto the element (`{...rest}`) and destructure `style`/`animations` out first — passing `animations` straight to an RN view is a no-op and pollutes the DOM props.
- `memoizeStyle` freezes the returned object (`Object.freeze`). Never mutate a style object after creating it; build a new one.
