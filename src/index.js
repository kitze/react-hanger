import { useCallback, useState } from "react";

export const useStateful = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue
  };
};

export const useNumber = (initial, { upperLimit, lowerLimit } = {}) => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    increase: useCallback(() => {
      const nextValue = value + 1;
      setValue(
        upperLimit !== undefined
          ? nextValue - 1 < upperLimit
            ? nextValue
            : value
          : nextValue
      );
    }),
    decrease: useCallback(() => {
      const nextValue = value - 1;
      setValue(
        lowerLimit !== undefined
          ? nextValue + 1 > lowerLimit
            ? nextValue
            : value
          : nextValue
      );
    })
  };
};

export const useArray = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    add: useCallback(a => setValue(v => [...v, a])),
    clear: useCallback(() => setValue(() => [])),
    removeById: useCallback(id =>
      setValue(arr => arr.filter(v => v && v.id !== id))
    ),
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
  const onChange = useCallback(e => setValue(e.target.value));

  return {
    value,
    setValue,
    hasValue: value && value.trim() !== "",
    clear: useCallback(() => setValue("")),
    onChangeHandler: onChange,
    bindToInput: {
      onChange,
      value
    }
  };
};
