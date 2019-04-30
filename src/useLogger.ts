/* eslint-disable no-console */
import { useEffect } from 'react';

export function useLogger(name: string, props: any): void {
  useEffect(() => {
    console.log(`${name} has mounted`);
    return () => console.log(`${name} has unmounted`);
  }, [name]);
  useEffect(() => {
    console.log('Props updated', props);
  });
}

export default useLogger;
