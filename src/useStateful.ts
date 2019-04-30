import { default as React, SetStateAction, useMemo, useState } from 'react';

export function useStateful<T = any>(initial: T): UseStateful<T> {
  const [value, setValue] = useState(initial);
  return useMemo(
    () => ({
      value,
      setValue,
    }),
    [value],
  );
}

export type UseStateful<T = any> = {
  value: T;
  setValue: React.Dispatch<SetStateAction<T>>;
};

export default useStateful;
