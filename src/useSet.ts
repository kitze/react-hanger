import { useCallback, useMemo, useState } from 'react';
import { UseStateful } from './useStateful';

type SetValue<T> = (arg: (value: T) => T) => void;
type Clone<T> = (arg: T) => T;
export type UseSomething<T> = UseStateful<T> & {
  value: T;
  setValue: (value: T) => void;
};

export const selector = (method: string | symbol) => <T extends Object>(base: T) => (...args: any[]) =>
  base[method](...args);

export const mutator = (method: string | symbol) => <T>(clone: Clone<T>, setValue: SetValue<T>) =>
  useCallback((...args: any[]) => {
    setValue(value => {
      const copy = clone(value);
      copy[method](...args);
      return copy;
    });
  }, []);

// --- useSet ----
const clone = <T>(value: Set<T>) => new Set<T>(value);

export type UseSet<T> = {
  add: (a: T) => void;
  remove: (a: T) => void;
  clear: Set<T>['clear'];
  has: Set<T>['has'];
  keys: Set<T>['keys'];
  values: Set<T>['values'];
  entries: Set<T>['entries'];
  [Symbol.iterator]: () => IterableIterator<T>;
} & UseSomething<Set<T>>;

export function useSet<T>(initialState: Set<T> = new Set()): UseSet<T> {
  const [value, setValue] = useState(initialState);

  const set: UseSet<T> = {
    value,
    setValue,
    add: mutator('add')(clone, setValue),
    remove: mutator('delete')(clone, setValue),
    clear: mutator('clear')(clone, setValue),
    has: selector('has')(value),
    keys: selector('keys')(value),
    values: selector('values')(value),
    entries: selector('entries')(value),
    [Symbol.iterator]: selector(Symbol.iterator)(value),
  };

  return useMemo(() => set, [value]);
}
