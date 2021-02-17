import React from 'react';
import { Spacing } from 'skeletor/const';

import { _Text } from '..';

interface Props {
  color: string;
}

export const _Error: React.FC<Props> = ({ color, children }) => {
  if (!children) {
    return null;
  }

  return (
    <_Text color={color} size="tny" margins={{ marginTop: Spacing.Sml }}>
      {children}
    </_Text>
  );
};
