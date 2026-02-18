import { useRef } from "react";
import type { AnimatableStyleKeys, ElementAnimation } from "../models";
import { loopAnimation } from "../utils";

export const useLoopAnimation = <Styles extends AnimatableStyleKeys>(
	animation: ElementAnimation<Styles>,
) => {
	return useRef(loopAnimation(animation)).current;
};
