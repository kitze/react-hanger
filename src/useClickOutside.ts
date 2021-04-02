import { useRef } from 'react';
import { useOnClick } from 'useOnClick';

export type ClickOutsideOptions = {
  blacklistClassNames?: string[];
  blacklistElements?: string[];
};
const checkOptions = (event: MouseEvent, options?: ClickOutsideOptions) => {
  if (!options) {
    return true;
  }

  const { blacklistClassNames = [], blacklistElements = [] } = options;

  const passesClassnames = (event as any).path.every((element: HTMLElement) => {
    return blacklistClassNames.every((cn) => (element.classList ? !element.classList.contains(cn) : true));
  });

  const passesElements = blacklistElements.every((elem) => (event.target as HTMLElement)?.tagName !== elem);

  return passesClassnames && passesElements;
};

export const useOnClickOutside = (fn: () => void, options?: ClickOutsideOptions) => {
  const elementRef = useRef<HTMLElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (!elementRef?.current?.contains(event.target as Node) && checkOptions(event, options)) {
      // clicked outside the ref
      fn();
    }
  };

  useOnClick(handleClick);

  return elementRef;
};
