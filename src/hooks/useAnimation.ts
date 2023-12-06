import { useMemo, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

/** Any is a hotfix, requires more investigation */
export type Animation<Keys extends keyof Partial<ViewStyle>> = Record<
  Keys,
  Animated.AnimatedInterpolation<string | number> | any
>;
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

export interface AnimationSet<Keys extends keyof Partial<ViewStyle>> {
  values: Animated.Value[];
  definitions: AnimationDefinition<Keys>;
  animations: Animation<Keys>;
  configuration: AnimationConfiguration;
}

export function useAnimation<Keys extends keyof Partial<ViewStyle>>(
  styles: AnimationDefinition<Keys>,
  configuration?: AnimationConfiguration
): AnimationSet<Keys> {
  const keys = Object.keys(styles).map((key) => key as Keys);
  /** Values always start at 0. These are not output values, more like indexes to output values defined in the array. */
  const values = useRef(keys.map(() => new Animated.Value(0))).current;

  const animations = useMemo(() => {
    const result: Partial<Animation<Keys>> = {};

    keys.forEach((key, index) => {
      const value = values[index];
      // We know the definition exists, otherwise we wouldn't be here.
      const definition = styles[key]!;

      const interpolation = value.interpolate({
        inputRange: definition.map((_, i) => i),
        outputRange: definition,
      });

      result[key] = interpolation;
    });

    return result as Animation<Keys>;
  }, [styles]);

  return {
    values,
    animations,
    configuration: configuration || { duration: 250 },
    definitions: styles,
  };
}
