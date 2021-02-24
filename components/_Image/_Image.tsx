import React from 'react';
import { Image, ImageProps } from 'react-native';
import { getUsableStylesFromProps } from 'skeletor/helpers';
import { AlignmentProps, SpacingProps } from 'skeletor/models';

import { _Wrapper } from '../_Wrapper';

interface OwnProps extends ImageProps {
  radius?: number;
  height: number | undefined;
  width: number | undefined;
}

type Props = OwnProps & SpacingProps & AlignmentProps;

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
