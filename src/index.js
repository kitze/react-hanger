import { useCallback, useEffect, useRef, useState } from "react";

export const useStateful = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue
  };
};

export const useNumber = (initial, { upperLimit, lowerLimit, loop } = {}) => {
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
            : loop === true
              ? initial
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
            : loop === true
              ? upperLimit
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
  const isNumber = typeof initial === "number";
  const [value, setValue] = useState(initial);
  const onChange = useCallback(e => setValue(e.target.value));

  return {
    value,
    setValue,
    hasValue:
      value !== undefined &&
      value !== null &&
      (!isNumber ? value.trim && value.trim() !== "" : true),
    clear: useCallback(() => setValue("")),
    onChange,
    bindToInput: {
      onChange,
      value
    },
    bind: {
      onChange: setValue,
      value
    }
  };
};

export const useLifecycleHooks = ({ onMount, onUnmount }) => () =>
  useEffect(() => {
    onMount && onMount();
    return () => onUnmount && onUnmount();
  }, []);

export const useOnUnmount = onUnmount =>
  useEffect(() => {
    return () => onUnmount && onUnmount();
  }, []);

export const useOnMount = onMount =>
  useEffect(() => {
    onMount && onMount();
  }, []);

export const useLogger = (name, props) => {
  useLifecycleHooks({
    onMount: () => console.log(`${name} has mounted`),
    onUnmount: () => console.log(`${name} has unmounted`)
  });
  useEffect(() => {
    console.log("Props updated", props);
  });
};

export const useSetState = initialValue => {
  const { value, setValue } = useStateful(initialValue);
  return {
    setState: v => {
      let newValue = { ...value, ...v };
      return setValue(newValue);
    },
    state: value
  };
};

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
