import { useMemo } from 'react';
import { UseStateful } from './useStateful';
import useNumberArray, { UseNumberActions } from './array/useNumber';

export type UseNumber = UseStateful<number> & UseNumberActions;

export function useNumber(
  initial: number,
  options: {
    upperLimit?: number;
    lowerLimit?: number;
    loop?: boolean;
    step?: number;
  } = {},
): UseNumber {
  const [value, actions] = useNumberArray(initial, options);
  return useMemo(
    () => ({
      value,
      ...actions,
    }),
    [actions, value],
  );
}

export default useNumber;
