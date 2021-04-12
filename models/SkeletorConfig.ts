import { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface TextSizeProps {
  lineHeight: number;
  fontSize: number;
}

interface DefaultSizes {
  micro: TextSizeProps;
  tiny: TextSizeProps;
  small: TextSizeProps;
  medium: TextSizeProps;
  large: TextSizeProps;
  larger: TextSizeProps;
  huge: TextSizeProps;
}

export type SkeletorConfig<Sizes = DefaultSizes> = {
  textSizes: { [K in keyof Sizes]: { fontSize: number; lineHeight: number } };
  defaultTextSize: keyof Sizes;
  defaultColor: string;
  defaultFont: string;
  defaultStatusBarType: 'dark-content' | 'light-content' | 'default';
  inputContainerStyle: StyleProp<ViewStyle>;
  inputErrorStyle: StyleProp<TextStyle>;
  inputFocusStyle: StyleProp<TextStyle>;
  inputDisabledStyle: StyleProp<TextStyle>;
  inputMultilineStyle: StyleProp<TextStyle>;
  inputDefaultStyle: StyleProp<TextStyle>;
};
