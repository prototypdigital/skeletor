import React, { PropsWithChildren, useMemo } from "react";
import {
  Animated,
  StyleSheet,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

import { useSkeletor } from "../../hooks";
import { Animations, Flex, Position, Size, Spacing } from "../../models";
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
  ...props
}) => {
  const { defaultFont, defaultFontSize, defaultTextColor } = useSkeletor();
  const animationProps = useMemo(
    () => extractAnimationProperties(animations),
    [animations],
  );
  const positionProps = useMemo(
    () => extractPositionProperties(props),
    [props],
  );
  const flexProps = useMemo(() => extractFlexProperties(props), [props]);
  const sizeProps = useMemo(() => extractSizeProperties(props), [props]);
  const gapProps = useMemo(() => extractGapProperties({ gap }), [gap]);

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
          fontFamily: font || defaultFont,
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
      defaultTextColor,
      defaultFont,
      letterSpacing,
    ],
  );

  return (
    <Animated.Text
      style={[styles, animationProps]}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...props}
    >
      {children}
    </Animated.Text>
  );
};
