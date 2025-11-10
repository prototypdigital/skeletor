import type {
	AnimationStyle,
	CleanViewStyle,
	ElementAnimation,
	StaggerAnimationConfiguration,
} from "models";
import { useRef } from "react";
import { animateStagger } from "utils";

export const useAnimateStagger = <Styles extends keyof CleanViewStyle>(
	styles: AnimationStyle<Styles>,
	config: StaggerAnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateStagger(styles, config)).current;
};
