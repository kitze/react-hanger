import { default as React, SetStateAction, useCallback, useMemo, useState } from 'react';

export type UseNumberActions = {
  setValue: React.Dispatch<SetStateAction<number>>;
  increase: (value?: number) => void;
  decrease: (value?: number) => void;
};
export type UseNumber = [number, UseNumberActions];

export function useNumber(
  initial: number,
  {
    upperLimit,
    lowerLimit,
    loop,
    step = 1,
  }: {
    upperLimit?: number;
    lowerLimit?: number;
    loop?: boolean;
    step?: number;
  } = {},
): UseNumber {
  const [value, setValue] = useState<number>(initial);
  const decrease = useCallback(
    (d?: number) => {
      setValue(aValue => {
        const decreaseBy = d !== undefined ? d : step;
        const nextValue = aValue - decreaseBy;

        if (lowerLimit !== undefined) {
          if (nextValue + decreaseBy > lowerLimit) {
            return nextValue;
          }
          if (loop && upperLimit) {
            return upperLimit;
          }
          return aValue;
        }
        return nextValue;
      });
    },
    [loop, lowerLimit, step, upperLimit],
  );
  const increase = useCallback(
    (i?: number) => {
      setValue(aValue => {
        const increaseBy = i !== undefined ? i : step;
        const nextValue = aValue + increaseBy;

        if (upperLimit !== undefined) {
          if (nextValue - increaseBy < upperLimit) {
            return nextValue;
          }
          if (loop) {
            return initial;
          }
          return aValue;
        }
        return nextValue;
      });
    },
    [initial, loop, step, upperLimit],
  );
  const actions = useMemo(
    () => ({
      setValue,
      increase,
      decrease,
    }),
    [decrease, increase],
  );
  return [value, actions];
}

export default useNumber;
