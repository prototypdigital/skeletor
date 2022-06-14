import React from 'react';
import { Text, TextProps } from 'react-native';
import { getUsableStylesFromProps } from 'skeletor/helpers';
import { useSkeletor } from 'skeletor/hooks';

type Props = $TextProps & TextProps & $Spacing;

export const $Text: React.FC<Props> = ({
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
  const { $Text: styles, general } = useSkeletor();
  return (
    <Text
      style={[
        getUsableStylesFromProps({
          color: color || styles.defaultColor,
          fontFamily: font || general.defaultFont,
          opacity,
          textAlign,
          textTransform,
          ...(size
            ? typeof size === 'string'
              ? styles.sizes?.[size]
              : size
            : typeof styles.defaultSize === 'string'
            ? styles.sizes?.[styles.defaultSize]
            : styles.defaultSize),
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
