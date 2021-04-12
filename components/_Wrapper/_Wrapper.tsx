import React from 'react';
import { View, ViewProps } from 'react-native';

import { SpacingProps, AlignmentProps, SizeProps } from 'skeletor/models';
import { getUsableStylesFromProps } from 'skeletor/helpers';

interface OwnProps {
  background?: string;
}

type Props = OwnProps & AlignmentProps & SpacingProps & SizeProps & ViewProps;

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
