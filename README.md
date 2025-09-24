### Welcome to Skeletor

#### Our small in-house react-native toolkit to make your life easier

## Installation

```sh
yarn add @prototyp/skeletor
```

** IMPORTANT **
Version 1.1.2 introduces a peer dependency to <b>react-native-safe-area-context</b>. If you are using this package on RN < 0.81, you'll have to install it manually if you have not already for navigation purposes.

```sh
yarn add react-native-safe-area-context
```

## Project setup

Since this is supposed to be as configurable as possible while still maintaining some form and structure with how things should be done, you'll have to set up a couple things first.

### Initialize Skeletor

Add the SkeletorProvider component as the (or one of) top wrapper of your application. Example:

```javascript
/// index.js
const App = () => {
  return (
    <SkeletorProvider>
      <StoreProvider>
        <RootNavigator />
      </StoreProvider>
    </SkeletorProvider>
  );
};
```

Configure the SkeletorProvider properties with whatever you desire. Here is the list of all configurable properties for the SkeletorProvider component:

```javascript
interface SkeletorConfig {
  defaultFont: Font | undefined;
  defaultFontSize: [number, number] | number;
  defaultStatusBarType: StatusBarStyle;
  /** Defaults to transparent if not set.
   * Can be overriden via the Screen component per-screen. */
  defaultStatusBarBackground?: ColorValue;
  /** When set to true, the application will draw under the status bar.
   * Defaults to false if not set.
   * Can be overriden via the Screen component per-screen. */
  defaultStatusBarTranslucent?: boolean;
  defaultTextColor: ColorValue;
  /** When set to true, font size will scale based on the user's device settings.
   * Defaults to false */
  allowFontScaling: boolean;
  /** Clamp the maximum font size multiplier that can be applied to the original scale. */
  defaultMaxFontSizeMultiplier?: number;
}
```

For Skeletor to detect the fonts you have added, you will have to create a type defintion file to override the existing Font type like in the following example:

```javascript
/// @types/Font.d.ts
type Font = "Helvetica" | "Roboto" | "San Francisco";
```

Then you can configure the `defaultFont` property as follows:

```javascript
<SkeletorProvider defaultFont="Helvetica">...</SkeletorProvider>
```

To get access to the skeletor styles in other components, you can use the provided `useSkeletor` hook that will return the entire Skeletor configuration object. For instance:

```javascript
const skeletor = useSkeletor();
return <SomeComponent style={{ fontFamily: skeletor.defaultFont }} />;
```

## Custom types legend

```javascript
type Spacing = {
  /** Supports CSS-like shorthands as well as ViewStyle object - 20, [0, 20], [20, 0, 30], [20, 0, 10, 40], { marginLeft: 20 } */
  margins?: MarginStyles,
  /** Supports CSS-like shorthands as well as ViewStyle object - 20, [0, 20], [20, 0, 30], [20, 0, 10, 40], { paddingLeft: 20 } */
  paddings?: PaddingStyles,
  gap?: { row?: number, col?: number } | [number, number] | number,
};

type Alignment = {
  align?: ViewStyle["alignItems"],
  alignSelf?: ViewStyle["alignSelf"],
  justify?: ViewStyle["justifyContent"],
  flexDirection?: ViewStyle["flexDirection"],
};

type Border = {
  /** All border properties from ViewStyle */
  border: { ... },
};

type Flex = {
  /** Either just a number or all flex properties from ViewStyle + gap, columnGap & rowGap for backwards compatibility */
  flex?: number | { ... },
};

type Position = {
  absolute?: boolean,
  zIndex?: number,
  /** Supports CSS-like shorthands as well as a ViewStyle object - [20], [0, 20], [10, 0, 20], [10, 0, 20, 40], { top: 20, bottom: 20, left: 20, right: 20} */
  offsets?: Offsets,
  overflow?: ViewStyle["overflow"],
};

type Size = {
  width?: DimensionValue,
  height?: DimensionValue,
  minHeight?: DimensionValue,
  minWidth?: DimensionValue,
  maxHeight?: DimensionValue,
  maxWidth?: DimensionValue,
};
```

