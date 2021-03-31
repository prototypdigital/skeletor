import React from 'react';
import { SkeletorDefaults } from 'skeletor/config';
import { SkeletorConfig } from 'skeletor/models';
import { _SkeletorContext } from './_SkeletorContext';

export const SkeletorProvider: React.FC<Partial<SkeletorConfig>> = ({
  children,
  ...config
}) => {
  return (
    <_SkeletorContext.Provider value={{ ...SkeletorDefaults, ...config }}>
      {children}
    </_SkeletorContext.Provider>
  );
};
