import React, { useMemo } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Alignment, Border, Size, Spacing } from "../../models";
import { extractAlignmentProperties, extractSizeProperties } from "../../utils";

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

type BlockElementProps = SharedProps & Alignment & Spacing & Size & Border;

const BlockElement: ReactFC<BlockElementProps> = ({ children, ...props }) => {
  const { border, paddings, margins, background, style, overflow, ...view } =
    props;

  const size = extractSizeProperties(props);
  const {
    align: alignItems,
    justify: justifyContent,
    ...alignment
  } = extractAlignmentProperties(props);

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          ...margins,
          ...paddings,
          ...alignment,
          ...size,
          ...border,
          alignItems,
          justifyContent,
          backgroundColor: background,
          overflow,
        },
        style,
      ]),
    [alignment, size, background, style, overflow, margins, paddings],
  );

  return (
    <View {...view} style={styles}>
      {children}
    </View>
  );
};

type BaseProps = Alignment & Spacing & Size & Border;
export type BlockProps = (BlockViewProps | BlockScrollViewProps) & BaseProps;

export const Block: ReactFC<BlockProps> = ({ children, ...props }) => {
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
      contentContainerStyle={{ flexGrow: 1, backgroundColor: rest.background }}
      bounces={bounces}
    >
      {element()}
    </ScrollView>
  );
};
