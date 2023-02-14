import { Size } from "../models";

export function extractSizeProperties<Props extends Size>(props: Props): Size {
  return {
    flex: props.flex,
    height: props.height,
    width: props.width,
    maxHeight: props.maxHeight,
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    minWidth: props.minWidth,
  };
}
