export function extractAlignmentProperties<Props extends Alignment>(
  props: Props,
): Alignment {
  return {
    align: props.align,
    alignSelf: props.alignSelf,
    justify: props.justify,
    flexDirection: props.flexDirection,
    flexWrap: props.flexWrap,
  };
}
