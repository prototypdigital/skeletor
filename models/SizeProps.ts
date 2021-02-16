export interface SizeProps {
  width?: number | string;
  height?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  flex?: number;
}

export class SizeProps {
  constructor() {
    this.width = undefined;
    this.height = undefined;
    this.minHeight = undefined;
    this.minWidth = undefined;
    this.maxHeight = undefined;
    this.maxWidth = undefined;
    this.flex = undefined;
  }
}
