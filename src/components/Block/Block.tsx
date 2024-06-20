import type React from "react";
import { useMemo, type PropsWithChildren } from "react";
import {
	Animated,
	ScrollView,
	StyleSheet,
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
	extractAlignmentProperties,
	extractAnimationProperties,
	extractFlexProperties,
	extractGapProperties,
	extractPositionProperties,
	extractSizeProperties,
} from "../../utils";

type SkeletorProps = Alignment &
	Spacing &
	Size &
	Border &
	Flex &
	Position &
	Animations;

type SharedProps = SkeletorProps & {
	background?: JSX.Element | string;
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

const BlockElement: React.FC<PropsWithChildren<BlockElementProps>> = ({
	children,
	...props
}) => {
	const {
		border,
		paddings,
		margins,
		background,
		style,
		overflow,
		animations,
		opacity,
		flex,
		gap,
		...view
	} = props;

	const animationProps = useMemo(
		() => extractAnimationProperties(animations),
		[animations],
	);
	const flexProps = useMemo(() => extractFlexProperties({ flex }), [flex]);
	const gapProps = useMemo(() => extractGapProperties({ gap }), [gap]);
	const sizeProps = extractSizeProperties(props);
	const positionProps = extractPositionProperties(props);
	const alignmentProps = extractAlignmentProperties(props);

	const styles = useMemo(
		() =>
			StyleSheet.flatten([
				{
					backgroundColor:
						typeof background === "string" ? background : undefined,
					overflow,
					opacity,
				},
				alignmentProps,
				margins,
				paddings,
				border,
				flexProps,
				sizeProps,
				positionProps,
				gapProps,
				style,
			]),
		[
			alignmentProps,
			sizeProps,
			background,
			style,
			overflow,
			margins,
			paddings,
			positionProps,
			flexProps,
			gapProps,
			border,
			opacity,
		],
	);

	return (
		<Animated.View {...view} style={[styles, animationProps]}>
			{children}
		</Animated.View>
	);
};

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
				{props.background && typeof props.background !== "string" && (
					<BlockElement
						absolute
						zIndex={-1}
						offsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
					>
						{props.background}
					</BlockElement>
				)}
				{children}
			</BlockElement>
		);
	}

	const { scrollProps, ...rest } = props;
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
						typeof rest.background === "string" ? rest.background : undefined,
				},
				contentContainerStyle,
			]}
			{...scrollProps}
		>
			<BlockElement {...rest}>
				{rest.background && typeof rest.background !== "string" && (
					<BlockElement
						absolute
						zIndex={-1}
						offsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
					>
						{rest.background}
					</BlockElement>
				)}
				{children}
			</BlockElement>
		</ScrollView>
	);
};
