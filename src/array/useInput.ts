import { default as React, SetStateAction, useCallback, useMemo, useState } from 'react';

export type UseInputActions = {
  setValue: React.Dispatch<SetStateAction<string>>;
  onChange: (e: React.SyntheticEvent) => void;
  clear: () => void;
};
export type UseInput = [[string, boolean], UseInputActions];

export function useInput(initial: string | number | boolean = ''): UseInput {
  const stringified = initial.toString();
  const [value, setValue] = useState<string>(stringified);
  const onChange = useCallback(e => setValue(e.target.value.toString()), []);

  const clear = useCallback(() => setValue(''), []);
  const hasValue = value !== undefined && value !== null && value.trim() !== '';
  const actions = useMemo(
    () => ({
      setValue,
      clear,
      onChange,
    }),
    [clear, onChange],
  );
  const values = useMemo(() => [value, hasValue], [hasValue, value]) as [string, boolean];
  return [values, actions];
}

export default useInput;
