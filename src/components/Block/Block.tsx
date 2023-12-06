import React, { PropsWithChildren, useMemo } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  Animated,
} from "react-native";
import { Alignment, Border, Flex, Position, Size, Spacing } from "../../models";
import {
  extractAlignmentProperties,
  extractFlexProperties,
  extractPositionProperties,
  extractSizeProperties,
} from "../../utils";

interface SharedProps extends ViewProps {
  background?: string;
  overflow?: ViewStyle["overflow"];
}

interface BlockScrollViewProps extends SharedProps {
  scrollable: true;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  bounces?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface BlockViewProps extends SharedProps {
  scrollable?: false | undefined;
}

type BlockElementProps = SharedProps &
  Alignment &
  Spacing &
  Size &
  Border &
  Flex &
  Position;

const BlockElement: React.FC<PropsWithChildren<BlockElementProps>> = ({
  children,
  ...props
}) => {
  const { border, paddings, margins, background, style, overflow, ...view } =
    props;

  const flexProps = useMemo(() => extractFlexProperties(props), [props]);
  const sizeProps = useMemo(() => extractSizeProperties(props), [props]);
  const positionProps = useMemo(
    () => extractPositionProperties(props),
    [props]
  );
  const {
    align: alignItems,
    justify: justifyContent,
    alignSelf,
  } = useMemo(() => extractAlignmentProperties(props), [props]);

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          ...margins,
          ...paddings,
          ...border,
          ...flexProps,
          ...sizeProps,
          ...positionProps,
          alignSelf,
          alignItems,
          justifyContent,
          backgroundColor: background,
          overflow,
        },
        style,
      ]),
    [
      alignItems,
      alignSelf,
      justifyContent,
      sizeProps,
      background,
      style,
      overflow,
      margins,
      paddings,
      positionProps,
      flexProps,
    ]
  );

  return (
    <Animated.View {...view} style={styles}>
      {children}
    </Animated.View>
  );
};

type BaseProps = Alignment & Spacing & Size & Border & Flex & Position;
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
    <Animated.ScrollView
      horizontal={horizontal}
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: rest.background }}
      bounces={bounces}
    >
      {element()}
    </Animated.ScrollView>
  );
};
