import { useEffect, useRef, useState } from 'react';

export type UseScriptProps = {
  delay?: number;
  src: string;
  onError?: (error: Event | string) => void;
  onReady?: () => void;
  startLoading: boolean;
};

export type UseScript = {
  ready: boolean;
  error: null | Event | string;
};

export const useScript = ({ startLoading, onReady, onError, src, delay = 0 }: UseScriptProps): UseScript => {
  const isLoading = useRef(false);

  const [state, setState] = useState<UseScript>({
    ready: false,
    error: null,
  });

  useEffect(() => {
    if (startLoading && !isLoading.current) {
      setTimeout(() => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          setState({ ready: true, error: null });
          onReady?.();
        };
        script.onerror = (error) => {
          setState({ ready: false, error });
          onError?.(error);
        };
        document.body.appendChild(script);
        isLoading.current = true;
      }, delay);
    }
  }, [startLoading, delay, src, onReady, onError]);

  return state;
};
