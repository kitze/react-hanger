import { useEffect } from 'react';

export const useOnClick = (handler: (event: MouseEvent) => void) => {
  useEffect(() => {
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
};
