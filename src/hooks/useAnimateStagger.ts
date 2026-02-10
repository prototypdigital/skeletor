import { useRef } from "react";
import type {
	AnimationViewStyle,
	ElementAnimation,
	StaggerAnimationConfiguration,
	ViewAnimation,
} from "../models";
import { animateStagger } from "../utils";

export const useAnimateStagger = <Styles extends keyof AnimationViewStyle>(
	styles: ViewAnimation<Styles>,
	config: StaggerAnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateStagger(styles, config)).current;
};
