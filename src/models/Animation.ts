import type {
	Animated,
	DimensionValue,
	EasingFunction,
	ViewStyle,
} from "react-native";

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

export type AnimationTimelineConfiguration = {
	// biome-ignore lint/suspicious/noExplicitAny: Too complex of a generic type to write a proper interface. Can be a union of keyof AnimationViewStyle etc. In any case it's a simple timeline that triggers precomposed animations, doesn't really care about the type.
	[ms: number]: Array<ElementAnimation<any>>;
};

// Everything you actually animate
export type AnimatableValue =
	| number
	| string
	| DimensionValue
	| Animated.Value
	| Animated.AnimatedInterpolation<number | string>;

export type CustomAnimatableProperties = {
	translateX?: AnimatableValue;
	translateY?: AnimatableValue;
	scaleX?: AnimatableValue;
	scaleY?: AnimatableValue;
	scale?: AnimatableValue;
	skewX?: AnimatableValue;
	skewY?: AnimatableValue;
	rotation?: `${number}deg` | `${number}rad`;
};

// Minimal view style for animation
export type AnimationViewStyle = Partial<ViewStyle> &
	CustomAnimatableProperties;

// Keyed animation object
export type ViewAnimation<
	Keys extends keyof AnimationViewStyle = keyof AnimationViewStyle,
> = {
	[K in Keys]?: AnimationViewStyle[K];
};

// Container for animations
export interface Animations {
	animations?: ViewAnimation;
}

export type ElementAnimation<Keys extends keyof AnimationViewStyle> = {
	animations: ViewAnimation<Keys>;
	forward: Animated.CompositeAnimation;
	backward: Animated.CompositeAnimation;
	/** Start animation with onFinished callback. Using forward.start() */
	start(onFinished?: () => void): void;
	/** Reverse all animation values to initial value and reset main trigger. Using backward.start() */
	reverse: (onFinished?: () => void) => void;
	/** Reset animations to initial value. Using forward.reset() */
	reset: Animated.CompositeAnimation["reset"];
};

export interface Animations {
	animations?: ViewAnimation<keyof AnimationViewStyle>;
}
