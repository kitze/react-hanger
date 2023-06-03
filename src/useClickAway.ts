import React from 'react';

export function useClickAway(elem: React.RefObject<HTMLDivElement>, func: (event: MouseEvent) => void) {
  React.useEffect(() => {
    const eventListener = (event: MouseEvent) => {
      if (!elem || !elem.current || elem.current.contains(event.target as Node)) {
        return;
      }
      func(event);
    };
    document.addEventListener('mousedown', eventListener);
    return () => {
      document.removeEventListener('mousedown', eventListener);
    };
  }, [elem, func]);
}

export default useClickAway;
