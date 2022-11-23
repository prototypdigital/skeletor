import React, { useMemo } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import {
  extractAlignmentProperties,
  extractBorderProperties,
  extractSizeProperties,
  extractSpacingProperties,
} from "../../utils";

interface SharedProps extends ViewProps {
  background?: string;
}

interface BlockScrollViewProps extends SharedProps {
  scrollable: true;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  bounces?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface BlockViewProps extends SharedProps {
  scrollable?: false | undefined;
}

interface BlockElementProps extends SharedProps {
  alignment: Alignment;
  spacing: Spacing;
  size: Size;
  border: Border;
}

const BlockElement: ReactFC<BlockElementProps> = ({ children, ...props }) => {
  const { alignment, spacing, size, background, style, ...view } = props;
  const { align: alignItems, justify: justifyContent, ...align } = alignment;
  const { margins, paddings } = spacing;

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          ...margins,
          ...paddings,
          ...align,
          ...size,
          alignItems,
          justifyContent,
          backgroundColor: background,
        },
        style,
      ]),
    [spacing, alignment, size, background, style],
  );

  return (
    <View {...view} style={styles}>
      {children}
    </View>
  );
};

type BaseProps = Alignment & Spacing & Size & Border;
type Props = (BlockViewProps | BlockScrollViewProps) & BaseProps;

export const Block: ReactFC<Props> = ({ children, ...props }) => {
  const { scrollable, background, style, ...rest } = props;
  const alignment = extractAlignmentProperties(props);
  const size = extractSizeProperties(props);
  const spacing = extractSpacingProperties(props);
  const border = extractBorderProperties(props);

  const element = () => (
    <BlockElement
      background={background}
      style={style}
      alignment={alignment}
      spacing={spacing}
      border={border}
      size={size}
    >
      {children}
    </BlockElement>
  );

  if (!scrollable) return element();

  const {
    horizontal,
    showsHorizontalScrollIndicator,
    showsVerticalScrollIndicator,
    bounces,
  } = props;

  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: background }}
      bounces={bounces}
    >
      {element()}
    </ScrollView>
  );
};
