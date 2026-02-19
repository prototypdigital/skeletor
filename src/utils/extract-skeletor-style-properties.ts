import type { ViewStyle } from "react-native";
import type {
	Alignment,
	Border,
	Flex,
	Position,
	Size,
	Spacing,
} from "../models";
import { extractAlignmentProperties } from "./extract-alignment-properties";
import { extractFlexProperties } from "./extract-flex-properties";
import { extractGapProperties } from "./extract-gap-properties";
import { extractPositionProperties } from "./extract-position-properties";
import { extractSizeProperties } from "./extract-size-properties";
import { memoizeStyle } from "./memoize-styles";
import {
	normalizeMarginValues,
	normalizePaddingValues,
} from "./normalize-spacing-values";

type SkeletorStyleProperties = Alignment &
	Position &
	Size &
	Border &
	Flex &
	Spacing;

export function extractSkeletorStyleProperties<
	T extends SkeletorStyleProperties,
>(props: T): Partial<ViewStyle> {
	const border = props.border || {};
	const margins = normalizeMarginValues(props.margins) || {};
	const paddings = normalizePaddingValues(props.paddings) || {};
	const size = extractSizeProperties(props);
	const alignment = extractAlignmentProperties(props);
	const position = extractPositionProperties(props);
	const flex = props.flex ? extractFlexProperties({ flex: props.flex }) : {};
	const gap = props.gap ? extractGapProperties({ gap: props.gap }) : {};

	return memoizeStyle({
		...border,
		...margins,
		...paddings,
		...flex,
		...gap,
		...size,
		...alignment,
		...position,
	});
}
