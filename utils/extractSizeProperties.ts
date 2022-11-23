export function extractSizeProperties<Props extends Size>(props: Props): Size {
  return {
    flex: props.flex,
    height: props.height,
    width: props.width,
    maxHeight: props.maxHeight,
    maxWidth: props.maxHeight,
    minHeight: props.minHeight,
    minWidth: props.minWidth,
  };
}
