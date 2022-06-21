import { useContext } from 'react';
import { $SkeletorContext } from '../components';

export function useSkeletor() {
  const skeletor = useContext($SkeletorContext);
  return skeletor;
}
