import React from "react";
import { SkeletorDefaults } from "../../config";
import { $SkeletorContext } from "./$SkeletorContext";

type Props = Partial<$SkeletorConfig> & {
  children: React.ReactNode;
};

/** Note: To allow $Text to use custom fonts you have defined
 *  create a $Font.d.ts type in your typescript types directory and define fonts as follows:
 * @example type $Font = "Helvetica" | "Montserrat" ...  */
export function SkeletorProvider({ children, ...config }: Props) {
  return (
    <$SkeletorContext.Provider
      value={{
        ...SkeletorDefaults,
        ...config,
      }}
    >
      {children}
    </$SkeletorContext.Provider>
  );
}
