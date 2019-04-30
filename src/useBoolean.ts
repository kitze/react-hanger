import * as React from 'react';
import { SetStateAction, useCallback, useMemo, useState } from 'react';

export type UseBoolean = {
  value: boolean;
  setValue: React.Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export function useBoolean(initial: boolean): UseBoolean {
  const [value, setValue] = useState<boolean>(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return useMemo(
    () => ({
      value,
      setValue,
      toggle,
      setTrue,
      setFalse,
    }),
    [setFalse, setTrue, toggle, value],
  );
}

export default useBoolean;
