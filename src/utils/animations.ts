import {
  Animation,
  AnimationConfiguration,
  AnimationStyle,
  ElementAnimation,
  ElementStyle,
  StaggerAnimationConfiguration,
} from "models";
import { useEffect } from "react";
import { Animated, Easing } from "react-native";

function processStyles<Keys extends keyof ElementStyle>(
  styles: AnimationStyle<Keys>,
  config: AnimationConfiguration
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
    compositions,
    animations: animations as Animation<Keys>,
  };
}

export function delayAnimation<Styles extends keyof ElementStyle>(
  delay: number,
  next: ElementAnimation<Styles>
) {
  Animated.delay(delay).start(({ finished }) => {
    if (finished) next.start();
  });
}

/** Animate styles in parallel.
 * Example: if you define @param opacity and @param top styles, this will start the @param opacity animation and the @param top animation at the same time. */
export function animateParallel<Styles extends keyof ElementStyle>(
  styles: AnimationStyle<Styles>,
  config: AnimationConfiguration = { duration: 800 }
): ElementAnimation<Styles> {
  const { animations, compositions } = processStyles(styles, config);
  const trigger = Animated.parallel(compositions);

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) onFinished?.();
    });
  }

  return { ...trigger, start, animations };
}

/** Stagger defined styles animations.
 * Example: if you define @param opacity and @param top styles, this will start the @param opacity animation and stagger the @param top animation by @param stagger amount. */
export function animateStagger<Styles extends keyof ElementStyle>(
  styles: AnimationStyle<Styles>,
  config: StaggerAnimationConfiguration = { duration: 800, stagger: 400 }
): ElementAnimation<Styles> {
  const { animations, compositions } = processStyles(styles, config);
  const trigger = Animated.stagger(config.stagger, compositions);

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) onFinished?.();
    });
  }

  return { ...trigger, start, animations };
}

/** This will animate the passed in styles in sequence.
 * Example: if you define @param opacity and @param top styles, this will start the @param opacity animation and then start the @param top animation when the opacity animation finishes. */
export function animateSequence<Styles extends keyof ElementStyle>(
  styles: AnimationStyle<Styles>,
  config: AnimationConfiguration = { duration: 800 }
): ElementAnimation<Styles> {
  const { animations, compositions } = processStyles(styles, config);
  const trigger = Animated.sequence(compositions);
  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) onFinished?.();
    });
  }
  return { ...trigger, start, animations };
}
