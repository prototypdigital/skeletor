import type { ViewStyle } from "react-native";
import type { Alignment } from "../models";

type ReturnProps = {
	alignItems?: ViewStyle["alignItems"];
	alignSelf?: ViewStyle["alignSelf"];
	justifyContent?: ViewStyle["justifyContent"];
	flexDirection?: ViewStyle["flexDirection"];
};

export function extractAlignmentProperties<Props extends Alignment>(
	props: Props,
): ReturnProps {
	return {
		alignItems: props.align,
		alignSelf: props.alignSelf,
		justifyContent: props.justify,
		flexDirection: props.flexDirection,
	};
}
