import { useEffect } from 'react';
import useBoolean from 'useBoolean';

export const usePageLoad = () => {
  const loaded = useBoolean(false);
  useEffect(() => {
    window.onload = () => loaded.setTrue();
  }, []);
  return loaded.value;
};
