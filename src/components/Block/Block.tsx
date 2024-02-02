import React, { PropsWithChildren, useMemo } from "react";
import {
  Animated,
  ScrollView,
  ScrollViewProps,
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
  background?: string;
  opacity?: ViewStyle["opacity"];
};

export type BlockScrollViewProps = SharedProps &
  ScrollViewProps & {
    scrollable: true;
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
    showsHorizontalScrollIndicator = false,
    showsVerticalScrollIndicator = false,
    bounces,
  } = props;

  return (
    <ScrollView
      horizontal={horizontal}
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      bounces={bounces}
      contentContainerStyle={[
        { flexGrow: 1, backgroundColor: rest.background },
      ]}
    >
      {element()}
    </ScrollView>
  );
};
