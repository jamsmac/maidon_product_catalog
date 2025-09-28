import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { ImageSkeleton } from './Skeleton';

/**
 * ProgressiveImage component - loads low quality image first, then high quality
 * @param {Object} props
 * @param {string} props.src - High quality image URL
 * @param {string} [props.placeholder] - Low quality placeholder (blur/base64/small image)
 * @param {string} [props.alt] - Alt text for the image
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onLoad] - Callback when image loads
 * @param {Function} [props.onError] - Callback when image fails to load
 * @param {boolean} [props.showSkeleton=true] - Show skeleton while loading
 * @param {string} [props.skeletonClassName] - ClassName for skeleton
 * @param {Object} props - Other img props
 */
const ProgressiveImage = ({
  src,
  placeholder,
  alt = '',
  className,
  onLoad,
  onError,
  showSkeleton = true,
  skeletonClassName,
  ...props
}) => {
  const [loadingState, setLoadingState] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);

  const handleLoad = useCallback(() => {
    if (currentSrc === placeholder && src !== placeholder) {
      // Load high quality image
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setLoadingState('loaded');
        onLoad?.();
      };
      img.onerror = () => {
        setLoadingState('error');
        onError?.();
      };
      img.src = src;
    } else {
      setLoadingState('loaded');
      onLoad?.();
    }
  }, [currentSrc, placeholder, src, onLoad, onError]);

  const handleError = useCallback(() => {
    setLoadingState('error');
    onError?.();
  }, [onError]);

  const handlePlaceholderLoad = useCallback(() => {
    if (placeholder && src !== placeholder) {
      // Start loading high quality image
      handleLoad();
    } else {
      handleLoad();
    }
  }, [placeholder, src, handleLoad]);

  if (loadingState === 'loading' && showSkeleton) {
    return <ImageSkeleton className={skeletonClassName} />;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        loadingState === 'loaded' ? 'opacity-100' : 'opacity-0',
        className
      )}
      onLoad={currentSrc === placeholder ? handlePlaceholderLoad : handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

/**
 * ImageWithFallback component - shows fallback when image fails to load
 * @param {Object} props
 * @param {string} props.src - Image source
 * @param {string} [props.fallbackSrc='/assets/images/no_image.png'] - Fallback image
 * @param {string} [props.alt] - Alt text
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onError] - Callback when image fails
 * @param {Object} props - Other img props
 */
const ImageWithFallback = ({
  src,
  fallbackSrc = '/assets/images/no_image.png',
  alt = '',
  className,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
      onError?.();
    }
  }, [fallbackSrc, hasError, onError]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

/**
 * OptimizedImage component - combines progressive loading with lazy loading
 * @param {Object} props
 * @param {string} props.src - High quality image URL
 * @param {string} [props.placeholder] - Low quality placeholder
 * @param {string} [props.alt] - Alt text
 * @param {boolean} [props.lazy=true] - Enable lazy loading
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} props - Other img props
 */
const OptimizedImage = ({
  src,
  placeholder,
  alt = '',
  lazy = true,
  className,
  ...props
}) => {
  if (lazy) {
    return (
      <LazyImage
        src={src}
        placeholder={placeholder}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  return (
    <ProgressiveImage
      src={src}
      placeholder={placeholder}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

/**
 * LazyImage component - intersection observer based lazy loading
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} [props.placeholder] - Placeholder image
 * @param {string} [props.alt] - Alt text
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} props - Other img props
 */
const LazyImage = ({
  src,
  placeholder,
  alt = '',
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imgRef, setImgRef] = useState(null);

  React.useEffect(() => {
    if (!imgRef || !lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef);
    return () => observer.disconnect();
  }, [imgRef]);

  return (
    <div ref={setImgRef} className={className}>
      {isVisible ? (
        <ProgressiveImage
          src={src}
          placeholder={placeholder}
          alt={alt}
          className="w-full h-full"
          {...props}
        />
      ) : placeholder ? (
        <img
          src={placeholder}
          alt={alt}
          className="w-full h-full blur-sm"
          {...props}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

/**
 * ResponsiveImage component - loads different images for different screen sizes
 * @param {Object} props
 * @param {Object} props.src - Object with breakpoints { sm, md, lg, xl }
 * @param {string} [props.alt] - Alt text
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} props - Other img props
 */
const ResponsiveImage = ({
  src,
  alt = '',
  className,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src.md || src.lg || src.sm);

  React.useEffect(() => {
    const updateSrc = () => {
      const width = window.innerWidth;
      if (width >= 1280 && src.xl) {
        setCurrentSrc(src.xl);
      } else if (width >= 1024 && src.lg) {
        setCurrentSrc(src.lg);
      } else if (width >= 768 && src.md) {
        setCurrentSrc(src.md);
      } else {
        setCurrentSrc(src.sm || src.md || src.lg || src.xl);
      }
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);
    return () => window.removeEventListener('resize', updateSrc);
  }, [src]);

  return (
    <ProgressiveImage
      src={currentSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default ProgressiveImage;
export {
  ProgressiveImage,
  ImageWithFallback,
  OptimizedImage,
  LazyImage,
  ResponsiveImage
};
