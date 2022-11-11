export function extractSpacingProperties<Props extends $Spacing>(
  props: Props,
): $Spacing {
  return { margins: props.margins, paddings: props.paddings };
}
