import { useEffect, useState } from 'react';

export const useDelay = (delay: number = 0) => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setDone(true);
    }, delay);
  }, []);
  return done;
};
