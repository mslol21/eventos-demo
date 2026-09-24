'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_DATA } from '@/data/gallery';
import { GalleryCategory, GalleryItem } from '@/types';

const CATEGORIES: Array<'Todas' | GalleryCategory> = [
  'Todas',
  'Buffets',
  'Churrascos',
  'Finger Foods',
  'Massas',
  'Eventos',
  'Montagens',
];

export function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | GalleryCategory>('Todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === 'Todas'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.category === selectedCategory);

  const currentItem: GalleryItem | null =
    lightboxIndex !== null ? filteredItems[lightboxIndex] || null : null;

  const handleNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setLightboxIndex(null);
              }}
              type="button"
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B2F21] text-white shadow-md'
                  : 'bg-white border border-[#E9E2D7] text-[#5C6762] hover:text-[#0B2F21] hover:border-[#0B2F21]/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          return (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-80 w-full rounded-2xl overflow-hidden bg-gray-100 border border-[#E9E2D7] cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category pill */}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 text-[#0B2F21] backdrop-blur-xs">
                {item.category}
              </span>

              {/* Title & expand icon */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif font-bold text-base sm:text-lg mb-1 group-hover:text-[#E0631B] transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-white/80 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização detalhada da foto"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            type="button"
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Fechar galeria"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Image Container */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[70vh] max-w-4xl">
              <Image
                src={currentItem.imageUrl}
                alt={currentItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Captions */}
            <div className="mt-4 text-center text-white max-w-lg">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#E0631B]">
                {currentItem.category} • {lightboxIndex! + 1} de {filteredItems.length}
              </span>
              <h4 className="font-serif font-bold text-xl sm:text-2xl mt-1">
                {currentItem.title}
              </h4>
              {currentItem.description && (
                <p className="text-sm text-gray-300 mt-1">
                  {currentItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
