import { ViewStyle } from "react-native";

type Offsets = {
  top?: ViewStyle["top"];
  bottom?: ViewStyle["bottom"];
  left?: ViewStyle["left"];
  right?: ViewStyle["right"];
};

export interface Position {
  absolute?: boolean;
  zIndex?: number;
  offsets?: Offsets;
}
