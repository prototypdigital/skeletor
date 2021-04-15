import React from 'react';
import { ActivityIndicator, Pressable, PressableProps } from 'react-native';
import { getUsableStylesFromProps } from 'skeletor/helpers';
import { useSkeletor } from 'skeletor/hooks';

import { _Text } from '../_Text';
import { _Wrapper } from '../_Wrapper';

type Props = _ButtonProps & _Spacing & _Size & _Alignment & PressableProps;

export const _Button: React.FC<Props> = ({
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  paddings,
  margins,
  disabled,
  textProps,
  align,
  justify,
  alignSelf,
  leftItem,
  rightItem,
  title,
  color,
  style,
  loading,
  ...rest
}) => {
  const { _Button: styles } = useSkeletor();

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color={color || styles.loadingColor}
        style={getUsableStylesFromProps({
          flex: 1,
          height: height || styles.height,
          width: width || styles.minWidth,
          alignSelf: 'center',
        })}
      />
    );
  }

  return (
    <_Wrapper
      margins={margins || styles.margins}
      alignSelf={alignSelf}
      width={width}
      height={height || styles.height}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      minHeight={minHeight}
      minWidth={minWidth || styles.minWidth}
      style={{ opacity: disabled ? styles.disabledOpacity : 1 }}
    >
      <Pressable
        hitSlop={5}
        disabled={disabled}
        style={
          typeof style === 'function'
            ? style
            : ({ pressed }) => [
                pressed
                  ? [styles.baseStyle, styles.pressedStyle]
                  : styles.baseStyle,
                getUsableStylesFromProps({
                  ...(paddings || styles.paddings),
                  backgroundColor: color,
                }),
                style,
              ]
        }
        {...rest}
      >
        {leftItem}

        <_Wrapper align="center">
          {typeof title === 'string' ? (
            <_Text {...(textProps || styles.textStyle)}>{title}</_Text>
          ) : (
            title
          )}
        </_Wrapper>

        {rightItem}
      </Pressable>
    </_Wrapper>
  );
};
