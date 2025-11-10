import type { SkeletorConfig } from "models";
import React from "react";

export const SkeletorDefaults: SkeletorConfig = {
	defaultFont: undefined,
	defaultFontSize: [12, 16],
	defaultStatusBarType: "dark-content",
	defaultTextColor: "black",
	allowFontScaling: false,
};

export const SkeletorContext =
	React.createContext<SkeletorConfig>(SkeletorDefaults);
