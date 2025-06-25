import type { DimensionValue } from "react-native";

export interface Size {
	width?: DimensionValue;
	height?: DimensionValue;
	minHeight?: DimensionValue;
	minWidth?: DimensionValue;
	maxHeight?: DimensionValue;
	maxWidth?: DimensionValue;
}
