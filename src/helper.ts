import { useCallback } from 'react';

type SetValue<T> = (arg: (value: T) => T) => void;
type Clone<T> = (arg: T) => T;

export const selector = (method: string | symbol) => <T extends Object>(base: T) => (...args: any[]) =>
  base[method](...args);

export const mutator = <T>(method: string | symbol, clone: Clone<T>) => (setValue: SetValue<T>) =>
  useCallback((...args: any[]) => {
    setValue(value => {
      const copy = clone(value);
      copy[method](...args);
      return copy;
    });
  }, []);
