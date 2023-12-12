import React, { PropsWithChildren, useMemo } from "react";
import {
  Animated,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from "react-native";

import {
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
  extractPositionProperties,
  extractSizeProperties,
} from "../../utils";

interface SharedProps {
  background?: string;
}

export type BlockScrollViewProps = SharedProps &
  ScrollViewProps & {
    scrollable: true;
    horizontal?: boolean;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    bounces?: boolean;
    style?: StyleProp<ViewStyle>;
  };

export type BlockViewProps = SharedProps &
  ViewProps & {
    scrollable?: false | undefined;
  };

type BlockElementProps = SharedProps &
  ViewProps &
  Alignment &
  Spacing &
  Size &
  Border &
  Flex &
  Position &
  Animations;

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
    ...view
  } = props;

  const animationProps = useMemo(
    () => extractAnimationProperties(animations),
    [animations],
  );
  const flexProps = useMemo(() => extractFlexProperties(props), [props]);
  const sizeProps = useMemo(() => extractSizeProperties(props), [props]);
  const positionProps = useMemo(
    () => extractPositionProperties(props),
    [props],
  );
  const alignmentProps = useMemo(
    () => extractAlignmentProperties(props),
    [props],
  );

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          backgroundColor: background,
          overflow,
        },
        alignmentProps,
        margins,
        paddings,
        border,
        flexProps,
        sizeProps,
        positionProps,
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
      border,
    ],
  );

  return (
    <Animated.View {...view} style={[styles, animationProps]}>
      {children}
    </Animated.View>
  );
};

type BaseProps = Alignment &
  Spacing &
  Size &
  Border &
  Flex &
  Position &
  Animations;

export type BlockProps = (BlockViewProps | BlockScrollViewProps) & BaseProps;

export const Block: React.FC<PropsWithChildren<BlockProps>> = ({
  children,
  ...props
}) => {
  const { scrollable, ...rest } = props;
  const element = () => <BlockElement {...rest}>{children}</BlockElement>;

  if (!scrollable) {
    return element();
  }

  const {
    horizontal,
    showsHorizontalScrollIndicator,
    showsVerticalScrollIndicator,
    bounces,
  } = props;

  return (
    <ScrollView
      horizontal={horizontal}
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        { flexGrow: 1, backgroundColor: rest.background },
      ]}
      bounces={bounces}
    >
      {element()}
    </ScrollView>
  );
};
