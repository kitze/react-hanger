import { selector } from './helper';
import { useSet as use, Actions, Value } from './array';

export type UseSet<T> = Actions<T> & Value<T>;

const has = selector('has');
const keys = selector('keys');
const values = selector('values');
const entries = selector('entries');
const iterator = selector(Symbol.iterator);

export function useSet<T>(initialState: Set<T> = new Set()): UseSet<T> {
  const [value, actions] = use<T>(initialState);
  return {
    ...actions,
    has: has(value),
    keys: keys(value),
    values: values(value),
    entries: entries(value),
    [Symbol.iterator]: iterator(value),
  };
}
