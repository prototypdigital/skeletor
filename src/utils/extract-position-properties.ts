import type { ViewStyle } from "react-native";
import type { Position } from "../models";

type ReturnProps = {
	position: ViewStyle["position"];
	zIndex: ViewStyle["zIndex"];
	top: ViewStyle["top"];
	right: ViewStyle["right"];
	bottom: ViewStyle["bottom"];
	left: ViewStyle["left"];
};

export function extractPositionProperties<Props extends Position>(
	props: Props,
): ReturnProps {
	function getOffsetValue(from: "top" | "left" | "bottom" | "right") {
		const fromIndex = ["top", "left", "bottom", "right"].indexOf(from);

		if (Array.isArray(props.offsets)) {
			return props.offsets[fromIndex];
		} else {
			return props.offsets?.[from];
		}
	}

	return {
		position: props.absolute ? "absolute" : "relative",
		zIndex: props.zIndex,
		top: getOffsetValue("top"),
		right: getOffsetValue("right"),
		bottom: getOffsetValue("bottom"),
		left: getOffsetValue("left"),
	};
}
