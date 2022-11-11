import { useEffect, useState } from "react";
import { Animated, ViewStyle } from "react-native";
import { AnimationSet } from "./useAnimation";

interface BaseTimelineType<Keys extends keyof Partial<ViewStyle>> {
  elements: AnimationSet<Keys>[];
  start: boolean;
  onFinished?: () => void;
  onStarted?: () => void;
}

type DelayTimeline<Keys extends keyof Partial<ViewStyle>> =
  BaseTimelineType<Keys> & { delay: number };
type StaggerTimeline<Keys extends keyof Partial<ViewStyle>> =
  BaseTimelineType<Keys> & { stagger: number };

interface TimelineConfiguration<Keys extends keyof Partial<ViewStyle>> {
  delay?: DelayTimeline<Keys>;
  parallel?: BaseTimelineType<Keys>;
  sequence?: BaseTimelineType<Keys>;
  stagger?: StaggerTimeline<Keys>;
}

/** Used to layout animated values on a timeline and handle starting/reversing the animations. 
 * Supports all Animated types (delay, stagger, parallel, sequence).
 * @example
 * useAnimTimeline({
    stagger: { elements: [ring1, ring2, ring3], stagger: 900, start: show },
    sequence: { elements: [button], start: Boolean(show && !disabled) },
  });
*/
export function useAnimTimeline<Keys extends keyof Partial<ViewStyle>>(
  config: TimelineConfiguration<Keys>,
): void {
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
    timeline:
      | BaseTimelineType<Keys>
      | StaggerTimeline<Keys>
      | DelayTimeline<Keys>,
  ) {
    const compositions: Animated.CompositeAnimation[] = [];
    timeline.elements.forEach(
      ({ values, animations, configuration, definitions }, index) => {
        const keys = Object.keys(animations).map((key) => key as Keys);
        keys.forEach((key, index) => {
          const value = values[index];
          const lastValue = definitions[key]!.length - 1;
          const base = Animated.timing(value, {
            toValue: timeline.start ? lastValue : 0,
            duration: configuration.duration,
            useNativeDriver: !configuration.loop,
          });

          compositions.push(configuration.loop ? Animated.loop(base) : base);
        });
      },
    );

    return compositions;
  }

  function setupParallelAnimations(timeline: BaseTimelineType<Keys>) {
    if (timeline.onStarted) {
      timeline.onStarted();
    }
    Animated.parallel(getBaseAnimations(timeline)).start(timeline.onFinished);
  }

  function setupSequenceAnimations(timeline: BaseTimelineType<Keys>) {
    if (timeline.onStarted) {
      timeline.onStarted();
    }
    Animated.sequence(getBaseAnimations(timeline)).start(timeline.onFinished);
  }

  function setupStaggerAnimations(timeline: StaggerTimeline<Keys>) {
    if (timeline.onStarted) {
      timeline.onStarted();
    }
    Animated.stagger(timeline.stagger, getBaseAnimations(timeline)).start(
      timeline.onFinished,
    );
  }

  function setupDelayAnimations(timeline: DelayTimeline<Keys>) {
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
