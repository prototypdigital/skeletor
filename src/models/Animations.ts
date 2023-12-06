import { Animated, ViewStyle } from "react-native";

/** Any is a hotfix, requires more investigation */
export type AnimationDefinition<Keys extends keyof Partial<ViewStyle>> = Record<
  Keys,
  number[] | string[]
>;

export interface AnimationConfiguration {
  /** In miliseconds */
  duration: number;
  /** Loop will disable native driver because it breaks the loop animation (at least it did last time I tested in 2020.) */
  loop?: boolean;
  useNativeDriver?: boolean;
}

export type AnimationProperties<
  Keys extends keyof Partial<ViewStyle> = keyof Partial<ViewStyle>
> = Record<Keys, Animated.AnimatedInterpolation<string | number> | any>;

export type Animation = { animations?: AnimationProperties };
