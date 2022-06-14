# Welcome to Skeletor

## Our in-house react-native submodule to make your life easier

### Initialization

1. Open the root of your react-native project in the terminal.
2. Type in `cd src && git submodule add git@github.com:prototypdigital/skeletor.git && cd ..`
3. Type in `yarn add ./src/skeletor`
4. You are good to go!

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

2. Configure the SkeletorProvider properties with whatever you desire. There are defaults set (SkeletorDefaults import), but the properties are as configurable as they need to be. You can configure all of the prebuilt Skeletor components. Here is the list of all configurable properties for the SkeletorProvider component:

```javascript
type SkeletorConfig = {
  general: {
    defaultFont?: string,
    defaultStatusBarType: 'dark-content' | 'light-content' | 'default',
  },
  _Text: {
    sizes: _TextSizes,
    defaultSize: _TextSize,
    defaultColor: string,
  },
  _Input: {
    containerStyle: StyleProp<ViewStyle>,
    errorStyle: StyleProp<TextStyle>,
    focusStyle: StyleProp<TextStyle>,
    disabledStyle: StyleProp<TextStyle>,
    multilineStyle: StyleProp<TextStyle>,
    defaultStyle: StyleProp<TextStyle>,
  },
  _Button: {
    height: number,
    paddings: _Spacing['paddings'],
    margins: _Spacing['margins'],
    minWidth: number,
    baseStyle: StyleProp<ViewStyle>,
    pressedStyle: StyleProp<ViewStyle>,
    disabledOpacity: number,
    textStyle: _TextProps,
    loadingColor: string,
  },
};
```

To override any of the defaults set, pass the object as a parameter into the `SkeletorProvider component` like so:

```javascript
<SkeletorProvider general={{ defaultFont: 'Arial' }}>...</SkeletorProvider>
```

## Usage

1. To get access to the skeletor styles in other components, you can use the provided `useSkeletor` hook that will return the entire Skeletor configuration object. For instance:

```javascript
const skeletor = useSkeletor();

return <SomeComponent style={{ fontFamily: skeletor.general.defaultFont }} />;
```

2. Feel free to use all the Skeletor components at your disposal. Those include `_Image`, `_Text`, `_Button`, `_Screen`, `$Wrapper`, `_Container` and `_Input`. They will make your life easier when creating screens or components, trust me.

3. There are hooks at your disposal, which are sort of documented. Most notably, you can use `useForm` together with `_Input` components for much easier form validation and handling. For animations, you can use `useAnims` to make animation handling a little bit easier. Each one of those is documented enough, so have a crack at it.
