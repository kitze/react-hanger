import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';

export type MapOrEntries<K, V> = Map<K, V> | [K, V][];
export type UseMapFunctions<K, V> = {
  setValue: Dispatch<SetStateAction<Map<K, V>>>;
  remove: (keyToRemove: K) => void;
  set: (key: K, value: V) => void;
  clear: Map<K, V>['clear'];
  initialize: (pairsOrMap: MapOrEntries<K, V>) => void;
};
export type UseMap<K, V> = [Map<K, V>, UseMapFunctions<K, V>];

export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): UseMap<K, V> {
  const [map, setMap] = useState(Array.isArray(initialState) ? new Map(initialState) : initialState);

  const set = useCallback((key, value) => {
    setMap(aMap => {
      const copy = new Map(aMap);
      return copy.set(key, value);
    });
  }, []);

  const deleteByKey = useCallback(key => {
    setMap(_map => {
      const copy = new Map(_map);
      copy.delete(key);
      return copy;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(() => new Map());
  }, []);

  const initialize = useCallback((mapOrTuple: MapOrEntries<K, V> = []) => {
    setMap(() => new Map(mapOrTuple));
  }, []);

  const actions = useMemo(
    () => ({
      setValue: setMap,
      clear,
      set,
      remove: deleteByKey,
      initialize,
    }),
    [clear, deleteByKey, initialize, set],
  );

  return [map, actions];
}

export default useMap;
