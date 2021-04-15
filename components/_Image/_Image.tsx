import React from 'react';
import { Image, ImageProps } from 'react-native';
import { getUsableStylesFromProps } from 'skeletor/helpers';

import { _Wrapper } from '../_Wrapper';

type Props = ImageProps & _ImageProps & _Spacing & _Alignment;

export const _Image: React.FC<Props> = ({
  height,
  width,
  radius,
  style,
  paddings,
  margins,
  align,
  justify,
  ...rest
}) => {
  return (
    <_Wrapper
      align={align || 'center'}
      justify={justify || 'center'}
      paddings={paddings}
      margins={margins}
      height={height}
      width={width}
      style={{ borderRadius: radius || 0 }}
    >
      <Image
        {...(rest as any)}
        style={[
          style,
          getUsableStylesFromProps({ borderRadius: radius, height, width }),
        ]}
      />
    </_Wrapper>
  );
};
