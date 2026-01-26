import type { ColorValue } from "react-native";

/**
 * Checks if a value is a valid React Native color.
 * Supports:
 * - strings (hex, color names)
 * - numbers (RN numeric colors)
 * - PlatformColor objects
 * - DynamicColorIOS objects
 */
export const isColorValue = (value: unknown): value is ColorValue => {
	if (typeof value === "string" || typeof value === "number") {
		return true;
	}

	if (typeof value === "object" && value !== null) {
		// PlatformColor (iOS/Android system colors)
		if ("__PlatformColor__" in value) return true;

		// DynamicColorIOS (iOS dynamic colors)
		if ("__DynamicColor__" in value) return true;
	}

	return false;
};
