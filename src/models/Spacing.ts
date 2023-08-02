import { DimensionValue } from "react-native/types";

export interface Spacing {
  margins?: {
    marginTop?: DimensionValue;
    marginBottom?: DimensionValue;
    marginLeft?: DimensionValue;
    marginRight?: DimensionValue;
    marginHorizontal?: DimensionValue;
    marginVertical?: DimensionValue;
    margin?: DimensionValue;
  };
  paddings?: {
    paddingTop?: DimensionValue;
    paddingBottom?: DimensionValue;
    paddingLeft?: DimensionValue;
    paddingRight?: DimensionValue;
    paddingHorizontal?: DimensionValue;
    paddingVertical?: DimensionValue;
    padding?: DimensionValue;
  };
}
