import { useEffect, useState } from "react";
import { Animated, ViewStyle } from "react-native";

import { AnimationLegacy } from "./useAnimation";

interface BaseTimelineType {
  elements: AnimationLegacy<any>[];
  start: boolean;
  onFinished?: () => void;
  onStarted?: () => void;
}

type DelayTimeline = BaseTimelineType & {
  delay: number;
};
type StaggerTimeline = BaseTimelineType & {
  stagger: number;
};

interface TimelineConfiguration {
  delay?: DelayTimeline;
  parallel?: BaseTimelineType;
  sequence?: BaseTimelineType;
  stagger?: StaggerTimeline;
}

/** Used to layout animated values on a timeline and handle starting/reversing the animations.
 * Supports all Animated types (delay, stagger, parallel, sequence).
 * @example
 * useAnimationTimeline({
    stagger: { elements: [ring1, ring2, ring3], stagger: 900, start: show },
    sequence: { elements: [button], start: Boolean(show && !disabled) },
  });
*/
export function useAnimationTimeline(config: TimelineConfiguration): void {
  const { delay, parallel, sequence, stagger } = config;
  const staggerStart = Boolean(stagger?.start);
  const delayStart = Boolean(delay?.start);
  const sequenceStart = Boolean(sequence?.start);
  const parallelStart = Boolean(parallel?.start);

  const [previousDelayStart, setPreviousDelayStart] = useState(false);
  const [previousStaggerStart, setPreviousStaggerStart] = useState(false);
  const [previousSequenceStart, setPreviousSequenceStart] = useState(false);
  const [previousParallelStart, setPreviousParallelStart] = useState(false);

  function getBaseAnimations(
    timeline: BaseTimelineType | StaggerTimeline | DelayTimeline,
  ) {
    const compositions: Animated.CompositeAnimation[] = [];
    timeline.elements.forEach(
      ({ values, animations, configuration, definitions }) => {
        const keys = Object.keys(animations).map(
          key => key as keyof Partial<ViewStyle>,
        );

        const elementCompositions = keys.map((key, index) => {
          const value = values[index];
          const lastValue = definitions[key]!.length - 1;
          const nativeAnimation = configuration.loop
            ? false
            : configuration.useNativeDriver || false;

          const base = Animated.timing(value, {
            toValue: timeline.start ? lastValue : 0,
            duration: configuration.duration,
            useNativeDriver: nativeAnimation,
          });

          return configuration.loop ? Animated.loop(base) : base;
        });

        compositions.push(Animated.parallel(elementCompositions));
      },
    );

    return compositions;
  }

  function setupParallelAnimations(timeline: BaseTimelineType) {
    if (timeline.onStarted) {
      timeline.onStarted();
    }
    Animated.parallel(getBaseAnimations(timeline)).start(timeline.onFinished);
  }

  function setupSequenceAnimations(timeline: BaseTimelineType) {
    if (timeline.onStarted) {
      timeline.onStarted();
    }
    Animated.sequence(getBaseAnimations(timeline)).start(timeline.onFinished);
  }

  function setupStaggerAnimations(timeline: StaggerTimeline) {
    if (timeline.onStarted) {
      timeline.onStarted();
    }
    Animated.stagger(timeline.stagger, getBaseAnimations(timeline)).start(
      timeline.onFinished,
    );
  }

  function setupDelayAnimations(timeline: DelayTimeline) {
    Animated.delay(timeline.delay).start(() =>
      setupParallelAnimations(timeline),
    );
  }

  useEffect(() => {
    if (stagger && previousStaggerStart !== staggerStart) {
      setupStaggerAnimations(stagger);
    }

    setPreviousStaggerStart(staggerStart);
  }, [previousStaggerStart, staggerStart, stagger]);

  useEffect(() => {
    if (parallel && previousParallelStart !== parallelStart) {
      setupParallelAnimations(parallel);
    }

    setPreviousParallelStart(parallelStart);
  }, [previousParallelStart, parallelStart, parallel]);

  useEffect(() => {
    if (sequence && previousSequenceStart !== sequenceStart) {
      setupSequenceAnimations(sequence);
    }

    setPreviousSequenceStart(sequenceStart);
  }, [previousSequenceStart, sequenceStart, sequence]);

  useEffect(() => {
    if (delay && previousDelayStart !== delayStart) {
      setupDelayAnimations(delay);
    }

    setPreviousDelayStart(delayStart);
  }, [previousDelayStart, delayStart, delay]);
}