## Components

### Screen

---

Use this as the top-level wrapper for every screen you navigate to. Is not intended as a wrapper for other components, as you may deduce from the name.

#### Props

```javascript
/** Pass a specific background view OR just a background color value. Custom components should be 100% height and width. */
  background?: React.ReactNode | ColorValue;
  hideTopSafeArea?: boolean;
  hideBottomSafeArea?: boolean;
  bottomSafeAreaColor?: ColorValue;
  topSafeAreaColor?: ColorValue;
  statusBarType?: StatusBarStyle;
  statusBarBackground?: ColorValue;
  /** When set to true, the application will draw under the status bar. */
  statusBarTranslucent?: StatusBarProps["translucent"];
```

#### Usage

```javascript
function Component: React.FC = () => {
	return <Screen background={<GradientBackground />} statusBarType="dark-content">
	 ...
	</Screen>
}
```

### Text

---

Will detect configured Font type, built with the ability to easily customize the font in use, font size, line height, letter spacing and other quick-access props so you do not have to create separate styles. <b>Hint:</b> Wrap `Text` components into `Block` components so they wrap correctly within a layout.

#### Props

```javascript
/** Inferred from @types/Font.d.ts */
font?: Font;
/** Either define [fontSize, lineHeight] or just one size applied to both fontSize and lineHeight */
size?: [number, number] | number;
textTransform?: TextStyle["textTransform"];
letterSpacing?: TextStyle["letterSpacing"];
color?: string;
textAlign?: TextStyle["textAlign"];
opacity?: TextStyle["opacity"];
...Spacing,
...Size,
...Flex,
...Position,
animations?: Partial<ViewStyle>;
```

#### Usage

To use the `Text` component, simply import it and pass in the desired props.

```javascript
import { Text } from "./Text";

function MyComponent() {
  return (
    <Text font="Arial" size={[14, 18]} color="#333" textAlign="center">
      Hello World!
    </Text>
  );
}
```

### Block

---

This is a flexible and customizable React Native component that can be used as either a `View` or a `ScrollView`. The `Block` component allows you to add paddings, margins, sizes, alignments, and borders to your layout. Can be turned into a ScrollView by passing in `scrollable`. ScrollView props can be updated through `scrollProps`.

#### Props

```javascript
/** Determine if Block is scrollable or not.*/
scrollable?: boolean;
/** If scrollable, used to control ScrollView props. Some default props are applied, check JSDOC of component by hovering over it in your IDE. */
scrollProps?: ScrollViewProps
opacity?: ViewStyle["opacity"];
animations?: Partial<ViewStyle>;
background?: JSX.Element | string;
...Position,
...Alignment,
...Flex,
...Size,
...Spacing,
...Border,

```

#### Usage

Use cases are many, but simple. This component is intended to be used as a building block for your layout. One example is:

```javascript
<Block
  maxHeight="75%"
  flexDirection="row"
  align="flex-start"
  justify="space-between"
>
  ... ...
</Block>
```

### InputFocusScrollView - iOS ONLY

---

This scroll view will automatically scroll to an active input field rendered inside it, provided you attach the `onInputFocus` callback to the input `onFocus` prop. This is a lambda component, returning a callback which you attach to input fields rendered within it.

<b>NOTE</b> &mdash; This works on iOS only, Android does this by default with `android:windowSoftInputMode`

Some default props are applied, check JSDOC of component by hovering over it in your IDE.

#### Props

```javascript
/** Decimal value of screen height percentage the input will be positioned at. */
/** Defaults to 0.3, just above the keyboard. */
focusPositionOffset?: number;
/** Is the scrollview 100% in height or automatic. Defaults to auto. */
height?: "full" | "auto";
/** Margins are applied to ScrollView style, paddings and gap to contentContainerStyle */
...Spacing,
```

