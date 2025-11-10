import type {
	AnimationConfiguration,
	AnimationStyle,
	CleanViewStyle,
	ElementAnimation,
} from "models";
import { useRef } from "react";
import { animateParallel } from "utils";

export const useAnimateParallel = <Styles extends keyof CleanViewStyle>(
	styles: AnimationStyle<Styles>,
	config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateParallel(styles, config)).current;
};
