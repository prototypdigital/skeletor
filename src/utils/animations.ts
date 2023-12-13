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
  const reverseCompositions: Animated.CompositeAnimation[] = [];
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

    const reverseComposition = Animated.timing(value, {
      toValue: 0,
      duration: config.duration,
      useNativeDriver: !config.loop,
      easing: config.easing || Easing.inOut(Easing.quad),
    });

    animations[key] = animation;
    compositions.push(composition);
    reverseCompositions.push(reverseComposition);
  });

  return {
    values,
    compositions,
    reverseCompositions: reverseCompositions.reverse(),
    animations: animations as Animation<Keys>,
  };
}

/** Animate styles in parallel.
 * Example: if you define opacity and top styles, this will start the opacity animation and the top animation at the same time. */
export function animateParallel<Styles extends keyof ViewStyle>(
  styles: AnimationStyle<Styles>,
  config: AnimationConfiguration = { duration: 800 },
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config,
  );
  const trigger = Animated.parallel(compositions);
  const reverseTrigger = Animated.parallel(reverseCompositions);

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  return {
    start,
    reverse: reverseTrigger.start,
    reset: trigger.reset,
    forward: trigger,
    backward: reverseTrigger,
    animations,
  };
}

function createStaggerComposition(
  compositions: Animated.CompositeAnimation[],
  stagger: number,
): Animated.CompositeAnimation {
  return {
    start: (callback?: Animated.EndCallback) => {
      Animated.parallel(
        compositions.map((c, i) => {
          return createSequenceComposition([Animated.delay(stagger * i), c]);
        }),
      ).start(callback);
    },
    stop: () => {
      for (const composition of compositions) composition.stop();
    },
    reset: () => {
      for (const composition of compositions) composition.reset();
    },
  };
}

/** Stagger defined styles animations.
 * Example: if you define opacity and top styles, this will start the opacity animation and stagger the top animation by stagger amount. */
export function animateStagger<Styles extends keyof ViewStyle>(
  styles: AnimationStyle<Styles>,
  config: StaggerAnimationConfiguration = { duration: 800, stagger: 400 },
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config,
  );
  const trigger = createStaggerComposition(compositions, config.stagger);
  const reverseTrigger = createStaggerComposition(
    reverseCompositions,
    config.stagger,
  );

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  return {
    start,
    reverse: reverseTrigger.start,
    reset: trigger.reset,
    forward: trigger,
    backward: reverseTrigger,
    animations,
  };
}

function createSequenceComposition(
  compositions: Animated.CompositeAnimation[],
): Animated.CompositeAnimation {
  return {
    start: (callback?: Animated.EndCallback) => {
      function startComposition(index: number) {
        const composition = compositions[index];
        composition.start(({ finished }) => {
          if (finished) {
            const nextIndex = index + 1;
            if (nextIndex < compositions.length) {
              startComposition(nextIndex);
            } else {
              callback?.({ finished: true });
            }
          }
        });
      }

      startComposition(0);
    },
    stop: () => {
      for (const composition of compositions) composition.stop();
    },
    reset: () => {
      for (const composition of compositions) composition.reset();
    },
  };
}

/** This will animate the passed in styles in sequence.
 * Example: if you define opacity and top styles, this will start the opacity animation and then start the top animation when the opacity animation finishes. */
export function animateSequence<Styles extends keyof ViewStyle>(
  styles: AnimationStyle<Styles>,
  config: AnimationConfiguration = { duration: 800 },
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config,
  );
  const trigger = createSequenceComposition(compositions);
  const reverseTrigger = createSequenceComposition(reverseCompositions);

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  return {
    start,
    reverse: reverseTrigger.start,
    reset: trigger.reset,
    forward: trigger,
    backward: reverseTrigger,
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
      const trigger = Animated.parallel(elements.map(e => e.forward));
      if (!ms) return trigger;
      return createSequenceComposition([Animated.delay(ms), trigger]);
    })
    .flat();

  let lastTime = times[times.length - 1];
  const reverseCompositions = times.reverse().map(ms => {
    const delay = lastTime - ms;
    const elements = timeline[ms];
    const trigger = Animated.parallel(elements.map(e => e.backward));
    if (!delay) return trigger;
    return createSequenceComposition([Animated.delay(delay), trigger]);
  });

  const forward = Animated.parallel(compositions);
  const backward = Animated.parallel(reverseCompositions);

  return {
    start: forward.start,
    reverse: backward.start,
    reset: forward.reset,
  };
}
