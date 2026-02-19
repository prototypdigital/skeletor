import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import type { SkeletorConfig } from "../../models";
import { SkeletorContext, SkeletorDefaults } from "./SkeletorContext";

type Props = Partial<SkeletorConfig>;

/** Create a Font.d.ts type in your typescript types directory and define fonts as follows:
 * @example type Font = "Helvetica" | "Montserrat" ...  */
export const SkeletorProvider: React.FC<PropsWithChildren<Props>> = ({
	children,
	...config
}) => {
	const value = useMemo(() => ({ ...SkeletorDefaults, ...config }), [config]);

	return (
		<SkeletorContext.Provider value={value}>
			{children}
		</SkeletorContext.Provider>
	);
};
