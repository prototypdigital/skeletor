type $AlignmentParams =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around';

interface $Alignment {
  align?: $AlignmentParams;
  alignSelf?: $AlignmentParams;
  justify?: $AlignmentParams;
  flexDirection?: 'row' | 'column';
}
