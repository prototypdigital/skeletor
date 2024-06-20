import type { DimensionValue } from "react-native/types";

export interface Size {
	width?: DimensionValue;
	height?: DimensionValue;
	minHeight?: DimensionValue;
	minWidth?: DimensionValue;
	maxHeight?: DimensionValue;
	maxWidth?: DimensionValue;
}
