import { Animated, Easing, ViewStyle } from "react-native";

import {
  Animation,
  AnimationConfiguration,
  AnimationStyle,
  ElementAnimation,
  StaggerAnimationConfiguration,
} from "../models";

function processStyles<Keys extends keyof ViewStyle>(
  styles: AnimationStyle<Keys>,
  config: AnimationConfiguration,
) {
  const keys = Object.keys(styles) as Keys[];
  const values = keys.map(() => new Animated.Value(0));
  const compositions: Animated.CompositeAnimation[] = [];
  const animations: Partial<Animation<Keys>> = {};

  keys.forEach((key, index) => {
    const value = values[index];
    const definition = styles[key]!;

    const animation = value.interpolate({
      inputRange: definition.map((_, i) => i),
      outputRange: definition,
    });

    let composition = Animated.timing(value, {
      toValue: definition.length - 1,
      duration: config.duration,
      useNativeDriver: !config.loop,
      easing: config.easing || Easing.inOut(Easing.quad),
    });

    if (config.loop) {
      composition = Animated.loop(composition);
    }

    animations[key] = animation;
    compositions.push(composition);
  });

  return {
    values,
    compositions,
    animations: animations as Animation<Keys>,
  };
}

/** Animate styles in parallel.
 * Example: if you define opacity and top styles, this will start the opacity animation and the top animation at the same time. */
export function animateParallel<Styles extends keyof ViewStyle>(
  styles: AnimationStyle<Styles>,
  config: AnimationConfiguration = { duration: 800 },
): ElementAnimation<Styles> {
  const { animations, values, compositions } = processStyles(styles, config);
  const trigger = Animated.parallel(compositions);

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reverse() {
    const reversedCompositions = values.map((_, index) => {
      const value = values[index];
      let composition = Animated.timing(value, {
        toValue: 0,
        duration: config.duration,
        useNativeDriver: !config.loop,
        easing: config.easing || Easing.inOut(Easing.quad),
      });

      return composition;
    });

    const reversedTrigger = Animated.parallel(reversedCompositions);
    reversedTrigger.start();
  }

  return {
    start,
    reverse,
    reset: trigger.reset,
    composition: trigger,
    animations,
  };
}

/** Stagger defined styles animations.
 * Example: if you define opacity and top styles, this will start the opacity animation and stagger the top animation by stagger amount. */
export function animateStagger<Styles extends keyof ViewStyle>(
  styles: AnimationStyle<Styles>,
  config: StaggerAnimationConfiguration = { duration: 800, stagger: 400 },
): ElementAnimation<Styles> {
  const { animations, values, compositions } = processStyles(styles, config);
  const trigger = Animated.stagger(config.stagger, compositions);

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reverse() {
    const reversedCompositions = values.map((_, index) => {
      const value = values[index];
      let composition = Animated.timing(value, {
        toValue: 0,
        duration: config.duration,
        useNativeDriver: !config.loop,
        easing: config.easing || Easing.inOut(Easing.quad),
      });

      return composition;
    });

    const reversedTrigger = Animated.stagger(
      config.stagger,
      reversedCompositions,
    );

    reversedTrigger.start();
  }

  return {
    start,
    reverse,
    reset: trigger.reset,
    composition: trigger,
    animations,
  };
}

/** This will animate the passed in styles in sequence.
 * Example: if you define opacity and top styles, this will start the opacity animation and then start the top animation when the opacity animation finishes. */
export function animateSequence<Styles extends keyof ViewStyle>(
  styles: AnimationStyle<Styles>,
  config: AnimationConfiguration = { duration: 800 },
): ElementAnimation<Styles> {
  const { animations, values, compositions } = processStyles(styles, config);
  const trigger = Animated.sequence(compositions);
  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reverse() {
    const reversedCompositions = values.map((_, index) => {
      const value = values[index];
      let composition = Animated.timing(value, {
        toValue: 0,
        duration: config.duration,
        useNativeDriver: !config.loop,
        easing: config.easing || Easing.inOut(Easing.quad),
      });

      return composition;
    });

    const reversedTrigger = Animated.sequence(reversedCompositions);
    reversedTrigger.start();
  }

  return {
    start,
    reverse,
    reset: trigger.reset,
    composition: trigger,
    animations,
  };
}

interface AnimationTimelineConfiguration<K extends keyof ViewStyle> {
  [ms: number]: ElementAnimation<K>[];
}

export function createAnimationTimeline<K extends keyof ViewStyle>(
  timeline: AnimationTimelineConfiguration<K>,
) {
  const times = Object.keys(timeline).map(ms => Number(ms));

  const compositions = times
    .map(ms => {
      const elements = timeline[ms];
      const trigger = Animated.parallel(elements.map(e => e.composition));
      if (!ms) return trigger;
      return Animated.sequence([Animated.delay(ms), trigger]);
    })
    .flat();

  return Animated.parallel(compositions);
}