#### Usage

```javascript
<InputFocusScrollView  focusPositionOffset={0.1}>
	{(onInputFocus) => (
		...
		<Input
		keyboardType="email-address"
		returnKeyType="next"
		placeholder="Your e-mail address"
		label="E-mail Address"
		emptyMessage="You must enter an e-mail."
		errorMessage="E-mail is invalid."
		value={state.email}
		valid={validation.email}
		onFocus={onInputFocus}
		onChangeText={(text) =>  update("email", text)}
		onSubmitEditing={() =>  passwordRef.current?.focus()}
		/>
		...
	)}
</InputFocusScrollView>
```

## Animations (>=v1.0.10)

New utilities have been created to reduce boilerplate when using animations Animated from react-native. The previous hook-based approach is still available.

### Breaking change >1.1.0

Looped animations are no longer configured when creating the animation due to a performance issue associated with using Animated.loop, especially when the app is backgrounded or the phone is locked.

Starting with 1.1.0, use the `loopAnimation` function to create a looped animation. The function blueprint is the same as the regular animation, except this one does not support an `onFinished` handler on the `start` call for obvious reasons.

Usage

```javascript
const element1 = loopAnimation(
  animateParallel({
    opacity: [0, 1],
    translateX: [20, 0],
    translateY: [20, 0],
  })
);
```

### Overview

The concept behind this approach is to:

1. Define element animations and how they are triggered via `animateParallel`, `animateSequence` or `animateStagger`.
2. Place compiled element animations on an animation timeline OR trigger element animations separately.

### Defining element animations using animateParallel, animateStagger, animateSequence

Use these methods to construct <b>element</b> animations in a super simple way. Create these animations outside the component body to avoid unnecessary re-renders and other lifecycle related issues. All animations are done via native driver, <i>except if the animation loops to avoid issues with the animation itself.</i>

`animateParallel` will animate all of the defined element styles in parallel (meaning they will all start animating at the same time). In the example below, this means that opacity, translateY and translateX will all start animating at once. Additional configuration is possible as a second parameter, where you can define the animation `duration`, `loop` and `easing`. The default configuration is `{ duration = 400, easing = Easing.inOut(Easing.ease), loop = false, native = true, }`.

Usage

```javascript
const element1 = animateParallel({
  opacity: [0, 1],
  translateX: [20, 0],
  translateY: [20, 0],
});
```

`animateSequence` will animate all of the defined element styles in sequence (meaning every property will start animating only when the previous property has finished animating). In the example below, that means that opacity, translateY and translateX will animate in sequence as they are defined - opacity first, translateX second, translateY last. Additional configuration is possible as a second parameter, where you can define the animation `duration`, `loop` and `easing`. The default configuration is `{ duration = 400, easing = Easing.inOut(Easing.ease), loop = false, native = true, }`.

Usage

```javascript
const element1 = animateSequence({
  opacity: [0, 1],
  translateX: [20, 0],
  translateY: [20, 0],
});
```

`animateStagger` will animate all of the defined elements in the order they are defined at a staggered pace defined in the configuration object (meaning every property will start animating after an X amount of miliseconds between animation starts, in the order they are defined in). In the example below, that means that opacity, translateY and translateX will animate in sequence with a 400ms delay between them. Additional configuration is possible as a second parameter, where you can define the animation `duration`, `stagger`, `loop` and `easing`. The default configuration is `{ duration = 400, stagger = 200, easing = Easing.inOut(Easing.ease), loop = false, native = true, }`.

Usage

```javascript
const element1 = animateStagger({
  opacity: [0, 1],
  translateX: [20, 0],
  translateY: [20, 0],
});
```

### Defining element animation timeline

Once defined, the animations can be layed out on a timeline using the `createAnimationTimeline` function. The return value of the `createAnimationTimeline` is an `Animated.CompositeAnimation` wrapping all defined animations on the timeline, giving you a single start/stop function to trigger all animations wrapped in the timeline.

