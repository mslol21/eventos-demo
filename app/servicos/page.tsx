import React from 'react';
import type { Metadata } from 'next';
import { SERVICES_DATA } from '@/data/services';
import { ServicesListClient } from '@/components/services/ServicesListClient';

export const metadata: Metadata = {
  title: 'Cardápios & Buffets a Domicílio',
  description:
    'Cardápios completos para festas e eventos em São Paulo: Churrasco na Brasa, Finger Foods & Coquetéis e Festival de Massas Artesanais com alimentação, equipe e descartáveis inclusos.',
};

export default function ServicosPage() {
  return (
    <div className="py-16 sm:py-28 bg-[#FAF7F2] text-[#121815]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Page Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
            GASTRONOMIA A DOMICÍLIO • SÃO PAULO & REGIÃO
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-[-0.03em] text-[#071E15] mb-6">
            Nossos Cardápios & Buffets.
          </h1>
          <p className="text-base sm:text-lg text-[#55635C] font-light leading-relaxed">
            Estrutura profissional, ingredientes de alta qualidade e serviço atencioso. Conforme divulgação oficial da SD Eventos, todos os pacotes incluem alimentação completa, bebidas não alcoólicas, equipe e descartáveis.
          </p>
        </div>

        {/* Dynamic & Reactive Services List */}
        <ServicesListClient initialServices={SERVICES_DATA} />
      </div>
    </div>
  );
}
