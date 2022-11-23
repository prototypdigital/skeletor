import { useContext } from "react";
import { SkeletorContext } from "../components";

export function useSkeletor(): SkeletorConfig {
  return useContext(SkeletorContext);
}
