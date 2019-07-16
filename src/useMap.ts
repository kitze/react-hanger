import { useMemo } from 'react';
import { UseStateful } from './useStateful';
import useMapArray from './array/useMap';

export type MapOrEntries<K, V> = Map<K, V> | [K, V][];
export type UseMap<K, V> = UseStateful<Map<K, V>> & {
  remove: (keyToRemove: K) => void;
  set: (key: K, value: V) => void;
  clear: Map<K, V>['clear'];
  initialize: (pairsOrMap: MapOrEntries<K, V>) => void;
};

export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): UseMap<K, V> {
  const [map, actions] = useMapArray(initialState);
  return useMemo(
    () => ({
      value: map,
      ...actions,
    }),
    [actions, map],
  );
}

export default useMap;
