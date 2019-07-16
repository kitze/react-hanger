import { useMemo } from 'react';
import { UseStateful } from './useStateful';
import useArrayArray, { UseArrayActions } from './array/useArray';

export type UseArray<T> = UseStateful<T[]> & UseArrayActions<T>;

export function useArray<T = any>(initial: T[]): UseArray<T> {
  const [value, actions] = useArrayArray(initial);
  return useMemo(
    () => ({
      value,
      ...actions,
    }),
    [actions, value],
  );
}

export default useArray;
