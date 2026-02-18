import { useRef } from "react";
import type {
	AnimatableStyleKeys,
	AnimationStyle,
	ElementAnimation,
	StaggerAnimationConfiguration,
} from "../models";
import { animateStagger } from "../utils";

export const useAnimateStagger = <Styles extends AnimatableStyleKeys>(
	styles: AnimationStyle<Styles>,
	config: StaggerAnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateStagger(styles, config)).current;
};
