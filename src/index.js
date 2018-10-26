import { useCallback, useState } from "react";

export const useStateful = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue
  };
};

export const useNumber = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    increase: useCallback(() => setValue(value + 1)),
    decrease: useCallback(() => setValue(value - 1))
  };
};

export const useArray = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    add: useCallback(a => setValue(v => [...v, a])),
    clear: useCallback(() => setValue(v => [])),
    removeIndex: useCallback(index =>
      setValue(v => {
        v.splice(index, 1);
        return v;
      })
    )
  };
};

export const useBoolean = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    toggle: useCallback(() => setValue(v => !v)),
    setTrue: useCallback(() => setValue(true)),
    setFalse: useCallback(() => setValue(false))
  };
};

export const useInput = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    hasValue: value && value.trim() !== "",
    clear: useCallback(() => setValue("")),
    onChangeHandler: useCallback(e => setValue(e.target.value))
  };
};
