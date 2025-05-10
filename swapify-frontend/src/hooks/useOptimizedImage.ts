// src/hooks/useOptimizedImage.ts

interface OptimizationOptions {
    quality?: 'auto' | string;
    format?: 'auto' | string;
    width?: number;
    height?: number;
    crop?: 'limit' | 'fill' | 'fit' | string;
  }
  
  export default function useOptimizedImage(
    originalUrl: string,
    options: OptimizationOptions = {}
  ): string {
    if (!originalUrl || !originalUrl.includes('/upload/')) return originalUrl;
  
    const {
      quality = 'auto',
      format = 'auto',
      width,
      height,
      crop = 'limit'
    } = options;
  
    const transformation = [
      `q_${quality}`,
      `f_${format}`,
      width ? `w_${width}` : null,
      height ? `h_${height}` : null,
      (width || height) ? `c_${crop}` : null
    ]
      .filter(Boolean)
      .join(',');
  
    return originalUrl.replace('/upload/', `/upload/${transformation}/`);
  }  