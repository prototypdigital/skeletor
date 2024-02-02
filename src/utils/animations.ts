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
  {
    duration = 400,
    easing = Easing.inOut(Easing.ease),
    loop = false,
    native = true,
  }: AnimationConfiguration,
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
      duration,
      useNativeDriver: !loop && native,
      easing,
    });

    if (loop) {
      composition = Animated.loop(composition);
    }

    const reverseComposition = Animated.timing(value, {
      toValue: 0,
      duration: duration,
      useNativeDriver: !loop && !!native,
      easing,
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
  config?: AnimationConfiguration,
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config || {},
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

  function reverse(onFinished?: () => void) {
    reverseTrigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reset() {
    trigger.reset();
    reverseTrigger.reset();
  }

  return {
    start,
    reverse,
    reset,
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
  config: StaggerAnimationConfiguration,
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config || {},
  );
  const trigger = createStaggerComposition(compositions, config.stagger || 200);
  const reverseTrigger = createStaggerComposition(
    reverseCompositions,
    config.stagger || 200,
  );

  function start(onFinished?: () => void) {
    trigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reverse(onFinished?: () => void) {
    reverseTrigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reset() {
    trigger.reset();
    reverseTrigger.reset();
  }

  return {
    start,
    reverse,
    reset,
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
  config?: AnimationConfiguration,
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config || {},
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

  function reverse(onFinished?: () => void) {
    reverseTrigger.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reset() {
    trigger.reset();
    reverseTrigger.reset();
  }

  return {
    start,
    reverse,
    reset,
    forward: trigger,
    backward: reverseTrigger,
    animations,
  };
}

interface AnimationTimelineConfiguration {
  [ms: number]: ElementAnimation<any>[];
}

export function createAnimationTimeline(
  timeline: AnimationTimelineConfiguration,
) {
  const times = Object.keys(timeline).map(ms => Number(ms));
  const lastTime = times[times.length - 1];
  const reverseTimes = times.reverse();

  let compositions: Animated.CompositeAnimation[] = [];
  let reverseCompositions: Animated.CompositeAnimation[] = [];

  for (const ms of times) {
    const elements = timeline[ms];
    const trigger = Animated.parallel(elements.map(e => e.forward));
    compositions.push(
      !ms ? trigger : createSequenceComposition([Animated.delay(ms), trigger]),
    );
  }

  for (const ms of reverseTimes) {
    const delay = lastTime - ms;
    const elements = timeline[ms];
    const trigger = Animated.parallel(elements.map(e => e.backward));
    reverseCompositions.push(
      !delay
        ? trigger
        : createSequenceComposition([Animated.delay(delay), trigger]),
    );
  }

  const forward = Animated.parallel(compositions.flat());
  const backward = Animated.parallel(reverseCompositions.flat());

  return {
    start: forward.start,
    reverse: backward.start,
    reset: () => {
      forward.reset();
      backward.reset();
    },
  };
}
