import * as React from 'react';
import { SetStateAction, useMemo } from 'react';
import useSetStateArray from './array/useSetState';

export type UseSetStateAction<T extends object> = React.Dispatch<SetStateAction<Partial<T>>>;
export type UseSetState<T extends object> = {
  setState: UseSetStateAction<T>;
  state: T;
  resetState: () => void;
};

export function useSetState<T extends object>(initialValue: T): UseSetState<T> {
  const [state, setState, resetState] = useSetStateArray(initialValue);
  return useMemo(
    () => ({
      setState,
      resetState,
      state,
    }),
    [setState, resetState, state],
  );
}

export default useSetState;
