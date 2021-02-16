export interface SpacingProps {
  margins?: {
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    margin?: number;
  };
  paddings?: {
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    padding?: number;
  };
}

export class SpacingProps {
  constructor() {
    this.margins = undefined;
    this.paddings = undefined;
  }
}
