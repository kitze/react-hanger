import { SyntheticEvent, useEffect } from 'react';
import useBoolean from 'useBoolean';

export const useImage = (
  src: string | undefined,
  onLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void,
  onError?: (e: string | SyntheticEvent<HTMLImageElement, Event>) => void,
) => {
  const showImage = useBoolean(!!src);

  useEffect(() => {
    if (!src) {
      showImage.setFalse();
    }
  }, [src]);

  return {
    imageVisible: showImage.value,
    bindToImage: {
      hidden: !showImage.value,
      onLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        showImage.setTrue();
        onLoad && onLoad(e);
      },
      onError(e: string | SyntheticEvent<HTMLImageElement, Event>) {
        showImage.setTrue();
        onError && onError(e);
      },
      src,
    },
  };
};
