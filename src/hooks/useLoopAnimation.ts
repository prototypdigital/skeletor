import { useRef } from "react";
import type { AnimationViewStyle, ElementAnimation } from "../models";
import { loopAnimation } from "../utils";

export const useLoopAnimation = <Styles extends keyof AnimationViewStyle>(
	animation: ElementAnimation<Styles>,
) => {
	return useRef(loopAnimation(animation)).current;
};
