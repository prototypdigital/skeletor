import type { Animated, EasingFunction, ViewStyle } from "react-native";

export type AnimationConfiguration = {
	duration?: number;
	/** Enables or disables native driver. Defaults to true. Unexpected lifecycle behavior might be experience when false. If animations behave weirdly, try changing this. */
	native?: boolean;
	/** Defaults to Easing.inOut(Easing.ease) */
	easing?: EasingFunction;
	/** Defaults to false to prevent unintended issues with VirtualizedLists */
	isInteraction?: boolean;
};

export type StaggerAnimationConfiguration = AnimationConfiguration & {
	stagger?: number;
};

type NonAnimatableKeys =
	| "rotation"
	| "alignItems"
	| "alignContent"
	| "alignSelf"
	| "justifyContent"
	| "display"
	| "flexDirection"
	| "flexWrap"
	| "overflow"
	| "position"
	| "zIndex"
	| "elevation"
	| "direction"
	| "backfaceVisibility"
	| "borderCurve"
	| "borderStyle"
	| "pointerEvents"
	| "overflow"
	| "transform";

export type CleanViewStyle = Omit<ViewStyle, NonAnimatableKeys> & {
	rotation?: `${number}deg` | `${number}rad`;
};

export type AnimationViewStyle = {
	[K in keyof CleanViewStyle]: Exclude<
		CleanViewStyle[K],
		Animated.AnimatedNode
	>;
};

export type AnimationStyle<Keys extends keyof AnimationViewStyle> = {
	[K in Keys | keyof AnimationViewStyle]?: AnimationViewStyle[K][];
};

export type Animation<
	Keys extends keyof AnimationViewStyle = keyof AnimationViewStyle,
> = {
	[K in Keys]: Animated.AnimatedInterpolation<string | number>;
};

export type ElementAnimation<Keys extends keyof AnimationViewStyle> = {
	animations: Animation<Keys>;
	forward: Animated.CompositeAnimation;
	backward: Animated.CompositeAnimation;
	/** Start animation with onFinished callback. Using forward.start() */
	start(onFinished?: () => void): void;
	/** Reverse all animation values to initial value and reset main trigger. Using backward.start() */
	reverse: (onFinished?: () => void) => void;
	/** Reset animations to initial value. Using forward.reset() */
	reset: Animated.CompositeAnimation["reset"];
};

export type ViewAnimation<Keys extends keyof AnimationViewStyle> = {
	[K in Keys | keyof AnimationViewStyle]?:
		| AnimationViewStyle[K]
		| Animated.AnimatedInterpolation<string | number>;
};

export interface Animations {
	animations?: ViewAnimation<keyof AnimationViewStyle>;
}
