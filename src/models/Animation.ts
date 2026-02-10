import type {
	Animated,
	EasingFunction,
	ScaleTransform,
	ScaleXTransform,
	ScaleYTransform,
	SkewXTransform,
	SkewYTransform,
	TranslateXTransform,
	TranslateYTransform,
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
	// biome-ignore lint/suspicious/noExplicitAny: Too complex of a generic type to write a proper interface. Can be a union of AnimatableStyleKeys etc. In any case it's a simple timeline that triggers precomposed animations, doesn't really care about the type.
	[ms: number]: Array<ElementAnimation<any>>;
};

type AnimatableValueTypes = string | number;

export type CustomAnimatableProperties = {
	translateX?: TranslateXTransform["translateX"][];
	translateY?: TranslateYTransform["translateY"][];
	scaleX?: ScaleXTransform["scaleX"][];
	scaleY?: ScaleYTransform["scaleY"][];
	scale?: ScaleTransform["scale"][];
	skewX?: SkewXTransform["skewX"][];
	skewY?: SkewYTransform["skewY"][];
	skew?: SkewXTransform["skewX"][];
	rotation?: Array<`${number}deg` | `${number}rad`>;
};

export type NonAnimatableKeys =
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
	| "borderStyle"
	| "borderCurve"
	| "pointerEvents"
	| "shadowOffset"
	| "textShadowOffset"
	| "transformMatrix"
	| "transform";

export type AnimatableStyleKeys =
	| keyof Exclude<ViewStyle, NonAnimatableKeys>
	| keyof CustomAnimatableProperties;

export type AnimationStyle<Keys extends AnimatableStyleKeys> = {
	[K in Keys]: AnimatableValueTypes[];
};

export type ComposedAnimationInterpolations<Keys extends AnimatableStyleKeys> =
	Partial<Record<Keys, Animated.AnimatedInterpolation<string | number>>>;

export type ElementAnimation<Keys extends AnimatableStyleKeys> = {
	animations: Required<ComposedAnimationInterpolations<Keys>>;
	forward: Animated.CompositeAnimation;
	backward: Animated.CompositeAnimation;
	/** Start animation with onFinished callback. Using forward.start() */
	start(onFinished?: () => void): void;
	/** Reverse all animation values to initial value and reset main trigger. Using backward.start() */
	reverse: (onFinished?: () => void) => void;
	/** Reset animations to initial value. Using forward.reset() */
	reset: Animated.CompositeAnimation["reset"];
};

export type Animations = {
	animations?: ComposedAnimationInterpolations<AnimatableStyleKeys>;
};
