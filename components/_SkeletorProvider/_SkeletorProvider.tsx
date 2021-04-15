import React from 'react';
import { SkeletorDefaults } from 'skeletor/config';
import { SkeletorConfig } from 'skeletor/models';
import { _SkeletorContext } from './_SkeletorContext';

export const SkeletorProvider: React.FC<Partial<SkeletorConfig>> = ({
  children,
  ...config
}) => {
  return (
    <_SkeletorContext.Provider
      value={{
        general: { ...SkeletorDefaults.general, ...config.general },
        _Text: { ...SkeletorDefaults._Text, ...config._Text },
        _Button: { ...SkeletorDefaults._Button, ...config._Button },
        _Input: { ...SkeletorDefaults._Input, ...config._Input },
      }}
    >
      {children}
    </_SkeletorContext.Provider>
  );
};
