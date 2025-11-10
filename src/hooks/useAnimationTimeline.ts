import type { AnimationTimelineConfiguration } from "models";
import { useRef } from "react";
import { createAnimationTimeline } from "utils";

export const useAnimationTimeline = (
	timeline: AnimationTimelineConfiguration,
) => {
	return useRef(createAnimationTimeline(timeline)).current;
};
