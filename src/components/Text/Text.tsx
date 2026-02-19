import type React from "react";
import type { PropsWithChildren } from "react";
import {
	Animated,
	type TextProps as RNTextProps,
	type TextStyle,
} from "react-native";
import { useSkeletor } from "../../hooks";
import type { Animations, Flex, Position, Size, Spacing } from "../../models";
import {
	extractAnimationProperties,
	extractSkeletorStyleProperties,
	memoizeStyle,
} from "../../utils";

interface OwnProps extends RNTextProps {
	/** Create a Font.d.ts type in your typescript types directory and define fonts as follows:
	 * @example type Font = "Helvetica" | "Montserrat" ...  */
	font?: Font;
	/** Either define [fontSize, lineHeight] or just one size applied to both fontSize and lineHeight */
	size?: [number, number] | number;
	textTransform?: TextStyle["textTransform"];
	letterSpacing?: TextStyle["letterSpacing"];
	color?: string;
	textAlign?: TextStyle["textAlign"];
	opacity?: TextStyle["opacity"];
}

export type TextProps = OwnProps &
	Spacing &
	Size &
	Flex &
	Position &
	Animations;

/** Create a Font.d.ts type in your typescript types directory and define fonts as follows:
 * @example type Font = "Helvetica" | "Montserrat" ...  */
export const Text: React.FC<PropsWithChildren<TextProps>> = ({
	font,
	size,
	textTransform,
	letterSpacing,
	color,
	style,
	children,
	textAlign,
	opacity,
	animations,
	allowFontScaling,
	maxFontSizeMultiplier,
	...props
}) => {
	const skeletor = useSkeletor();
	const animationStyle = extractAnimationProperties(animations);

	const textSize = size ?? skeletor.defaultFontSize;
	const { fontSize, lineHeight } = Array.isArray(textSize)
		? { fontSize: textSize[0], lineHeight: textSize[1] }
		: { fontSize: textSize, lineHeight: textSize };

	const skeletorStyle = extractSkeletorStyleProperties(props);
	const elementStyle = memoizeStyle({
		color: color || skeletor.defaultTextColor,
		fontFamily: font || skeletor.defaultFont,
		fontSize,
		lineHeight,
		opacity,
		textAlign,
		textTransform,
		letterSpacing,
	});

	return (
		<Animated.Text
			style={[skeletorStyle, elementStyle, animationStyle]}
			allowFontScaling={allowFontScaling || skeletor.allowFontScaling}
			maxFontSizeMultiplier={
				maxFontSizeMultiplier || skeletor.defaultMaxFontSizeMultiplier
			}
			{...props}
		>
			{children}
		</Animated.Text>
	);
};
