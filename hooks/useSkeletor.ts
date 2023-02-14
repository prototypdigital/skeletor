import { useContext } from "react";
import { SkeletorConfig } from "../models";
import { SkeletorContext } from "../components";

export function useSkeletor(): SkeletorConfig {
  return useContext(SkeletorContext);
}
