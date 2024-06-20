import React, { type PropsWithChildren } from "react";

import type { SkeletorConfig } from "../../models";
import { SkeletorContext, SkeletorDefaults } from "./SkeletorContext";

type Props = Partial<SkeletorConfig>;

/** Create a Font.d.ts type in your typescript types directory and define fonts as follows:
 * @example type Font = "Helvetica" | "Montserrat" ...  */
export const SkeletorProvider: React.FC<PropsWithChildren<Props>> = ({
	children,
	...config
}) => {
	return (
		<SkeletorContext.Provider value={{ ...SkeletorDefaults, ...config }}>
			{children}
		</SkeletorContext.Provider>
	);
};
