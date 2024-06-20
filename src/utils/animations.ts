import { Animated, Easing } from "react-native";

import type {
  Animation,
  AnimationConfiguration,
  AnimationStyle,
  CleanViewStyle,
  ElementAnimation,
  StaggerAnimationConfiguration,
} from "../models";

function processStyles<Keys extends keyof CleanViewStyle>(
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
    /** Explicitly cast as string | number array due to interpolation limits. This is safe because all entry values are extensions of string | number values, but with specific formatting like `${number}deg` */
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const definition = styles[key]! as string[] | number[];
    const animation = value.interpolate({
      inputRange: definition.map((_, i) => i),
      outputRange: definition,
    });

    let composition = Animated.timing(value, {
      toValue: definition.length - 1,
      duration,
      useNativeDriver: !loop && !!native,
      easing,
    });

    const reverseComposition = Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: !loop && !!native,
      easing,
    });

    if (loop) {
      composition = Animated.loop(composition);
    }

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

function getAnimationTriggers(
  forward: Animated.CompositeAnimation,
  backward: Animated.CompositeAnimation,
) {
  function start(onFinished?: () => void) {
    forward.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reverse(onFinished?: () => void) {
    backward.start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }

  function reset() {
    forward.reset();
  }

  return {
    /** Will start the animation and interpolate the value as defined in the animation style configuration object. */
    start,
    /** Should only be triggered when `start()` has already been called. This will interpolate the Animated.Value back to the initial value defined in the animation from whatever value it is currently at. If the current value is already the initial value, reverse does nothing. */
    reverse,
    /** Reset only resets the forward trigger (called with start()). Both triggers are attached to the same Animated.Value, so resetting the forward one resets the value to the true initial value defined in the animation. */
    reset,
  };
}

/** Animate styles in parallel.
 * Example: if you define opacity and top styles, this will start the opacity animation and the top animation at the same time. */
export function animateParallel<Styles extends keyof CleanViewStyle>(
  styles: AnimationStyle<Styles>,
  config?: AnimationConfiguration,
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config || {},
  );
  const trigger = Animated.parallel(compositions);
  const reverseTrigger = Animated.parallel(reverseCompositions);

  return {
    ...getAnimationTriggers(trigger, reverseTrigger),
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
export function animateStagger<Styles extends keyof CleanViewStyle>(
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

  return {
    ...getAnimationTriggers(trigger, reverseTrigger),
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
export function animateSequence<Styles extends keyof CleanViewStyle>(
  styles: AnimationStyle<Styles>,
  config?: AnimationConfiguration,
): ElementAnimation<Styles> {
  const { animations, reverseCompositions, compositions } = processStyles(
    styles,
    config || {},
  );
  const trigger = createSequenceComposition(compositions);
  const reverseTrigger = createSequenceComposition(reverseCompositions);

  return {
    ...getAnimationTriggers(trigger, reverseTrigger),
    forward: trigger,
    backward: reverseTrigger,
    animations,
  };
}

interface AnimationTimelineConfiguration {
  [ms: number]: ElementAnimation<keyof CleanViewStyle>[];
}

export function createAnimationTimeline(
  timeline: AnimationTimelineConfiguration,
) {
  const times = Object.keys(timeline).map((ms) => Number(ms));
  const lastTime = times[times.length - 1];
  const reverseTimes = times.reverse();

  const compositions: Animated.CompositeAnimation[] = [];
  const reverseCompositions: Animated.CompositeAnimation[] = [];

  for (const ms of times) {
    const elements = timeline[ms];
    const trigger = Animated.parallel(elements.map((e) => e.forward));
    compositions.push(
      !ms ? trigger : createSequenceComposition([Animated.delay(ms), trigger]),
    );
  }

  for (const ms of reverseTimes) {
    const delay = lastTime - ms;
    const elements = timeline[ms];
    const trigger = Animated.parallel(elements.map((e) => e.backward));
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
    reset: forward.reset,
  };
}
