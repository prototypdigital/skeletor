import React from 'react';
import { Text, TextProps } from 'react-native';
import { getUsableStylesFromProps } from 'skeletor/helpers';
import { useSkeletor } from 'skeletor/hooks';
import { SpacingProps } from 'skeletor/models';

interface OwnProps extends TextProps {
  size?: { fontSize: number; lineHeight: number };
  font?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  color?: string;
  textAlign?: 'left' | 'right' | 'center';
  opacity?: number;
}

type Props = OwnProps & SpacingProps;

export const _Text: React.FC<Props> = ({
  size,
  font,
  textTransform,
  color,
  style,
  children,
  textAlign,
  margins,
  paddings,
  opacity,
  ...rest
}) => {
  const skeletor = useSkeletor();
  return (
    <Text
      style={[
        getUsableStylesFromProps({
          color: color || skeletor.defaultColor,
          fontFamily: font || skeletor.defaultFont,
          opacity,
          textAlign,
          textTransform,
          ...(size || skeletor.textSizes[skeletor.defaultTextSize]),
          ...margins,
          ...paddings,
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
};
