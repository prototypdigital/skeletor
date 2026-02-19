import type React from "react";
import type { PropsWithChildren } from "react";
import {
	Animated,
	type ColorValue,
	ScrollView,
	type ScrollViewProps,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import type {
	Alignment,
	Animations,
	Border,
	Flex,
	Position,
	Size,
	Spacing,
} from "../../models";
import {
	extractAnimationProperties,
	extractSkeletorStyleProperties,
	isColorValue,
	memoizeStyle,
} from "../../utils";

type SkeletorProps = Alignment &
	Spacing &
	Size &
	Border &
	Flex &
	Position &
	Animations;

type SharedProps = SkeletorProps & {
	background?: React.ReactNode | ColorValue;
	opacity?: ViewStyle["opacity"];
};

export type BlockScrollViewProps = SharedProps &
	ViewProps & {
		scrollable: true;
		scrollProps?: ScrollViewProps;
	};

export type BlockViewProps = SharedProps &
	ViewProps & {
		scrollable?: false | undefined;
	};

export type BlockProps = BlockScrollViewProps | BlockViewProps;

type BlockElementProps = SharedProps & ViewProps;

const BACKGROUND_OFFSETS = { top: 0, bottom: 0, left: 0, right: 0 };

const BlockElement: React.FC<PropsWithChildren<BlockElementProps>> = ({
	children,
	background,
	opacity,
	...props
}) => {
	const { style, animations, ...rest } = props;
	const animationProps = extractAnimationProperties(animations);
	const skeletorStyle = extractSkeletorStyleProperties(rest);
	const elementStyle = memoizeStyle({
		backgroundColor: isColorValue(background) ? background : undefined,
		opacity,
	});

	return (
		<Animated.View
			{...rest}
			style={[skeletorStyle, elementStyle, style, animationProps]}
		>
			{children}
		</Animated.View>
	);
};

BlockElement.displayName = "BlockElement";

function isScrollable(props: BlockProps): props is BlockScrollViewProps {
	return !!props.scrollable;
}

/** Can be switched to a scrollable view by passing in `scrollable`. When scrollable, control ScrollView related parameters through `scrollProps`. Default values for `scrollProps` are:
 * @param keyboardShouldPersistTaps `handled`
 * @param showsVerticalScrollIndicator `false`
 * @param showsHorizontalScrollIndicator `false`
 * @param bounces `false`
 * @param contentContainerStyle `{ flexGrow: 1, backgroundColor: rest.background }` */
export const Block: React.FC<PropsWithChildren<BlockProps>> = ({
	children,
	...props
}) => {
	if (!isScrollable(props)) {
		return (
			<BlockElement {...props}>
				{!isColorValue(props.background) && (
					<BlockElement absolute zIndex={-1} offsets={BACKGROUND_OFFSETS}>
						{props.background}
					</BlockElement>
				)}
				{children}
			</BlockElement>
		);
	}

	const { scrollProps, background, ...rest } = props;
	const {
		horizontal,
		keyboardShouldPersistTaps = "handled",
		showsVerticalScrollIndicator = false,
		showsHorizontalScrollIndicator = false,
		bounces = false,
		contentContainerStyle,
	} = scrollProps || {};

	return (
		<ScrollView
			horizontal={horizontal}
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
			bounces={bounces}
			contentContainerStyle={[
				{
					flexGrow: 1,
					backgroundColor:
						typeof background === "string" ? background : undefined,
				},
				contentContainerStyle,
			]}
			{...scrollProps}
		>
			<BlockElement {...rest}>
				{background && !isColorValue(background) && (
					<BlockElement absolute zIndex={-1} offsets={BACKGROUND_OFFSETS}>
						{background}
					</BlockElement>
				)}
				{children}
			</BlockElement>
		</ScrollView>
	);
};
