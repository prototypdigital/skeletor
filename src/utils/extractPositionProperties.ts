import { Position } from "models";
import { ViewStyle } from "react-native";

type ReturnProps = {
  position: ViewStyle["position"];
  zIndex: ViewStyle["zIndex"];
  top: ViewStyle["top"];
  right: ViewStyle["right"];
  bottom: ViewStyle["bottom"];
  left: ViewStyle["left"];
};

export function extractPositionProperties<Props extends Position>(
  props: Props
): ReturnProps {
  return {
    position: props.absolute ? "absolute" : "relative",
    zIndex: props.zIndex,
    top: props.offsets?.top,
    right: props.offsets?.right,
    bottom: props.offsets?.bottom,
    left: props.offsets?.left,
  };
}
