import { SyntheticEvent, useEffect } from 'react';
import useBoolean from './useBoolean';

export const useImage = (
  src: string | undefined,
  onLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void,
  onError?: (e: string | SyntheticEvent<HTMLImageElement, Event>) => void,
) => {
  const { setTrue, setFalse, value } = useBoolean(!!src);

  useEffect(() => {
    if (!src) {
      setFalse();
    }
  }, [setFalse, src]);

  return {
    imageVisible: value,
    bindToImage: {
      hidden: !value,
      onLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        setTrue();
        onLoad && onLoad(e);
      },
      onError(e: string | SyntheticEvent<HTMLImageElement, Event>) {
        setTrue();
        onError && onError(e);
      },
      src,
    },
  };
};
