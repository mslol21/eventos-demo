import React from 'react';
import { Metadata } from 'next';
import { EventBuilderWizard } from '@/components/event-builder/EventBuilderWizard';

export const metadata: Metadata = {
  title: 'Monte seu Evento | Simulador Digital de Buffet',
  description:
    'Simulador online oficial da SD Eventos. Escolha o cardápio, informe a quantidade de convidados, personalize opções e envie uma proposta organizada diretamente no WhatsApp.',
};

export default function MonteSeuEventoPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#121815]">
      {/* Editorial Gateway Intro Header */}
      <div className="pt-24 sm:pt-32 pb-4 text-center max-w-3xl mx-auto px-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C8521A] font-bold block mb-3">
          SIMULADOR DIGITAL • SD EVENTOS
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-[-0.03em] text-[#071E15] mb-4">
          Agora vamos falar sobre a sua festa.
        </h1>
        <p className="text-sm sm:text-base text-[#55635C] font-light leading-relaxed max-w-xl mx-auto">
          Responda às etapas abaixo para calcular sua estimativa em tempo real e receber uma proposta personalizada no WhatsApp.
        </p>
      </div>

      <EventBuilderWizard />
    </div>
  );
}
