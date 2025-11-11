import { useRef } from "react";
import type { CleanViewStyle, ElementAnimation } from "../models";
import { loopAnimation } from "../utils";

export const useLoopAnimation = <Styles extends keyof CleanViewStyle>(
	animation: ElementAnimation<Styles>,
) => {
	return useRef(loopAnimation(animation)).current;
};
