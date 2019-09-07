import * as React from 'react';
import { SetStateAction, useCallback, useState } from 'react';

export type UseSetStateAction<T extends object> = React.Dispatch<SetStateAction<Partial<T>>>;
export type UseSetState<T extends object> = [T, UseSetStateAction<T>, () => void];

export function useSetState<T extends object>(initialValue: T): UseSetState<T> {
  const [value, setValue] = useState<T>(initialValue);
  const setState = useCallback(
    (v: SetStateAction<Partial<T>>) => {
      return setValue(oldValue => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v),
      }));
    },
    [setValue],
  );
  const resetState = useCallback(() => setValue(initialValue), []);

  return [value, setState, resetState];
}

export default useSetState;
