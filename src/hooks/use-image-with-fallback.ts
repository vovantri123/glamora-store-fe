import { useState } from 'react';

export function useImageWithFallback(
  initialSrc: string,
  fallbackSrc = '/placeholder.png'
) {
  const [src, setSrc] = useState(initialSrc);

  const handleError = () => {
    if (src !== fallbackSrc) {
      setSrc(fallbackSrc);
    }
  };

  return { src, handleError };
}
