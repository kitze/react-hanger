import useBoolean from 'useBoolean';
import { useEffect } from 'react';

export const useDocumentReady = () => {
  const { setTrue, value } = useBoolean(false);
  useEffect(() => {
    document.addEventListener('DOMContentLoaded', () => {
      setTrue();
    });
  }, [setTrue]);
  return value || (typeof document !== 'undefined' && document.readyState === 'complete');
};
