import { Animated, EasingFunction, ViewStyle } from "react-native";

export type AnimationConfiguration = {
  duration: number;
  loop?: boolean;
  easing?: EasingFunction;
};

export type StaggerAnimationConfiguration = AnimationConfiguration & {
  stagger: number;
};

export type AnimationStyle<Keys extends keyof ViewStyle> = {
  [K in Keys | keyof ViewStyle]?: string[] | number[];
};

export type Animation<Keys extends keyof ViewStyle = keyof ViewStyle> = {
  [K in Keys]: Animated.AnimatedInterpolation<string | number>;
};

export type ElementAnimation<Keys extends keyof ViewStyle> = {
  animations: Animation<Keys>;
  composition: Animated.CompositeAnimation;
  start(onFinished?: () => void): void;
  /** Reverse all animation values to initial value and reset main trigger. */
  reverse: () => void;
  reset: Animated.CompositeAnimation["reset"];
};

export interface Animations {
  animations?: Partial<ViewStyle>;
}
