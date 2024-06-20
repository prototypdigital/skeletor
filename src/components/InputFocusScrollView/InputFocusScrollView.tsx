import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  type TextInput,
  type TextInputFocusEventData,
} from "react-native";

import type { Spacing } from "../../models";
import { extractGapProperties } from "../../utils";

export interface InputFocusScrollViewProps
  extends Omit<ScrollViewProps, "children">,
    Spacing {
  /** Percentage of screen to add to element position. Values between 0 and 1. Use this if you want to position the input focus somewhere other than the top of the screen. Defaults to 0.3 */
  focusPositionOffset?: number;
  height?: "full" | "auto";
  children: (
    onInputFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
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
  const screenHeight = useRef(Dimensions.get("screen").height).current;
  const ref = useRef<ScrollView>(null);
  /** Cached scroll position to keep focus on input if layout shifts. */
  const [scrollPosition, setScrollPosition] = useState<number | null>(null);
  const [scrollTarget, setScrollTarget] = useState<number | null>(null);

  function onInputFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (Platform.OS !== "ios" || !scrollTarget) {
      return;
    }

    (e.currentTarget as unknown as TextInput).measureLayout(
      scrollTarget,
      (nope, top, nuuh, elementHeight) => {
        let scrollY = top - elementHeight;
        if (focusPositionOffset !== undefined) {
          scrollY = scrollY - screenHeight * focusPositionOffset;
        }

        // Cache scroll position for layout shift cases
        setScrollPosition(scrollY);
        // Scroll to input position
        ref.current?.scrollTo({ y: scrollY });
      },
      () => console.error("failed to measure layout"),
    );
  }

  /** Handle layout shifts by programmatically scrolling to the same input position without animation. */
  function onContentSizeChange() {
    if (Platform.OS !== "ios" || !scrollPosition) {
      return;
    }
    ref.current?.scrollTo({ y: scrollPosition, animated: false });
    setScrollPosition(null);
  }

  const gapProps = useMemo(() => extractGapProperties({ gap }), [gap]);
  const containerStyles = StyleSheet.flatten([styles[height], margins, style]);

  const contentStyles = StyleSheet.flatten([
    styles.content,
    paddings,
    gapProps,
    contentContainerStyle,
  ]);

  return (
    <ScrollView
      ref={ref}
      scrollToOverflowEnabled
      scrollEventThrottle={33}
      onLayout={(e) => setScrollTarget(e.currentTarget)}
      onContentSizeChange={onContentSizeChange}
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
  content: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});
