import React from "react";

export const SkeletorDefaults: SkeletorConfig = {
  defaultFont: undefined,
  defaultFontSize: [12, 16],
  defaultStatusBarType: "dark-content",
};

export const SkeletorContext =
  React.createContext<SkeletorConfig>(SkeletorDefaults);
