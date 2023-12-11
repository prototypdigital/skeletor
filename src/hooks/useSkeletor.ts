import { useContext } from "react";

import { SkeletorContext } from "../components";
import { SkeletorConfig } from "../models";

export function useSkeletor(): SkeletorConfig {
  return useContext(SkeletorContext);
}
