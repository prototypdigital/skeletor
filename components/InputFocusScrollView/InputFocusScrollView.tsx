import React, { useRef, useState } from "react";
import {
  Platform,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TextInputFocusEventData,
  Text,
} from "react-native";
import { extractSpacingProperties } from "skeletor/utils";
import { Block } from "../Block";

interface Props extends Omit<ScrollViewProps, "children">, Spacing {
  /** To how much of a point offset will the scroll view be scrolled to on input focus. Play around with this if you want to position the focused input differently. */
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
  focusPositionOffset = 275,
  ...rest
}) => {
  const { margins, paddings } = extractSpacingProperties(rest);
  const ref = useRef<ScrollView>(null);
  const [scrollTarget, setScrollTarget] = useState<number | null>();

  function onInputFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (Platform.OS !== "ios" || !scrollTarget) return;
    e.target.measureLayout(
      scrollTarget,
      (nope, top, nuuh, height) => {
        const scrollY = top - height - (focusPositionOffset || 0);
        ref.current?.scrollTo({ y: scrollY < 0 ? 0 : scrollY });
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
      <Block flex={1}>{children(onInputFocus)}</Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  full: { flex: 1 },
  auto: { flex: 0 },
});
