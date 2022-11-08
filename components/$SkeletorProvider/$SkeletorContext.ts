import React from 'react';
import { SkeletorDefaults } from '../../config';
import { SkeletorConfig } from '../../models';

export const $SkeletorContext =
  React.createContext<SkeletorConfig>(SkeletorDefaults);
