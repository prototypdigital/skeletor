import { useRef } from "react";
import type {
	AnimationConfiguration,
	AnimationViewStyle,
	ElementAnimation,
	ViewAnimation,
} from "../models";
import { animateSequence } from "../utils";

export const useAnimateSequence = <Styles extends keyof AnimationViewStyle>(
	styles: ViewAnimation<Styles>,
	config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateSequence(styles, config)).current;
};
