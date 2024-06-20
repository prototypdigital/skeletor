import { useContext } from "react";

import { SkeletorContext } from "../components";
import type { SkeletorConfig } from "../models";

export function useSkeletor(): SkeletorConfig {
  return useContext(SkeletorContext);
}
