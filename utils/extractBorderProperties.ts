export function extractBorderProperties<Props extends Border>(
  props: Props,
): Border {
  return {
    borderColor: props.borderColor,
    borderWidth: props.borderWidth,
    borderTopWidth: props.borderTopWidth,
    borderBottomWidth: props.borderBottomWidth,
    borderLeftWidth: props.borderLeftWidth,
    borderRightWidth: props.borderRightWidth,
    borderRadius: props.borderRadius,
    borderTopLeftRadius: props.borderTopLeftRadius,
    borderTopRightRadius: props.borderTopRightRadius,
    borderBottomLeftRadius: props.borderBottomLeftRadius,
    borderBottomRightRadius: props.borderBottomRightRadius,
  };
}
