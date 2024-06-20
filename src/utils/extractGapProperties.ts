import type { Spacing } from "models";
import type { ViewStyle } from "react-native";

export function extractGapProperties<Props extends Spacing>(
  props: Props,
): {
  gap?: ViewStyle["gap"];
  columnGap?: ViewStyle["columnGap"];
  rowGap?: ViewStyle["rowGap"];
} {
  const value = props.gap;
  if (!value) return {};

  if (Array.isArray(value)) {
    return {
      columnGap: value[0],
      rowGap: value[1],
    };
  }

  if (typeof value === "number") {
    return {
      gap: value,
    };
  }

  return {
    columnGap: value.col,
    rowGap: value.row,
  };
}
