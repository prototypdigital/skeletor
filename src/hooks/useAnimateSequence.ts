import type {
	AnimationConfiguration,
	AnimationStyle,
	CleanViewStyle,
	ElementAnimation,
} from "models";
import { useRef } from "react";
import { animateSequence } from "utils";

export const useAnimateSequence = <Styles extends keyof CleanViewStyle>(
	styles: AnimationStyle<Styles>,
	config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateSequence(styles, config)).current;
};
