import { useEffect } from 'react';
import useBoolean from 'useBoolean';

export const usePageLoad = () => {
  const { value, setTrue } = useBoolean(false);
  useEffect(() => {
    window.onload = () => setTrue();
  }, [setTrue]);
  return value;
};
