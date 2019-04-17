import { useCallback, useEffect, useRef, useState, SetStateAction, useMemo } from 'react';
import * as React from 'react';

type UseStateful<T = any> = {
  value: T;
  setValue: React.Dispatch<SetStateAction<T>>;
};
type Callback = (...args: any[]) => void | any;

export function useStateful<T = any>(initial: T): UseStateful<T> {
  const [value, setValue] = useState(initial);
  return useMemo(
    () => ({
      value,
      setValue
    }),
    [value]
  );
}

export type UseNumber = UseStateful<number> & {
  increase: (value?: number) => void;
  decrease: (value?: number) => void;
};

export function useNumber(
  initial: number,
  {
    upperLimit,
    lowerLimit,
    loop,
    step = 1
  }: {
    upperLimit?: number;
    lowerLimit?: number;
    loop?: boolean;
    step?: number;
  } = {}
): UseNumber {
  const [value, setValue] = useState<number>(initial);
  const decrease = useCallback(
    (d?: number) => {
      setValue(aValue => {
        const decreaseBy = d !== undefined ? d : step;
        const nextValue = aValue - decreaseBy;

        if (lowerLimit !== undefined) {
          if (nextValue + decreaseBy > lowerLimit) {
            return nextValue;
          }
          if (loop && upperLimit) {
            return upperLimit;
          }
          return aValue;
        }
        return nextValue;
      });
    },
    [loop, lowerLimit, step, upperLimit]
  );
  const increase = useCallback(
    (i?: number) => {
      setValue(aValue => {
        const increaseBy = i !== undefined ? i : step;
        const nextValue = aValue + increaseBy;

        if (upperLimit !== undefined) {
          if (nextValue - increaseBy < upperLimit) {
            return nextValue;
          }
          if (loop) {
            return initial;
          }
          return aValue;
        }
        return nextValue;
      });
    },
    [initial, loop, step, upperLimit]
  );
  return useMemo(
    () => ({
      value,
      setValue,
      increase,
      decrease
    }),
    [decrease, increase, value]
  );
}

type UseArray<T> = UseStateful<T[]> & {
  add: (value: T) => void;
  clear: () => void;
  move: (from: number, to: number) => void;
  removeById: (id: T extends { id: string } ? string : T extends { id: number } ? number : unknown) => void;
  removeIndex: (index: number) => void;
};

export function useArray<T = any>(initial: T[]): UseArray<T> {
  const [value, setValue] = useState(initial);
  const add = useCallback(a => setValue(v => [...v, a]), []);
  const move = useCallback(
    (from: number, to: number) =>
      setValue(it => {
        const copy = it.slice();
        copy.splice(to < 0 ? copy.length + to : to, 0, copy.splice(from, 1)[0]);
        return copy;
      }),
    []
  );
  const clear = useCallback(() => setValue(() => []), []);
  const removeById = useCallback(
    // @ts-ignore not every array that you will pass down will have object with id field.
    id => setValue(arr => arr.filter(v => v && v.id !== id)),
    []
  );
  const removeIndex = useCallback(
    index =>
      setValue(v => {
        v.splice(index, 1);
        return v;
      }),
    []
  );
  return useMemo(
    () => ({
      value,
      setValue,
      add,
      move,
      clear,
      removeById,
      removeIndex
    }),
    [add, clear, move, removeById, removeIndex, value]
  );
}

type UseBoolean = {
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
      setFalse
    }),
    [setFalse, setTrue, toggle, value]
  );
}

type UseInput = UseStateful<string> & {
  onChange: (e: React.SyntheticEvent) => void;
  hasValue: boolean;
  clear: () => void;
  bindToInput: {
    onChange: (e: React.SyntheticEvent) => void;
    value: string;
  };
  bind: {
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
      bindToInput: {
        onChange,
        value
      },
      bind: {
        onChange: setValue,
        value
      }
    }),
    [clear, onChange, value]
  );
}

/* eslint-disable no-console */
export function useLogger(name: string, props: any): void {
  useEffect(() => {
    console.log(`${name} has mounted`);
    return () => console.log(`${name} has unmounted`);
  }, []);
  useEffect(() => {
    console.log('Props updated', props);
  }, [props]);
}
/* eslint-enable no-console */

export function useSetState<T>(
  initialValue: T
): {
  setState: React.Dispatch<SetStateAction<Partial<T>>>;
  state: T;
} {
  const { value, setValue } = useStateful<T>(initialValue);
  const setState = useCallback(
    (v: SetStateAction<Partial<T>>) => {
      return setValue(oldValue => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v)
      }));
    },
    [setValue]
  );
  return useMemo(
    () => ({
      setState,
      state: value
    }),
    [setState, value]
  );
}

export function usePrevious<T = any>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
