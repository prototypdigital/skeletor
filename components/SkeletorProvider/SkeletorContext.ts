import React from "react";
import { SkeletorConfig } from "../../models";

export const SkeletorDefaults: SkeletorConfig = {
  defaultFont: undefined,
  defaultFontSize: [12, 16],
  defaultStatusBarType: "dark-content",
  defaultTextColor: "black",
};

export const SkeletorContext =
  React.createContext<SkeletorConfig>(SkeletorDefaults);
