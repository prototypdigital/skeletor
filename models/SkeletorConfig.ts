import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type SkeletorConfig = {
  general: {
    defaultFont?: string;
    defaultStatusBarType: 'dark-content' | 'light-content' | 'default';
  };
  _Text: {
    sizes?: $TextSizes;
    defaultSize?: $TextSize;
    defaultColor?: string;
  };
  _Input: {
    containerStyle?: StyleProp<ViewStyle>;
    errorStyle?: StyleProp<TextStyle>;
    focusStyle?: StyleProp<TextStyle>;
    disabledStyle?: StyleProp<TextStyle>;
    multilineStyle?: StyleProp<TextStyle>;
    defaultStyle?: StyleProp<TextStyle>;
  };
  _Button: {
    height?: number;
    paddings?: $Spacing['paddings'];
    margins?: $Spacing['margins'];
    minWidth?: number;
    baseStyle?: StyleProp<ViewStyle>;
    pressedStyle?: StyleProp<ViewStyle>;
    disabledOpacity?: number;
    textStyle?: $TextProps;
    loadingColor?: string;
  };
};
