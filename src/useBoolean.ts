import { useMemo } from 'react';
import useBooleanArray, { UseBooleanActions } from './array/useBoolean';
import { UseStateful } from './useStateful';

export type UseBoolean = UseStateful<boolean> & UseBooleanActions;

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
