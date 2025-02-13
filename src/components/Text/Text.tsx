import React, { useMemo, type PropsWithChildren } from "react";
import {
  Animated,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";

import { useSkeletor } from "../../hooks";
import type { Animations, Flex, Position, Size, Spacing } from "../../models";
import {
  extractAnimationProperties,
  extractFlexProperties,
  extractGapProperties,
  extractPositionProperties,
  extractSizeProperties,
} from "../../utils";

interface OwnProps extends RNTextProps {
  /** Create a Font.d.ts type in your typescript types directory and define fonts as follows:
   * @example type Font = "Helvetica" | "Montserrat" ...  */
  font?: Font;
  /** Either define [fontSize, lineHeight] or just one size applied to both fontSize and lineHeight */
  size?: [number, number] | number;
  textTransform?: TextStyle["textTransform"];
  letterSpacing?: TextStyle["letterSpacing"];
  color?: string;
  textAlign?: TextStyle["textAlign"];
  opacity?: TextStyle["opacity"];
}

export type TextProps = OwnProps &
  Spacing &
  Size &
  Flex &
  Position &
  Animations;

/** Create a Font.d.ts type in your typescript types directory and define fonts as follows:
 * @example type Font = "Helvetica" | "Montserrat" ...  */
export const Text: React.FC<PropsWithChildren<TextProps>> = ({
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
  animations,
  gap,
  allowFontScaling,
  maxFontSizeMultiplier,
  ...props
}) => {
  const skeletor = useSkeletor();
  const animationProps = useMemo(
    () => extractAnimationProperties(animations),
    [animations],
  );
  const positionProps = extractPositionProperties(props);
  const flexProps = extractFlexProperties(props);
  const sizeProps = extractSizeProperties(props);
  const gapProps = useMemo(() => extractGapProperties({ gap }), [gap]);

  const textSize = useMemo(() => {
    function mapper(value: [number, number] | number) {
      if (Array.isArray(value)) {
        const [fontSize, lineHeight] = value;
        return { fontSize, lineHeight };
      }
      return { fontSize: value, lineHeight: value };
    }

    return mapper(size || skeletor.defaultFontSize);
  }, [size, skeletor.defaultFontSize]);

  const styles = useMemo(
    () =>
      StyleSheet.flatten([
        {
          color: color || skeletor.defaultTextColor,
          fontFamily: font || skeletor.defaultFont,
          opacity,
          textAlign,
          textTransform,
          letterSpacing,
        },
        textSize,
        margins,
        paddings,
        sizeProps,
        flexProps,
        positionProps,
        gapProps,
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
      positionProps,
      sizeProps,
      flexProps,
      gapProps,
      skeletor.defaultTextColor,
      skeletor.defaultFont,
      letterSpacing,
    ],
  );

  return (
    <Animated.Text
      style={[styles, animationProps]}
      allowFontScaling={allowFontScaling || skeletor.allowFontScaling}
      maxFontSizeMultiplier={
        maxFontSizeMultiplier || skeletor.maxFontSizeMultiplier
      }
      {...props}
    >
      {children}
    </Animated.Text>
  );
};
