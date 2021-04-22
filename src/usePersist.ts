import { useEffect, useState } from 'react';

export const usePersist = <T>(key: string, data: T): T => {
  const storageKey = `persist-cache-${key}`;
  const storageValue = localStorage.getItem(storageKey);
  const persistedValue = JSON.parse(storageValue ?? '{}');
  const [state, setState] = useState<T>(storageValue ? persistedValue : data);

  useEffect(() => {
    if (data) {
      setState(data);
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, storageKey]);
  return state;
};
