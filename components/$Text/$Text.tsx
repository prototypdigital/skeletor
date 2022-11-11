import React, { useMemo } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { useSkeletor } from "../../hooks";

interface $TextProps extends TextProps {
  font?: $Font;
  /** [fontSize, lineHeight?] */
  size?: [number, number] | number;
  textTransform?: TextStyle["textTransform"];
  color?: string;
  textAlign?: TextStyle["textAlign"];
  opacity?: TextStyle["opacity"];
}

type Props = $TextProps & $Spacing;

export const $Text: ReactFC<Props> = ({
  font,
  size,
  textTransform,
  color,
  style,
  children,
  textAlign,
  opacity,
  margins,
  paddings,
  ...props
}) => {
  const { defaultFont, defaultFontSize } = useSkeletor();

  const getSize = useMemo(() => {
    if (Array.isArray(size)) {
      const [fontSize, lineHeight] = size;
      return { fontSize, lineHeight };
    }

    return {
      fontSize: size || defaultFontSize,
      lineHeight: size || defaultFontSize,
    };
  }, [size, defaultFontSize]);

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          color,
          ...getSize,
          fontFamily: font || defaultFont,
          opacity,
          textAlign,
          textTransform,
          ...margins,
          ...paddings,
        },
        style,
      ]),
    [color, font, opacity, textAlign, textTransform, margins, paddings, style],
  );

  return (
    <Text
      style={styles}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...props}
    >
      {children}
    </Text>
  );
};
