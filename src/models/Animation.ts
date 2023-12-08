import { Animated, EasingFunction, TextStyle, ViewStyle } from "react-native";

export type ElementStyle = ViewStyle;

export type AnimationConfiguration = {
  duration: number;
  loop?: boolean;
  easing?: EasingFunction;
};

export type StaggerAnimationConfiguration = AnimationConfiguration & {
  stagger: number;
};

export type AnimationStyle<Keys extends keyof ElementStyle> = Record<
  Keys,
  string[] | number[]
>;

export type Animation<Keys extends keyof ElementStyle> = Record<
  Keys,
  Animated.AnimatedInterpolation<string | number>
>;

export type ElementAnimation<Keys extends keyof ElementStyle> = {
  animations: Animation<Keys>;
  start(onFinished?: () => void): void;
  stop: Animated.CompositeAnimation["stop"];
  reset: Animated.CompositeAnimation["reset"];
};

export interface Animations<T extends keyof ElementStyle = keyof ViewStyle> {
  animations?: Animation<T>;
}
