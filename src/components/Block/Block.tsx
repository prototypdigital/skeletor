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
    return <BlockElement {...props}>{children}</BlockElement>;
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
        { flexGrow: 1, backgroundColor: rest.background },
        contentContainerStyle,
      ]}
      {...scrollProps}
    >
      <BlockElement {...rest}>{children}</BlockElement>
    </ScrollView>
  );
};
