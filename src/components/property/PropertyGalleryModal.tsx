import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface PropertyGalleryModalProps {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  title: string;
}

export const PropertyGalleryModal: React.FC<PropertyGalleryModalProps> = ({
  images,
  activeIndex,
  onClose,
  onSelectIndex,
  title,
}) => {
  const handlePrev = useCallback(() => {
    onSelectIndex((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    onSelectIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onSelectIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md">
      {/* Top Header */}
      <div className="flex items-center justify-between text-white border-b border-stone-800 pb-4">
        <div>
          <h4 className="text-sm font-semibold tracking-tight text-white">{title}</h4>
          <span className="text-xs text-stone-400 font-mono">
            Plate {activeIndex + 1} of {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label="Close fullscreen gallery"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Main Image Viewport with Nav Arrows */}
      <div className="relative flex-1 flex items-center justify-center py-4 overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-10 p-3 bg-black/90 hover:bg-black text-white border border-white/10 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1.5] text-white" />
        </button>

        <div className="max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center p-2">
          <ImageWithFallback
            src={images[activeIndex]}
            alt={`${title} - view ${activeIndex + 1}`}
            containerClassName="w-full h-full max-h-[75vh] flex items-center justify-center bg-transparent"
            className="w-auto h-auto max-h-[75vh] max-w-full object-contain"
          />
        </div>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-10 p-3 bg-black/90 hover:bg-black text-white border border-white/10 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 stroke-[1.5] text-white" />
        </button>
      </div>

      {/* Thumbnails strip */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectIndex(idx)}
            className={`w-16 h-12 shrink-0 border overflow-hidden transition-all ${
              idx === activeIndex
                ? 'border-white opacity-100'
                : 'border-stone-800 opacity-50 hover:opacity-80'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
