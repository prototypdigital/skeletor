import { type ColorValue, DynamicColorIOS, PlatformColor } from "react-native";

export const isColorValue = (
	value: React.ReactNode | ColorValue,
): value is ColorValue => {
	if (typeof value === "string" || typeof value === "number") return true;
	if (value instanceof PlatformColor || value instanceof DynamicColorIOS) {
		return true;
	}

	return false;
};
