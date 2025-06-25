import type { Animated, ViewStyle } from "react-native";
import type { FourSideTuple } from "./TupleTypes";

type MarginKey = Extract<keyof ViewStyle, `margin${string}`>;
type PaddingKey = Extract<keyof ViewStyle, `padding${string}`>;
// Created to remove callback listeners from style properties autocomplete.
type NonAnimatedStyle<Type> = Exclude<Type, Animated.AnimatedNode>;

export type MarginStylesBase = {
	[K in MarginKey]?: NonAnimatedStyle<ViewStyle[K]>;
};
export type PaddingStylesBase = {
	[K in PaddingKey]?: NonAnimatedStyle<ViewStyle[K]>;
};

export type MarginStyles =
	| MarginStylesBase
	| FourSideTuple<NonAnimatedStyle<ViewStyle["margin"]>>
	| NonAnimatedStyle<ViewStyle["margin"]>;

export type PaddingStyles =
	| PaddingStylesBase
	| FourSideTuple<NonAnimatedStyle<ViewStyle["padding"]>>
	| NonAnimatedStyle<ViewStyle["padding"]>;

type GapType = { row?: number; col?: number } | [number, number] | number;

export interface Spacing {
	margins?: Exclude<MarginStyles, Animated.AnimatedNode>;
	paddings?: Exclude<PaddingStyles, Animated.AnimatedNode>;
	/** Possible value formats are { row, col } or [col, row] or just a number applied to both column and row gap. */
	gap?: GapType;
}
