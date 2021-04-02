import { useEffect, useState } from 'react';

const usePersist = <T>(key: string, data: T): T => {
  const storageKey = `persist-cache-${key}`;
  const storageValue = localStorage.getItem(storageKey);
  const persistedValue = JSON.parse(storageValue ?? '{}');
  const [state, setState] = useState<T>(storageValue ? persistedValue : data);
  const updateState = (val: T) => {
    setState(val);
    localStorage.setItem(storageKey, JSON.stringify(val));
  };

  useEffect(() => {
    if (data) {
      updateState(data);
    }
  }, [data]);
  return state;
};

export default usePersist;
