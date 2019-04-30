import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { UseStateful } from './useStateful';

export type UseInput = UseStateful<string> & {
  onChange: (e: React.SyntheticEvent) => void;
  hasValue: boolean;
  clear: () => void;
  eventBind: {
    onChange: (e: React.SyntheticEvent) => void;
    value: string;
  };
  valueBind: {
    onChange: React.Dispatch<string>;
    value: string;
  };
};

export function useInput(initial: string | number | boolean = ''): UseInput {
  const stringified = initial.toString();
  const [value, setValue] = useState<string>(stringified);
  const onChange = useCallback(e => setValue(e.target.value), []);

  const clear = useCallback(() => setValue(''), []);
  return useMemo(
    () => ({
      value,
      setValue,
      hasValue: value !== undefined && value !== null && value.trim() !== '',
      clear,
      onChange,
      eventBind: {
        onChange,
        value,
      },
      valueBind: {
        onChange: setValue,
        value,
      },
    }),
    [clear, onChange, value],
  );
}

export default useInput;
