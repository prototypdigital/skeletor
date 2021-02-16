import React from 'react';
import { View, ViewProps } from 'react-native';

import { SpacingProps, AlignmentProps, SizeProps } from 'skeletor/models';
import { getUsableStylesFromProps } from 'skeletor/helpers';

type Props = AlignmentProps & SpacingProps & SizeProps & ViewProps;

export const _Wrapper: React.FC<Props> = ({
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
  ...rest
}) => {
  const parsedStyle = getUsableStylesFromProps({
    ...margins,
    ...paddings,
    alignItems: align,
    justifyContent: justify,
    flex,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    height,
    width,
    style,
  });

  return (
    <View style={parsedStyle} {...rest}>
      {children}
    </View>
  );
};
