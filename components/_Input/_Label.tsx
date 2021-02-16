import React from 'react';
import { Color } from 'skeletor/const';
import { _Text } from '..';

type Colors = {
  focused?: string;
  default: string;
  errored?: string;
};

interface Props {
  status?: keyof Colors;
  colors?: Colors;
}

export const _Label: React.FC<Props> = ({
  status = 'default',
  colors = {
    default: Color.Text,
    focused: Color.Primary,
    errored: Color.Danger,
  },
  children,
}) => {
  return (
    <_Text size="tny" color={colors[status]}>
      {children}
    </_Text>
  );
};
