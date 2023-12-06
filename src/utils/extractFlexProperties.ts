import { Flex, FlexAttributes } from "models";

export function extractFlexProperties<Props extends Flex>(
  props: Props
): FlexAttributes {
  if (!props.flex) return { flex: undefined };
  if (typeof props.flex === "number") {
    return { flex: props.flex };
  } else {
    return {
      columnGap: props.flex.columnGap,
      flex: props.flex.flex,
      flexBasis: props.flex.flexBasis,
      flexGrow: props.flex.flexGrow,
      flexShrink: props.flex.flexShrink,
      flexWrap: props.flex.flexWrap,
      gap: props.flex.gap,
      rowGap: props.flex.rowGap,
    };
  }
}
