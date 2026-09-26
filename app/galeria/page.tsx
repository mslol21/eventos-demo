import React from 'react';
import { Metadata } from 'next';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { COMPANY_CONFIG } from '@/data/company';
import { InstagramIcon } from '@/components/ui/InstagramIcon';

export const metadata: Metadata = {
  title: 'Galeria de Fotos dos Nossos Eventos',
  description:
    'Veja fotos reais dos nossos buffets a domicílio: churrasco nobre na brasa, finger foods contemporâneos e festival de massas artesanais.',
};

export default function GaleriaPage() {
  return (
    <div className="py-16 sm:py-28 bg-[#FAF7F2] text-[#121815]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
            REGISTROS GASTRONÔMICOS & MONTAGENS
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight text-[#071E15] tracking-tight mb-4">
            Galeria de Eventos.
          </h1>
          <p className="text-base sm:text-lg text-[#55635C] font-light leading-relaxed mb-6">
            Confira detalhes da apresentação, suculência dos pratos e a dedicação da equipe SD Eventos nas mais variadas comemorações em São Paulo e região.
          </p>

          <a
            href={COMPANY_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#071E15] hover:text-[#C8521A] transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-[#C8521A]" />
            <span>Acompanhe mais no Instagram: {COMPANY_CONFIG.instagram} →</span>
          </a>
        </div>

        {/* Interactive Gallery */}
        <GalleryGrid />
      </div>
    </div>
  );
}
