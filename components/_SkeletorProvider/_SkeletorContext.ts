import React from 'react';
import { SkeletorDefaults } from 'skeletor/config';
import { SkeletorConfig } from 'skeletor/models';

export const _SkeletorContext = React.createContext<SkeletorConfig>(
  SkeletorDefaults,
);
