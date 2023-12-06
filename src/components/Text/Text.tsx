import React, { PropsWithChildren, useMemo } from "react";
import {
  StyleSheet,
  TextProps as RNTextProps,
  TextStyle,
  Animated,
} from "react-native";
import { Flex, Position, Size, Spacing } from "../../models";
import {
  extractFlexProperties,
  extractPositionProperties,
  extractSizeProperties,
} from "../../utils";
import { useSkeletor } from "../../hooks";

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

export type TextProps = OwnProps & Spacing & Size & Flex & Position;

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
  ...props
}) => {
  const { defaultFont, defaultFontSize, defaultTextColor } = useSkeletor();
  const positionProps = useMemo(
    () => extractPositionProperties(props),
    [props]
  );
  const flexProps = useMemo(() => extractFlexProperties(props), [props]);
  const sizeProps = useMemo(() => extractSizeProperties(props), [props]);

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
          ...flexProps,
          ...positionProps,
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
      positionProps,
      sizeProps,
      flexProps,
    ]
  );

  return (
    <Animated.Text
      style={styles}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...props}
    >
      {children}
    </Animated.Text>
  );
};
