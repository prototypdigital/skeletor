import { useContext } from 'react';
import { _SkeletorContext } from 'skeletor/components';

export function useSkeletor() {
  const skeletor = useContext(_SkeletorContext);
  console.log(_SkeletorContext);
  return skeletor;
}
