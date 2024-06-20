import type { ViewStyle } from "react-native";

type FlexKeys = Extract<keyof ViewStyle, `flex${string}`>;
type FilteredFlexKeys = Exclude<FlexKeys, "flexDirection">;

export type FlexAttributes = { [K in FilteredFlexKeys]?: ViewStyle[K] } & {
  gap?: ViewStyle["gap"];
  rowGap?: ViewStyle["rowGap"];
  columnGap?: ViewStyle["columnGap"];
};

export interface Flex {
  flex?: ViewStyle["flex"] | FlexAttributes;
}
