import { useRef } from "react";
import type { AnimationTimelineConfiguration } from "../models";
import { createAnimationTimeline } from "../utils";

export const useAnimationTimeline = (
	timeline: AnimationTimelineConfiguration,
) => {
	return useRef(createAnimationTimeline(timeline)).current;
};
