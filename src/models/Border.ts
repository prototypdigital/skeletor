import { ViewStyle } from "react-native/types";

type BorderStyles = {
  [Key in keyof ViewStyle]: Key extends `border${infer Rest}` ? Key : never;
}[keyof ViewStyle];

export interface Border {
  border?: BorderStyles;
}
