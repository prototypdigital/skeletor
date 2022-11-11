# Welcome to Skeletor

## Our in-house react-native submodule to make your life easier

### Initialization

1. Open the root of your react-native project in the terminal.
2. Change directory to where you want to add the skeletor folder, ie: `cd src && git submodule add git@github.com:prototypdigital/skeletor.git`
3. You are good to go!

---

## Project setup

Since this is supposed to be as configurable as possible while still maintaining some form and structure with how things should be done, you'll have to set up a couple things first.

### Initialize Skeletor

1. Add the SkeletorProvider component as the (or one of) top wrapper of your application. Example:

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

2. Configure the SkeletorProvider properties with whatever you desire. Here is the list of all configurable properties for the SkeletorProvider component:

```javascript
type SkeletorConfig = {
    defaultFont: $Font,
    defaultStatusBarType: "dark-content" | "light-content" | "default",
};
```

For Skeletor to detect the fonts you have added, you will have to create a type defintion file to override the existing $Font type like in the following example:

```javascript
/// src/types/$Font.d.ts
type $Font = "Helvetica" | "Roboto" | "San Francisco";
```

Then you can configure the `defaultFont` property as follows:

```javascript
<SkeletorProvider general={{ defaultFont: "Arial" }}>...</SkeletorProvider>
```

## Usage

1. To get access to the skeletor styles in other components, you can use the provided `useSkeletor` hook that will return the entire Skeletor configuration object. For instance:

```javascript
const skeletor = useSkeletor();
return <SomeComponent style={{ fontFamily: skeletor.defaultFont }} />;
```

2. The `$Text`, `$Screen`, `$Block` components have been built to make inline styling easy and allow you to quickly compose screens eliminating a lot of the need to create StyleSheet styles. As a rule of thumb:

-   Wrap every screen you navigate to with `$Screen`. It has some helpful layout properties and events built into it.
-   You can control how every component is laid out with the `$Block` component. It can defined alignment, spacing, size and border properties inline, without the need to generate a StyleSheet.
-   Use `$Text` instead of the default `Text` component, it has inline properties that help you change the font to your custom font defined in the `$Font` type and will always default to the one you set in the `SkeletonProvider` context wrapper.

3. List of utility hooks you can use:

-   `useForm` -> This can handle input change / validation without any particular handler being created. It will make working with forms and inputs a LOT easier.
-   `useAnimation` & `useAnimationTimeline` -> This will help you create animations with as little code as possible. `useAnimation` defines the animations, `useAnimationTimeline` lays the animated elements out on a timeline you can configure with delays, staggers, parallel executions etc. There are caveats - for instance `transformX/transformY` can be defined in the `useAnimation` hook, but when using it on an animated element you have to pass the values in as follows:

```javascript
<Animated.View
    style={{ transform: [{ translateY: element.animations.translateY }] }}
>
    ...
</Animated.View>
```

### TODO

1. Improve documentation
2. Maybe separate `$Screen` into `$ScreenContainer`, `$ScreenHeader`, `$ScreenContent`, `$ScreenFooter` to clean up properties and not have to pass in header/footer as a prop.
