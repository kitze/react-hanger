import * as React from 'react';
import { SetStateAction, useMemo } from 'react';
import useBooleanArray from './array/useBoolean';

export type UseBoolean = {
  value: boolean;
  setValue: React.Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export function useBoolean(initial: boolean): UseBoolean {
  const [value, actions] = useBooleanArray(initial);
  return useMemo(
    () => ({
      value,
      ...actions,
    }),
    [actions, value],
  );
}

export default useBoolean;
