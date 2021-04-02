import React, { useRef } from 'react';

export const useFocus = <T extends HTMLElement>(): [React.RefObject<T>, () => void] => {
  const ref = useRef<T>(null);
  const focusElement = () => {
    requestAnimationFrame(() => {
      ref.current?.focus();
    });
  };
  return [ref, focusElement];
};
