export function extractBorderProperties<Props extends $Border>(
  props: Props,
): $Border {
  return {
    borderColor: props.borderColor,
    borderWidth: props.borderWidth,
  };
}