The configuration object is of type `{ [ms: number]: ElementAnimation<K>[]; }`, with the key of the object representing the point-in-time in ms when the associated animation array will trigger. In the following example, this means that, once started, at 0ms (without delay) the `element1` animation set will start, and at 2000ms the `element2` animation will start.

### Everything combined

Usage

```javascript
const element1 = animateParallel({ opacity: [0, 1] }, { duration: 400 });
const element2 = animateStagger(
  {
    opacity: [0, 1],
    translateX: [20, 0],
    translateY: [20, 0],
  },
  { stagger: 1200, duration: 800 },
);

const timeline = createAnimationTimeline({
  0: [element1],
  2000: [element2],
});

export const Component: React.FC = () => {
	...
	useEffect(() => {
		if(startAnimation) {
			timeline.start();
		} else {
			timeline.reset();
		}
	}, [startAnimation])

	return <Block animations={element1.animations}>...</Block>
}
```

### Reversing element animations.

Instead of just reseting the animation, which does not play the animation back in reverse, the utility also exposes a `reverse` function which will animate the element back to it's initial values.
Instead of `element.reset()`, use `element.reverse()`. This can also be used on timelines.

Usage

```javascript
const element = animateStagger(
  {
    opacity: [0, 1],
    translateX: [20, 0],
    translateY: [20, 0],
  },
  { stagger: 1200, duration: 800 },
);

...

useEffect(() => {
  if (startAnimation) {
    element.start();
  } else {
    element.reverse();
  }
}, [startAnimation]);
```

## Hooks

### useForm & useFormUtils

Read documentation about useForm here: https://github.com/prototypdigital/skeleform

### DEPRECATED (<1.0.10): useAnimation & useAnimationTimeline

This approach is not going to be maintained anymore starting from version 1.0.10. New utilities have been created that are more performant and more flexible, but the following hooks will still be available for the foreseeable future. For more information on the new approach, see <b>Animations</b> above.

---

`useAnimation` helps you quickly create simple animations and transitions using the default react-native animation toolkit. You can define as many animations as possible for a single element with a single invocation of the hook.

`useAnimationTimeline` is used to lay the defined animations out on a timeline and configure when and how each animation is triggered. Available methods are `stagger`, `parallel`, `sequence`, `delay`.

#### Usage

```javascript
const inputs = useAnimation(...);
const heading = useAnimation(
	{opacity: [0, 1], translateY: [20, 0]},
	{duration: 400},
);

// Use this hook to lay the animations out in a specific schedule/timeline.
useAnimTimeline({
	stagger: {
		elements: [heading, inputs],
		stagger: 200,
		start: true,
	},
});

...

// Animations can be passed directly into the Block component without any particular modification
<Block animations={heading.animations}>...</Block>

// If not using Block, transformations (scale, rotate, translate) cannot be applied outside the transform style - translateY has to be passed in through the transform style prop.
<Animated.View
	style={{
		...heading.animations,
		transform: [{translateY: heading.animations.translateY}],
	}}
>
	...
</Animated.View>
```

### useAndroidBackHandler

---

Handle how the android back button behaves through enabling / disabling the button or passing in a completely custom callback. External `enabled` control in order to be able to mount / unmount the back handler event based on outside integrations, such as checking if the current screen is focused or not with `react-navigation`. Will always be cleared on unmount.

#### Usage

```javascript
const Component: React.FC = () => {
	useAndroidBackHandler({
		handlePress: () =>  setOpenCancelModal(true),
		enabled: !openCancelModal  &&  isFocused,
	});
	...
}
```

### useAppState

---

Handle what happens when the application changes state between background and foreground. <b>Note:</b> Background states cannot be processed on Android, only foreground.

#### Usage

```javascript
useAppState({ onForeground: () => Alert.alert("Foreground") });
```

## Contributions

Suggestions and requests welcome, contributions appreciated but will be reviewed.
