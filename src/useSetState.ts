import * as React from 'react';
import { SetStateAction, useMemo } from 'react';
import useSetStateArray from './array/useSetState';

export type UseSetStateAction<T extends object> = React.Dispatch<SetStateAction<Partial<T>>>;
export type UseSetState<T extends object> = {
  setState: UseSetStateAction<T>;
  state: T;
};

export function useSetState<T extends object>(initialValue: T): UseSetState<T> {
  const [value, setState] = useSetStateArray(initialValue);
  return useMemo(
    () => ({
      setState,
      state: value,
    }),
    [setState, value],
  );
}

export default useSetState;
