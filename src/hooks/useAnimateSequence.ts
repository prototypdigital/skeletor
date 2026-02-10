import { useRef } from "react";
import type {
	AnimatableStyleKeys,
	AnimationConfiguration,
	AnimationStyle,
	ElementAnimation,
} from "../models";
import { animateSequence } from "../utils";

export const useAnimateSequence = <Styles extends AnimatableStyleKeys>(
	styles: AnimationStyle<Styles>,
	config?: AnimationConfiguration,
): ElementAnimation<Styles> => {
	return useRef(animateSequence(styles, config)).current;
};
