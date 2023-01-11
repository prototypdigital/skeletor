import React, { useRef, useState } from "react";
import {
  Platform,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TextInputFocusEventData,
  Dimensions,
} from "react-native";
import { extractSpacingProperties } from "skeletor/utils";

interface Props extends Omit<ScrollViewProps, "children">, Spacing {
  /** Percentage of screen to add to element position. Values between 0 and 1. Use this if you want to position the input focus somewhere other than the top of the screen. Defaults to 0.3 */
  focusPositionOffset?: number;
  height?: "full" | "auto";
  children: (
    onInputFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
  ) => React.ReactNode;
}

/**
 * This scroll view will automatically scroll to an active input field rendered within it, provided you attach the onInputFocus callback to the input onFocus prop.
 *
 * The return value is a lambda component, returning a callback which you attach to input fields rendered within it.
 * @example <InputFocusScrollView>{(onInputFocus) => <TextInput onFocus={onInputFocus} ... />}</InputFocusScrollView>
 * NOTE: This works on iOS only, Android does this by default with @param android:windowSoftInputMode
 */
export const InputFocusScrollView: React.FC<Props> = ({
  children,
  style,
  contentContainerStyle,
  height = "full",
  focusPositionOffset = 0.3,
  ...rest
}) => {
  const screenHeight = useRef(Dimensions.get("screen").height).current;
  const { margins, paddings } = extractSpacingProperties(rest);
  const ref = useRef<ScrollView>(null);
  const [scrollTarget, setScrollTarget] = useState<number | null>();

  function onInputFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (Platform.OS !== "ios" || !scrollTarget) return;
    e.currentTarget.measureLayout(
      scrollTarget,
      (nope, top, nuuh, height) => {
        let scrollY = top - height;
        if (focusPositionOffset)
          scrollY = scrollY - screenHeight * focusPositionOffset;

        ref.current?.scrollTo({ y: scrollY });
      },
      () => console.error("failed to measure layout"),
    );
  }

  function onScrollViewLayout(e: LayoutChangeEvent) {
    if (Platform.OS !== "ios") return;
    setScrollTarget(e.nativeEvent.target);
  }

  const containerStyles = StyleSheet.flatten([styles[height], margins, style]);

  const contentStyles = StyleSheet.flatten([
    styles.content,
    { ...paddings },
    contentContainerStyle,
  ]);

  return (
    <ScrollView
      ref={ref}
      scrollEventThrottle={16}
      onLayout={onScrollViewLayout}
      scrollToOverflowEnabled
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={containerStyles}
      contentContainerStyle={contentStyles}
      {...rest}
    >
      {children(onInputFocus)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  full: { flex: 1 },
  auto: { flex: 0 },
  content: {
    paddingBottom: 30,
  },
});