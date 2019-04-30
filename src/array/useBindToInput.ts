import { default as React, useMemo } from 'react';
import { UseInput, UseInputActions } from './useInput';

export type BindToInput = {
  eventBind: {
    onChange: (e: React.SyntheticEvent) => void;
    value: string;
  };
  valueBind: {
    onChange: React.Dispatch<string>;
    value: string;
  };
};
export type UseBindToInput = [[string, boolean], UseInputActions, BindToInput];

export function useBindToInput(useInputResult: UseInput): UseBindToInput {
  const [values, actions] = useInputResult;
  return [
    values,
    actions,
    useMemo(
      () => ({
        eventBind: {
          onChange: actions.onChange,
          value: values[0],
        },
        valueBind: {
          onChange: actions.setValue,
          value: values[0],
        },
      }),
      [actions, values],
    ),
  ];
}

export default useBindToInput;
