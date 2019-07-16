import { useMemo } from 'react';
import { UseStateful } from './useStateful';
import useNumberArray from './array/useNumber';

export type UseNumber = UseStateful<number> & {
  increase: (value?: number) => void;
  decrease: (value?: number) => void;
};

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
