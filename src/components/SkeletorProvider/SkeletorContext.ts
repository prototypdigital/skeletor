import React from "react";

import type { SkeletorConfig } from "../../models";

export const SkeletorDefaults: SkeletorConfig = {
  defaultFont: undefined,
  defaultFontSize: [12, 16],
  defaultStatusBarType: "dark-content",
  defaultTextColor: "black",
  allowFontScaling: false,
  maxFontSizeMultiplier: 1,
};

export const SkeletorContext =
  React.createContext<SkeletorConfig>(SkeletorDefaults);
