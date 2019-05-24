import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { mutator } from '../helper';

export type Actions<T> = {
  setValue: Dispatch<SetStateAction<Set<T>>>;
  add: (a: T) => void;
  remove: (a: T) => void;
  clear: Set<T>['clear'];
};

export type Value<T> = {
  has: Set<T>['has'];
  keys: Set<T>['keys'];
  values: Set<T>['values'];
  entries: Set<T>['entries'];
  [Symbol.iterator]: () => IterableIterator<T>;
};

export type UseSet<T> = [Value<T>, Actions<T>];

const clone = <T>(value: Set<T>) => new Set<T>(value);
const add = mutator('add', clone);
const remove = mutator('delete', clone);
const clear = mutator('clear', clone);

export function useSet<T>(initialState: Set<T> = new Set()): UseSet<T> {
  const [value, setValue] = useState(initialState);

  const actions: Actions<T> = {
    setValue,
    add: add(setValue),
    remove: remove(setValue),
    clear: clear(setValue),
  };

  return [value, useMemo(() => actions, [setValue])];
}
