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
} from "react-native";
import { extractSpacingProperties } from "skeletor/utils";

interface Props extends Omit<ScrollViewProps, "children">, Spacing {
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
  ...rest
}) => {
  const { margins, paddings } = extractSpacingProperties(rest);
  const ref = useRef<ScrollView>(null);
  /** ScrollView Y offset (where the ScrollView begins) */
  const [layoutOffset, setLayoutOffset] = useState(0);
  /** Height of the scroll view */
  const [scrollHeight, setScrollHeight] = useState(0);
  /** Current scroll position */
  const [scrollPosition, setScrollPosition] = useState(0);

  function onInputFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (Platform.OS !== "ios") return;
    e.target.measure((nope, nuuh, nada, dont, stillno, py) => {
      // Anything below 60% of the screen needs to be scrolled to
      const scrollToCutoffPoint = scrollHeight * 0.6;

      // Target position's total offset is current page offset + scroll position (page offset tracks viewport, not layout) - layout offset;
      const targetPosition = py - layoutOffset + scrollPosition;

      // If target position is in the bottom 40% of the screen, scroll to it.
      if (targetPosition >= scrollToCutoffPoint) {
        ref.current?.scrollTo({ y: targetPosition - scrollToCutoffPoint });
      }
    });
  }

  function onScrollViewLayout(e: LayoutChangeEvent) {
    if (Platform.OS !== "ios") return;
    setScrollHeight(e.nativeEvent.layout.height);
    e.currentTarget.measureInWindow((x, y) => setLayoutOffset(y));
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (Platform.OS !== "ios") return;
    setScrollPosition(e.nativeEvent.contentOffset.y);
  }

  const containerStyles = StyleSheet.flatten([
    styles.container,
    margins,
    style,
  ]);
  const contentStyles = StyleSheet.create({
    contentContainer: { ...paddings },
  });

  return (
    <ScrollView
      ref={ref}
      scrollEventThrottle={16}
      onLayout={onScrollViewLayout}
      onScroll={onScroll}
      scrollToOverflowEnabled
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={containerStyles}
      contentContainerStyle={[
        contentStyles.contentContainer,
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children(onInputFocus)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
