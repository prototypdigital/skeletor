import React from "react";

export const $SkeletorContext = React.createContext<Partial<$SkeletorConfig>>({
  defaultFontSize: [12, 16],
  defaultStatusBarType: "dark-content",
});
