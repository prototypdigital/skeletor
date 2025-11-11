import type { ViewStyle } from "react-native";
import type {
	FourSideTuple,
	MarginStyles,
	MarginStylesBase,
	NonAnimatedDimensionValue,
	PaddingStyles,
	PaddingStylesBase,
} from "../models";

export function normalizePaddingValues(padding: PaddingStyles) {
	if (!padding) return undefined;
	if (typeof padding === "string" || typeof padding === "number")
		return { padding };

	if (Array.isArray(padding)) return extractFourSideTuplePadding(padding);
	return padding as ViewStyle;
}

export function normalizeMarginValues(margin: MarginStyles) {
	if (!margin) return undefined;
	if (typeof margin === "string" || typeof margin === "number")
		return { margin };

	if (Array.isArray(margin)) return extractFourSideTupleMargin(margin);
	return margin as ViewStyle;
}

function extractFourSideTuplePadding(
	values: FourSideTuple<NonAnimatedDimensionValue<ViewStyle["padding"]>>,
): PaddingStylesBase {
	switch (values.length) {
		case 1: {
			const [all] = values;
			return { padding: all };
		}
		case 2: {
			const [vertical, horizontal] = values;
			return { paddingVertical: vertical, paddingHorizontal: horizontal };
		}
		case 3: {
			const [top, horizontal, bottom] = values;
			return {
				paddingTop: top,
				paddingHorizontal: horizontal,
				paddingBottom: bottom,
			};
		}
		case 4: {
			const [top, right, bottom, left] = values;
			return {
				paddingTop: top,
				paddingRight: right,
				paddingBottom: bottom,
				paddingLeft: left,
			};
		}
		default:
			return {};
	}
}

function extractFourSideTupleMargin(
	values: FourSideTuple<NonAnimatedDimensionValue<ViewStyle["margin"]>>,
): MarginStylesBase {
	switch (values.length) {
		case 1: {
			const [all] = values;
			return { margin: all };
		}
		case 2: {
			const [vertical, horizontal] = values;
			return { marginVertical: vertical, marginHorizontal: horizontal };
		}
		case 3: {
			const [top, horizontal, bottom] = values;
			return {
				marginTop: top,
				marginHorizontal: horizontal,
				marginBottom: bottom,
			};
		}
		case 4: {
			const [top, right, bottom, left] = values;
			return {
				marginTop: top,
				marginRight: right,
				marginBottom: bottom,
				marginLeft: left,
			};
		}
		default:
			return {};
	}
}
