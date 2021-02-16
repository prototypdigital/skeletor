import React from 'react';
import { Text, TextProps } from 'react-native';
import {
  TextAlignStyles,
  TextSizeStyles,
  TextTransformStyles,
} from 'skeletor/config';
import { DefaultFont, FontFamily } from 'skeletor/const';

import { getUsableStylesFromProps } from 'skeletor/helpers';
import { SpacingProps } from 'skeletor/models';

interface OwnProps extends TextProps {
  size?: keyof typeof TextSizeStyles;
  font?: FontFamily;
  textTransform?: keyof typeof TextTransformStyles;
  color?: string;
  align?: keyof typeof TextAlignStyles;
  opacity?: number;
}

type Props = OwnProps & SpacingProps;

export const _Text: React.FC<Props> = ({
  size,
  font = DefaultFont,
  textTransform,
  color,
  style,
  children,
  align,
  margins,
  paddings,
  opacity,
  ...rest
}) => (
  <Text
    style={[
      size && TextSizeStyles[size],
      textTransform && TextTransformStyles[textTransform],
      align && TextAlignStyles[align],
      getUsableStylesFromProps({
        color,
        opacity,
        margins,
        paddings,
        fontFamily: font,
      }),
      style,
    ]}
    allowFontScaling={false}
    maxFontSizeMultiplier={1}
    {...rest}
  >
    {children}
  </Text>
);
