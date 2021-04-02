import { useEffect } from 'react';

export const useToggleBodyClass = (addClass: boolean, className: string) => {
  useEffect(() => {
    addClass ? document.body.classList.add(className) : document.body.classList.remove(className);
  }, [addClass, className]);
};
