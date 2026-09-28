import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Architectural property view',
  fallbackTitle,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${containerClassName}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-200/60 animate-pulse" />
      )}

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 p-4 text-center border border-stone-200">
          <Building2 className="w-8 h-8 text-stone-400 mb-2 stroke-[1.5]" />
          <span className="text-xs font-medium text-stone-600 tracking-tight">
            {fallbackTitle || alt || 'Architectural View'}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">Verified Architectural Document</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
