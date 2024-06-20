import type { ViewStyle } from "react-native/types";

type BorderKey = Extract<keyof ViewStyle, `border${string}`>;
type BorderStyles = {
  [K in BorderKey]?: ViewStyle[K];
};

export interface Border {
  border?: BorderStyles;
}
