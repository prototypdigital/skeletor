import React from 'react';
import { Image, ImageProps } from 'react-native';
import { getUsableStylesFromProps } from '../../helpers';
import { $Wrapper } from '../$Wrapper';

type Props = ImageProps & $ImageProps & $Spacing & $Alignment;

export const $Image: ReactFC<Props> = ({
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
    <$Wrapper
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
    </$Wrapper>
  );
};
