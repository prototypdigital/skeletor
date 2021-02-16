# Welcome to Skeletor

## Our in-house react-native submodule to make your life easier

### Initialization

1. Navigate your terminal to the "skeletor" folder
2. Type in `yarn install`
3. Navigate your terminal to the "ios" folder
4. Type in `pod install`

---

## Project setup

Since this is supposed to be as configurable as possible while still maintaining some form and structure with how things should be done, you'll have to set up a couple things first.

### 1. Configure global constants (skeletor/const)

#### Color.ts

This contains all the project colors. Since some components rely on what has already been entered, feel free to extend the enumerable with whatever you require and change any value you need, but do not change the names already provided.

#### FontFamily.ts

When you have added custom fonts to the application, make sure you list the exact name of the under the `type FontFamily = ...` line. You can remove the undefined preset.
Example: `type FontFamily = "Montserrat-Light" | "Montserrat-Bold";`

Once you have set your custom fonts up, make sure to select the default one to be used in the app under the `export const DefaultFont...` line from the list above. You can also remove the undefined value.
Example: `export const DefaultFont: FontFamily = "Montserrat-Light";`

#### Spacing.ts

This contains a list of app-specific dimensions used for margins and paddings. It would be best to use the predefined names, but you can modify it to include as many increments as possible. This should be used thruoghout the entire app - AVOID using custom values such as `paddingLeft = 29`, always aim to use `paddingLeft = Spacing.Lrg` instead, for example.

#### Validators.ts

This contains the default validation rules you can use in tandem with the _useForm_ hook validation rules. Can be extended, unused, whatever. It's just to make your life easier with the two default values you will definitely need to validate in every project.

### 2. Configure component styles

_\_Input_ and _\_Text_ have their own style structure which is defined in the _InputConfig.ts_ and _TextConfig.ts_ files respectively. Set up your application's default theme for those two components within the config files, but try not to modify the existing structure if at all avoidable.
