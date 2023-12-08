### Welcome to Skeletor

#### Our small in-house react-native toolkit to make your life easier

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
  defaultStatusBarType: "dark-content" | "light-content" | "default";
  defaultTextColor: string;
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

## Components

### Screen

---

Use this as the top-level wrapper for every screen you navigate to. Is not intended as a wrapper for other components, as you may deduce from the name.

#### Props

```
/** Pass a specific background view (gradients, animated backgrounds etc) OR just a background color value. Custom components should be 100% height and width to span the full screen area. */
background?: JSX.Element | string;
hideTopSafeArea?: boolean;
hideBottomSafeArea?: boolean;
/** Set bottom safe area background color */
bottomSafeAreaColor?: string;
/** Set top safe area background color */
topSafeAreaColor?: string;
/** Set device status bar color type. */
statusBarType?: "default" | "light-content" | "dark-content";
isLandscape?: boolean;
```

#### Usage

```typescript
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

```typescript
/** Inferred from @types/Font.d.ts */
font?: Font;
/** Either define [fontSize, lineHeight] or just one size applied to both fontSize and lineHeight */
size?: [number, number] | number;
textTransform?: TextStyle["textTransform"];
letterSpacing?: TextStyle["letterSpacing"];
color?: string;
textAlign?: TextStyle["textAlign"];
opacity?: TextStyle["opacity"];
```

#### Usage

To use the `Text` component, simply import it and pass in the desired props.

```typescript
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

This is a flexible and customizable React Native component that can be used as either a `View` or a `ScrollView`. The `Block` component allows you to add paddings, margins, sizes, alignments, and borders to your layout. Extends `ScrollViewProps` or `ViewProps` depending on the value of the `scrollable` prop.

#### Props

```typescript
/** Determine if Block is scrollable or not. If scrollable, extends ScrollView props. */
scrollable?: boolean;
align?: ViewStyle["alignItems"];
alignSelf?: ViewStyle["alignSelf"];
justify?: ViewStyle["justifyContent"];
flexDirection?: ViewStyle["flexDirection"];
flex?:
	| number
	| {
			columnGap?: ViewStyle["columnGap"],
      flex?: ViewStyle["flex"],
      flexBasis?: ViewStyle["flexBasis"],
      flexGrow?: ViewStyle["flexGrow"],
      flexShrink?: ViewStyle["flexShrink"],
      flexWrap?: ViewStyle["flexWrap"],
      gap?: ViewStyle["gap"],
      rowGap?: ViewStyle["rowGap"]
		};
width?: number | string;
height?: number | string;
minHeight?: number | string;
minWidth?: number | string;
maxHeight?: number | string;
maxWidth?: number | string;
margins?: {
	marginTop?: number | string;
	marginBottom?: number | string;
	marginLeft?: number | string;
	marginRight?: number | string;
	marginHorizontal?: number | string;
	marginVertical?: number | string;
	margin?: number | string;
};
paddings?: {
	paddingTop?: number | string;
	paddingBottom?: number | string;
	paddingLeft?: number | string;
	paddingRight?: number | string;
	paddingHorizontal?: number | string;
	paddingVertical?: number | string;
	padding?: number | string;
};
border?: {
	borderWidth?: number;
	borderTopWidth?: number;
	borderBottomWidth?: number;
	borderLeftWidth?: number;
	borderRightWidth?: number;
	borderColor?: string;
	borderRadius?: number;
	borderTopLeftRadius?: number;
	borderTopRightRadius?: number;
	borderBottomLeftRadius?: number;
	borderBottomRightRadius?: number;
	...allOtherBorderProperties
};

```

#### Usage

Use cases are many, but simple. This component is intended to be used as a building block for your layout. One example is:

```typescript
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

#### Props

```typescript
/** Decimal value of screen height percentage the input will be positioned at. */
/** Defaults to 0.3, just above the keyboard. */
focusPositionOffset?: number;
/** Is the scrollview 100% in height or automatic. Defaults to auto. */
height?: "full" | "auto";
```

#### Usage

```typescript
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

## Hooks

### useForm & useFormUtils

Read documentation about useForm here: https://github.com/prototypdigital/skeleform

### useAnimation & useAnimationTimeline

---

`useAnimation` helps you quickly create simple animations and transitions using the default react-native animation toolkit. You can define as many animations as possible for a single element with a single invocation of the hook.

`useAnimationTimeline` is used to lay the defined animations out on a timeline and configure when and how each animation is triggered. Available methods are `stagger`, `parallel`, `sequence`, `delay`.

#### Usage

```javascript
const inputs = useAnimation(...);
const  heading  =  useAnimation(
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

// Transformations cannot be applied outside the transform style.
// so translateY has to be passed in through the transform style prop.
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

## Disclaimer

Parts of this readme file were generated with ChatGPT.
Thank you for making documentation easy for a lazy programmer.
