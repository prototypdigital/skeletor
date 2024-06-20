import type { ViewStyle } from "react-native";

type Offsets =
  | [ViewStyle["top"]]
  | [ViewStyle["top"], ViewStyle["left"]]
  | [ViewStyle["top"], ViewStyle["left"], ViewStyle["bottom"]]
  | [
      ViewStyle["top"],
      ViewStyle["left"],
      ViewStyle["bottom"],
      ViewStyle["right"],
    ]
  | {
      top?: ViewStyle["top"];
      bottom?: ViewStyle["bottom"];
      left?: ViewStyle["left"];
      right?: ViewStyle["right"];
    };

export interface Position {
  absolute?: boolean;
  zIndex?: number;
  offsets?: Offsets;
  overflow?: ViewStyle["overflow"];
}
