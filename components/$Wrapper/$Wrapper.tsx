import React from 'react';
import { View, ViewProps } from 'react-native';
import { getUsableStylesFromProps } from '../../helpers';

type Props = $WrapperProps & $Alignment & $Spacing & $Size & ViewProps;

export const $Wrapper: ReactFC<Props> = ({
  children,
  margins,
  paddings,
  align,
  justify,
  flex,
  maxHeight,
  maxWidth,
  height,
  width,
  minHeight,
  minWidth,
  style,
  background,
  ...rest
}) => {
  return (
    <View
      style={[
        getUsableStylesFromProps({
          ...margins,
          ...paddings,
          alignItems: align,
          justifyContent: justify,
          backgroundColor: background,
          flex,
          maxHeight,
          maxWidth,
          minHeight,
          minWidth,
          height,
          width,
        }),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
