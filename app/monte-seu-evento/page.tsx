import React from 'react';
import { Metadata } from 'next';
import { EventBuilderWizard } from '@/components/event-builder/EventBuilderWizard';

export const metadata: Metadata = {
  title: 'Monte seu Evento | Simulador de Buffet a Domicílio',
  description:
    'Simule os valores e personalize os detalhes da sua comemoração. Escolha o cardápio, informe a quantidade de convidados e receba a estimativa instantânea no WhatsApp.',
};

export default function MonteSeuEventoPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <EventBuilderWizard />
    </div>
  );
}
