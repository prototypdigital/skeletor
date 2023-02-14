import React, { useMemo } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { Size, Spacing } from "../../models";
import { extractSizeProperties } from "../../utils";
import { useSkeletor } from "../../hooks";

interface OwnProps extends RNTextProps {
  font?: Font;
  /** Either define [fontSize, lineHeight] or just one size applied to both fontSize and lineHeight */
  size?: [number, number] | number;
  textTransform?: TextStyle["textTransform"];
  letterSpacing?: TextStyle["letterSpacing"];
  color?: string;
  textAlign?: TextStyle["textAlign"];
  opacity?: TextStyle["opacity"];
}

export type TextProps = OwnProps & Spacing & Size;

export const Text: ReactFC<TextProps> = ({
  font,
  size,
  textTransform,
  letterSpacing,
  color,
  style,
  children,
  textAlign,
  opacity,
  margins,
  paddings,
  ...props
}) => {
  const { defaultFont, defaultFontSize, defaultTextColor } = useSkeletor();
  const sizeProps = extractSizeProperties(props);

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
          color: color || defaultTextColor,
          ...textSize,
          fontFamily: font || defaultFont,
          opacity,
          textAlign,
          textTransform,
          letterSpacing,
          ...margins,
          ...paddings,
          ...sizeProps,
        },
        style,
      ]),
    [
      color,
      font,
      opacity,
      textAlign,
      textTransform,
      textSize,
      margins,
      paddings,
      style,
    ],
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
