import React from "react";
import { SkeletorDefaults } from "../../config";

export const $SkeletorContext =
  React.createContext<$SkeletorConfig>(SkeletorDefaults);
