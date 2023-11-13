import { ViewStyle } from "react-native/types";

type MarginKey = Extract<keyof ViewStyle, `margin${string}`>;
type PaddingKey = Extract<keyof ViewStyle, `padding${string}`>;

type MarginStyles = {
  [K in MarginKey]?: ViewStyle[K];
};

type PaddingStyles = {
  [K in PaddingKey]?: ViewStyle[K];
};

export interface Spacing {
  margins?: MarginStyles;
  paddings?: PaddingStyles;
}
