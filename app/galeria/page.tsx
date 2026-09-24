import React from 'react';
import { Metadata } from 'next';
import { Camera } from 'lucide-react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = {
  title: 'Galeria de Fotos dos Nossos Eventos',
  description:
    'Veja fotos reais de nossos buffets a domicílio: churrascos, finger foods requintados, festivais de massas e montagens de mesas para festas.',
};

export default function GaleriaPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] text-[#E0631B] text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Nossos Registros</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Galeria de Eventos
          </h1>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            Confira detalhes da apresentação, suculência dos pratos e o capricho da equipe SD Eventos nas mais variadas comemorações.
          </p>
        </div>

        {/* Interactive Gallery */}
        <GalleryGrid />
      </div>
    </div>
  );
}
