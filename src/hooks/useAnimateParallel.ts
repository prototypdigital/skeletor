import { useRef } from "react";
import type {
	AnimationConfiguration,
	AnimationViewStyle,
	ElementAnimation,
	ViewAnimation,
} from "../models";
import { animateParallel } from "../utils";

export const useAnimateParallel = <Styles extends keyof AnimationViewStyle>(
	styles: ViewAnimation<Styles>,
	config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateParallel(styles, config)).current;
};
