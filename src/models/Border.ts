import { AnimatableNumericValue } from "react-native/types";

export interface Border {
  border?: {
    borderWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderColor?: string;
    borderRadius?: AnimatableNumericValue;
    borderTopLeftRadius?: AnimatableNumericValue;
    borderTopRightRadius?: AnimatableNumericValue;
    borderBottomLeftRadius?: AnimatableNumericValue;
    borderBottomRightRadius?: AnimatableNumericValue;
  };
}
