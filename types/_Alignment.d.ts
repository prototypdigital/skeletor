type _AlignmentParams =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around';

interface _Alignment {
  align?: _AlignmentParams;
  alignSelf?: _AlignmentParams;
  justify?: _AlignmentParams;
  flexDirection?: 'row' | 'column';
}
