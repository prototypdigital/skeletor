import { useRef } from "react";
import type {
	AnimatableStyleKeys,
	AnimationConfiguration,
	AnimationStyle,
	ElementAnimation,
} from "../models";
import { animateParallel } from "../utils";

export const useAnimateParallel = <Styles extends AnimatableStyleKeys>(
	styles: AnimationStyle<Styles>,
	config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateParallel(styles, config)).current;
};
