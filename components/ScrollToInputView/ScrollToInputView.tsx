import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TextInputFocusEventData,
} from "react-native";

interface Props extends Omit<ScrollViewProps, "children"> {
  children: (
    onInputFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
  ) => React.ReactNode;
}

export const ScrollToInputView: React.FC<Props> = ({ children, ...rest }) => {
  const ref = useRef<ScrollView>(null);

  const onInputFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    e.target.measureInWindow((x, y) => {
      const scrollY = y - 100;
      ref.current?.scrollTo({ y: scrollY });
    });
  };

  return (
    <ScrollView
      ref={ref}
      scrollToOverflowEnabled
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      {...rest}
    >
      {children(onInputFocus)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    paddingVertical: 600,
  },
});
