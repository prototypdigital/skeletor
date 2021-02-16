export interface AlignmentProps {
  align?: 'center' | 'flex-start' | 'flex-end';
  justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  flexDirection?: 'row' | 'column';
}

export class AlignmentProps {
  constructor() {
    this.align = undefined;
    this.justify = undefined;
    this.flexDirection = undefined;
  }
}
