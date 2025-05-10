// src/components/OptimizedImage.tsx
// Componente para imágenes optimizadas
import React from 'react';
import useOptimizedImage from '../hooks/useOptimizedImage';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  crop?: 'limit' | 'fill' | 'fit' | string;
  quality?: string;
  format?: string;
}

const OptimizedImage: React.FC<Props> = ({
  src,
  width,
  height,
  crop,
  quality,
  format,
  ...rest
}) => {
  const optimizedSrc = useOptimizedImage(src, {
    width,
    height,
    crop,
    quality,
    format,
  });

  return <img src={optimizedSrc} loading="lazy" {...rest} />;
};

export default OptimizedImage;