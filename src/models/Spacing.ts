import type { ViewStyle } from "react-native";
import type { NonAnimatedDimensionValue } from "./NonAnimatedDimensionValue";
import type { FourSideTuple } from "./TupleTypes";

type MarginKey = Extract<keyof ViewStyle, `margin${string}`>;
type PaddingKey = Extract<keyof ViewStyle, `padding${string}`>;

export type MarginStylesBase = {
	[K in MarginKey]?: NonAnimatedDimensionValue<ViewStyle[K]>;
};
export type PaddingStylesBase = {
	[K in PaddingKey]?: NonAnimatedDimensionValue<ViewStyle[K]>;
};

export type MarginStyles =
	| MarginStylesBase
	| FourSideTuple<NonAnimatedDimensionValue<ViewStyle["margin"]>>
	| NonAnimatedDimensionValue<ViewStyle["margin"]>;

export type PaddingStyles =
	| PaddingStylesBase
	| FourSideTuple<NonAnimatedDimensionValue<ViewStyle["padding"]>>
	| NonAnimatedDimensionValue<ViewStyle["padding"]>;

type GapType = { row?: number; col?: number } | [number, number] | number;

export interface Spacing {
	margins?: MarginStyles;
	paddings?: PaddingStyles;
	/** Possible value formats are { row, col } or [col, row] or just a number applied to both column and row gap. */
	gap?: GapType;
}
