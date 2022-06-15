import React from 'react';
import { ActivityIndicator, Pressable, PressableProps } from 'react-native';
import { getUsableStylesFromProps } from 'skeletor/helpers';
import { useSkeletor } from 'skeletor/hooks';
import { $Text } from '../$Text';
import { $Wrapper } from '../$Wrapper';

type Props = $ButtonProps & $Spacing & $Size & $Alignment & PressableProps;

export const $Button: React.FC<Props> = ({
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
  const { $Button: styles } = useSkeletor();

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
    <$Wrapper
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

        <$Wrapper align="center">
          {typeof title === 'string' ? (
            <$Text {...(textProps || styles.textStyle)}>{title}</$Text>
          ) : (
            title
          )}
        </$Wrapper>

        {rightItem}
      </Pressable>
    </$Wrapper>
  );
};
