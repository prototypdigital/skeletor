import { SkeletorContext } from "components";
import type { SkeletorConfig } from "models";
import { useContext } from "react";

export function useSkeletor(): SkeletorConfig {
	return useContext(SkeletorContext);
}
