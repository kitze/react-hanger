import useBoolean from 'useBoolean';
import { useEffect } from 'react';

export const useDocumentReady = () => {
  const ready = useBoolean(false);
  useEffect(() => {
    document.addEventListener('DOMContentLoaded', () => {
      ready.setTrue();
    });
  }, []);
  return ready.value || (typeof document !== 'undefined' && document.readyState === 'complete');
};
