import type { Animated } from "react-native";

/** Created to remove animation functions from styles that won't be using them. */
export type NonAnimatedDimensionValue<T> = Exclude<T, Animated.AnimatedNode>;
