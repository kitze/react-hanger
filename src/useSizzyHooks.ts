import { useState, useEffect, useCallback, RefObject } from 'react';

export const useCanHover = () => {
  // assume that if device is smaller than 500 there's no hover, but actually check it on the first touch event
  const [canHover, setCanHover] = useState(window.innerWidth > 500);
  useEffect(() => {
    // mobile devices also emit a "mousemove" on every touch (#theplatform<3), but desktop devices don't emit "touchstart"
    const eventName = 'touchstart';
    window.addEventListener(
      eventName,
      function onFirstTouch() {
        setCanHover(false);
        window.removeEventListener(eventName, onFirstTouch, false);
      },
      false,
    );
  }, []);
  return canHover;
};

export const useHovered = () => {
  const [hovering, setHovering] = useState(false);
  const canHover = useCanHover();

  return {
    value: hovering,
    setValue: setHovering,
    bind: canHover
      ? {
          onMouseOver: () => setHovering(true),
          onMouseLeave: () => setHovering(false),
        }
      : {
          onClick: () => setHovering((h) => !h),
        },
  };
};

export const usePose = (initial: string, poses: object = {}) => {
  const [pose, setPose] = useState(initial);
  return { pose, setPose, poses };
};

export const useVisiblePose = (initial: any) => {
  const VISIBLE = 'visible';
  const HIDDEN = 'hidden';
  const { setPose, pose, ...rest } = usePose(initial ? VISIBLE : HIDDEN, [HIDDEN, VISIBLE]);
  return [pose, (v: any) => setPose(v ? VISIBLE : HIDDEN), rest];
};

export const useFindElementCenter = (elementRef: RefObject<HTMLElement>) => {
  const [windowSize, setWindowSize] = useState<{ x: number; y: number }>();
  useEffect(() => {
    if (elementRef.current) {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = elementRef.current;
      setWindowSize({
        x: window.innerWidth / 2 - offsetWidth / 2 - offsetLeft,
        y: window.innerHeight / 2 - offsetHeight / 2 - offsetTop,
      });
    }
  }, [elementRef]);
  return windowSize;
};

export const useMousePosition = (shouldTrack: boolean) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canHover = useCanHover();

  useEffect(() => {
    if (canHover && shouldTrack) {
      const handler = ({ clientX, clientY }: { clientX: number; clientY: number }) => {
        setMousePosition({
          x: clientX,
          y: clientY,
        });
      };
      window.document.addEventListener('mousemove', handler);
      return () => window.document.removeEventListener('mousemove', handler);
    }
    return () => {};
  }, [canHover, shouldTrack]);

  return canHover ? mousePosition : {};
};

export type TimeFormattingFunction = (date: Date) => string;

export const useClock = (
  timeFormattingFunction: TimeFormattingFunction = (date) => date.toLocaleDateString(),
) => {
  const getCurrentTime = useCallback(() => timeFormattingFunction(new Date()), [timeFormattingFunction]);
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 1000);

    return () => clearInterval(t);
  }, [getCurrentTime]);

  return time;
};
