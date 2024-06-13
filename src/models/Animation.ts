import {
  AnimatableStringValue,
  Animated,
  EasingFunction,
  ViewStyle,
} from "react-native";

export type AnimationConfiguration = {
  duration?: number;
  /** Note:  Disables native driver. */
  loop?: boolean;
  /** Enables or disables native driver. Defaults to true. */
  native?: boolean;
  /** Defaults to Easing.inOut(Easing.ease) */
  easing?: EasingFunction;
};

export type StaggerAnimationConfiguration = AnimationConfiguration & {
  stagger?: number;
};

export type AnimationStyle<Keys extends keyof ViewStyle> = {
  [K in Keys | keyof ViewStyle]?: string[] | number[];
};

export type Animation<Keys extends keyof ViewStyle = keyof ViewStyle> = {
  [K in Keys]: Animated.AnimatedInterpolation<string | number>;
};

export type ElementAnimation<Keys extends keyof ViewStyle> = {
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

type ColorKeys = Extract<keyof ViewStyle, `${string}Color`>;
type ExcludeColorAndRotationKey = Exclude<
  keyof ViewStyle,
  `${string}Color` | "rotation"
>;

type ColorValueAnimation<Keys extends ColorKeys = ColorKeys> = {
  [K in Keys]?: ViewStyle[K] | Animated.AnimatedInterpolation<string | number>;
};

type ViewAnimation<
  Keys extends ExcludeColorAndRotationKey = ExcludeColorAndRotationKey,
> = {
  [K in Keys]?: ViewStyle[K];
} & {
  rotation?: AnimatableStringValue;
};

export type AnimationsProp = ColorValueAnimation & ViewAnimation;

export interface Animations {
  animations?: AnimationsProp;
}
