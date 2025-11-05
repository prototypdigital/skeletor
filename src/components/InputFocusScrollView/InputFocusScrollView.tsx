import { useEffect, useMemo, useRef } from "react";
import {
	Dimensions,
	Keyboard,
	type NativeMethods,
	type NativeSyntheticEvent,
	Platform,
	ScrollView,
	type ScrollViewProps,
	StyleSheet,
	type TargetedEvent,
} from "react-native";

import type { Spacing } from "../../models";
import {
	extractGapProperties,
	normalizeMarginValues,
	normalizePaddingValues,
} from "../../utils";

export interface InputFocusScrollViewProps
	extends Omit<ScrollViewProps, "children">,
		Spacing {
	/** Percentage of screen to add to element position. Values between 0 and 1. Use this if you want to position the input focus somewhere other than the top of the screen. Defaults to 0.3 */
	focusPositionOffset?: number;
	offsetFromKeyboard?: number;
	height?: "full" | "auto";
	children: (
		onInputFocus: (e: NativeSyntheticEvent<TargetedEvent>) => void,
	) => React.ReactNode;
}

/**
 * This scroll view will automatically scroll to an active input field rendered within it, provided you attach the `onInputFocus` callback to the input onFocus prop.
 *
 * The return value is a lambda component, returning a callback which you attach to input fields rendered within it.
 * @example <InputFocusScrollView>{(onInputFocus) => <TextInput onFocus={onInputFocus} ... />}</InputFocusScrollView>
 * NOTE: This works on iOS only, Android does this by default with @param android:windowSoftInputMode
 *
 * Default props are:
 * @param height `full`
 * @param focusPositionOffset `0.3`
 * @param showsVerticalScrollIndicator `false`
 * @param showsHorizontalScrollIndicator `false`
 * @param bounces `false`
 * @param contentContainerStyle `{flexGrow: 1, paddingBottom: 30}`
 */
export const InputFocusScrollView: React.FC<InputFocusScrollViewProps> = ({
	children,
	style,
	contentContainerStyle,
	height = "full",
	focusPositionOffset = 0.3,
	margins,
	paddings,
	gap,
	showsVerticalScrollIndicator = false,
	showsHorizontalScrollIndicator = false,
	bounces = false,
	...rest
}) => {
	const ref = useRef<ScrollView>(null);
	const scrollTarget = useRef<NativeMethods>(null);

	const elementOffset = useRef(0);
	const contentHeight = useRef(0);
	/** Cached scroll position to keep focus on input if layout shifts. */
	const scrollPosition = useRef(0);
	const focusOffset = useRef(0);

	function onInputFocus(e: NativeSyntheticEvent<TargetedEvent>) {
		if (Platform.OS !== "ios" || !scrollTarget.current) {
			return;
		}

		e.currentTarget.measureLayout(
			scrollTarget.current,
			(_nope, top, _nuuh, elementHeight) => {
				focusOffset.current =
					focusPositionOffset !== undefined
						? Dimensions.get("screen").height * focusPositionOffset
						: 0;
				// bottom of element
				elementOffset.current = top + elementHeight;
				const scrollY = elementOffset.current - focusOffset.current;
				scrollPosition.current = scrollY;
				ref.current?.scrollTo({ y: scrollY });
			},
			() => console.error("failed to measure layout"),
		);
	}

	useEffect(() => {
		const listener = Keyboard.addListener("keyboardWillHide", () => {
			const keyboardHeight = Keyboard.metrics()?.height || 0;
			if (scrollPosition.current < 0) ref.current?.scrollTo({ y: 0 });
			else {
				const leftoverSpace = contentHeight.current - elementOffset.current;
				// If we haven't reached scroll view overflow yet, do nothing
				if (leftoverSpace < keyboardHeight) ref.current?.scrollToEnd();
			}
		});

		return listener.remove;
	}, []);

	const gapProps = useMemo(() => extractGapProperties({ gap }), [gap]);
	const normalizedMargins = useMemo(
		() => normalizeMarginValues(margins),
		[margins],
	);
	const normalizedPaddings = useMemo(
		() => normalizePaddingValues(paddings),
		[paddings],
	);

	const containerStyles = StyleSheet.flatten([
		styles[height],
		normalizedMargins,
		style,
	]);

	const contentStyles = StyleSheet.flatten([
		styles.content,
		normalizedPaddings,
		gapProps,
		contentContainerStyle,
	]);

	return (
		<ScrollView
			ref={ref}
			scrollToOverflowEnabled
			scrollEventThrottle={33}
			onLayout={({ currentTarget }) => {
				scrollTarget.current = currentTarget;
			}}
			onContentSizeChange={(_, height) => {
				contentHeight.current = height;
			}}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
			showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
			bounces={bounces}
			style={containerStyles}
			contentContainerStyle={contentStyles}
			{...rest}
		>
			{children(onInputFocus)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	full: { height: "100%" },
	auto: { height: "auto" },
	content: { flexGrow: 1 },
});
