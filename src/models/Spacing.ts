import { ViewStyle } from "react-native/types";

type MarginKey = Extract<keyof ViewStyle, `margin${string}`>;
type PaddingKey = Extract<keyof ViewStyle, `padding${string}`>;

type MarginStyles = {
  [K in MarginKey]?: ViewStyle[K];
};

type PaddingStyles = {
  [K in PaddingKey]?: ViewStyle[K];
};

type GapType = { row?: number; col?: number } | [number, number] | number;

export interface Spacing {
  margins?: MarginStyles;
  paddings?: PaddingStyles;
  /** Possible value formats are { row, col } or [col, row] or just a number applied to both column and row gap. */
  gap?: GapType;
}
