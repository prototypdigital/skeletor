import React, { useMemo } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { useSkeletor } from "../../hooks";

interface TextProps extends RNTextProps {
  font?: Font;
  /** Either define [fontSize, lineHeight] or just one size applied to both fontSize and lineHeight */
  size?: [number, number] | number;
  textTransform?: TextStyle["textTransform"];
  color?: string;
  textAlign?: TextStyle["textAlign"];
  opacity?: TextStyle["opacity"];
}

type Props = TextProps & Spacing;

export const Text: ReactFC<Props> = ({
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

  const textSize = useMemo(() => {
    function mapper(value: [number, number] | number) {
      if (Array.isArray(value)) {
        const [fontSize, lineHeight] = value;
        return { fontSize, lineHeight };
      } else {
        return { fontSize: value, lineHeight: value };
      }
    }

    return mapper(size || defaultFontSize);
  }, [size, defaultFontSize]);

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          color,
          ...textSize,
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
    <RNText
      style={styles}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...props}
    >
      {children}
    </RNText>
  );
};
