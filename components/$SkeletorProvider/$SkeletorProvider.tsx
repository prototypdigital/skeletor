import React, { useMemo } from 'react';
import { SkeletorDefaults } from 'skeletor/config';
import { SkeletorConfig } from 'skeletor/models';
import { $SkeletorContext } from './$SkeletorContext';

export const SkeletorProvider: React.FC<Partial<SkeletorConfig>> = ({
  children,
  ...config
}) => {
  return (
    <$SkeletorContext.Provider
      value={{
        general: { ...SkeletorDefaults.general, ...config.general },
        $Text: { ...SkeletorDefaults.$Text, ...config.$Text },
        $Button: { ...SkeletorDefaults.$Button, ...config.$Button },
        $Input: { ...SkeletorDefaults.$Input, ...config.$Input },
      }}
    >
      {children}
    </$SkeletorContext.Provider>
  );
};
