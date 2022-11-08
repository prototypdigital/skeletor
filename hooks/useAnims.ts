import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export type AnimType =
  | "fadeIn"
  | "slideIn"
  | "fadeOut"
  | number[]
  | string[]
  | { inputRange: number[] | string[]; outputRange: number[] | string[] };

function getAnimationOutputRange(type: AnimType): number[] {
  switch (type) {
    case "fadeIn":
      return [0, 1];

    case "fadeOut":
      return [1, 0];

    case "slideIn":
      return [20, 0];

    default:
      return type as [];
  }
}

export interface AnimConfiguration {
  anims: AnimType[];
  config?: { duration: number; loop?: boolean; useNativeDriver?: boolean };
}

export class AnimConfiguration {
  constructor(animation: AnimConfiguration) {
    this.anims = animation.anims;
    this.config = animation.config;
  }
}

interface AnimationSet {
  ref: Animated.Value;
  animations: {
    config: { duration: number; loop?: boolean; useNativeDriver?: boolean };
    items: Animated.AnimatedInterpolation<string | number>[];
  };
}

class AnimationSet {
  constructor(
    ref: Animated.Value,
    animations: {
      config: { duration: number; loop?: boolean; useNativeDriver?: boolean };
      items: Animated.AnimatedInterpolation<string | number>[];
    },
  ) {
    this.ref = ref;
    this.animations = animations;
  }
}

interface BaseTimelineType {
  set: AnimationSet[];
  start: boolean;
  onFinished?: () => void;
  onStarted?: () => void;
}

type DelayTimeline = BaseTimelineType & { delay: number };
type StaggerTimeline = BaseTimelineType & { stagger: number };

interface TimelineConfiguration {
  delay?: DelayTimeline;
  parallel?: BaseTimelineType;
  sequence?: BaseTimelineType;
  stagger?: StaggerTimeline;
}

function createAnimation(animations: AnimType[], ref: Animated.Value) {
  const processedAnimations = animations.map((type) => {
    const isDefinedAsObject =
      typeof type === "object" &&
      !Array.isArray(type) &&
      type.inputRange &&
      type.outputRange;

    if (isDefinedAsObject) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ref.interpolate(type as any);
    }

    return ref.interpolate({
      inputRange: [0, 1],
      outputRange: getAnimationOutputRange(type),
    });
  });

  return processedAnimations;
}

/** Hook used to get animations and animation value objects for use with useAnimTimeline hook and animated components. 
 * Does not handle starting or stopping animations, use the useAnimTimeline hook for that. * 
 * @example
 * const { container, wrapper, content } = useAnims({
    container: { anims: ['fadeIn'] },
    wrapper: { anims: ['fadeIn'] },
    content: { anims: ['fadeIn'] },
  });
  ...
  useAnimTimeline({
    sequence: { set: [container, wrapper, content], start: true },
  });
  ...
  <Animated.View style={{opacity: content.animations.items[0]}} />
 */
export function useAnims<T>(definition: {
  [K in keyof T]: AnimConfiguration;
}): { [K in keyof T]: AnimationSet } {
  const refs = useRef(
    Object.keys(definition).map(() => new Animated.Value(0)),
  ).current;
  const anims = Object.keys(definition).map(
    (key) => definition[key as keyof T].anims,
  );

  const animations = anims.map((anim, index) =>
    createAnimation(anim, refs[index]),
  );

  const set: Partial<{ [K in keyof T]: AnimationSet }> = {};

  Object.keys(definition).map((key, index) => {
    const ref = refs[index];
    const animation = definition[key as keyof T];
    const { duration = 500, loop = false } = animation.config || {};

    set[key as keyof T] = {
      animations: { items: animations[index], config: { duration, loop } },
      ref,
    };
  });

  return set as { [K in keyof T]: AnimationSet };
}

function getBaseAnimations(
  timeline: BaseTimelineType | StaggerTimeline | DelayTimeline,
) {
  const animationSets = timeline.set.map((s) => s.animations);
  const references = timeline.set.map((s) => s.ref);
  const configurations = animationSets.map((s) => s.config);

  return references.map((ref, index) => {
    const config = configurations[index];
    const useNativeDriver =
      config.useNativeDriver === undefined ? true : config.useNativeDriver;

    const base = Animated.timing(ref, {
      toValue: timeline.start ? 1 : 0,
      duration: config.duration,
      useNativeDriver: config.loop ? false : useNativeDriver,
    });

    if (config.loop) {
      return Animated.loop(base);
    }

    return base;
  });
}

async function setupParallelAnimations(timeline: BaseTimelineType) {
  if (timeline.onStarted) {
    timeline.onStarted();
  }
  Animated.parallel(getBaseAnimations(timeline)).start(timeline.onFinished);
}

async function setupSequenceAnimations(timeline: BaseTimelineType) {
  if (timeline.onStarted) {
    timeline.onStarted();
  }
  Animated.sequence(getBaseAnimations(timeline)).start(timeline.onFinished);
}

async function setupStaggerAnimations(timeline: StaggerTimeline) {
  if (timeline.onStarted) {
    timeline.onStarted();
  }
  Animated.stagger(timeline.stagger, getBaseAnimations(timeline)).start(
    timeline.onFinished,
  );
}

async function setupDelayAnimations(timeline: DelayTimeline) {
  Animated.delay(timeline.delay).start(() => setupParallelAnimations(timeline));
}

/** Used to layout animated values on a timeline and handle starting/reversing the animations. 
 * Supports all Animated types (delay, stagger, parallel, sequence).
 * @example
 * useAnimTimeline({
    stagger: { set: [ring1, ring2, ring3], stagger: 900, start: show },
    sequence: { set: [button], start: Boolean(show && !disabled) },
  });
*/
export function useAnimTimeline(config: TimelineConfiguration): void {
  const { delay, parallel, sequence, stagger } = config;
  const staggerStart = Boolean(stagger?.start);
  const delayStart = Boolean(delay?.start);
  const sequenceStart = Boolean(sequence?.start);
  const parallelStart = Boolean(parallel?.start);

  const [previousDelayStart, setPreviousDelayStart] = useState(false);
  const [previousStaggerStart, setPreviousStaggerStart] = useState(false);
  const [previousSequenceStart, setPreviousSequenceStart] = useState(false);
  const [previousParallelStart, setPreviousParallelStart] = useState(false);

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
