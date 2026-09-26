'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const CONCIERGE_STEPS = [
  { num: '01', title: 'Ocasião', desc: 'Aniversário, casamento ou confraternização' },
  { num: '02', title: 'Cardápio', desc: 'Churrasco, Finger Foods ou Massas' },
  { num: '03', title: 'Convidados', desc: 'Quantidade exata para sua festa' },
  { num: '04', title: 'Data & Hora', desc: 'Previsão de calendário e montagem' },
  { num: '05', title: 'Local', desc: 'São Paulo, ABC e Região Metropolitana' },
  { num: '06', title: 'Opcionais', desc: 'Chopp, sobremesas ou louças sob consulta' },
  { num: '07', title: 'Resumo & WhatsApp', desc: 'Estimativa transparente enviada em 1 clique' },
];

export function HowItWorks() {
  return (
    <section className="bg-[#071E15] text-white py-24 sm:py-36 relative overflow-hidden">
      {/* Delicate Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8521A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Striking Visual Transition Headline */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E0631B]" />
            <span>SIMULADOR DIGITAL • EXPERIÊNCIA TRANSPARENTE</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-[-0.03em] mb-6">
            Agora vamos falar sobre a sua festa.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#FAF8F5]/80 font-light leading-relaxed max-w-2xl">
            Sem dias de espera ou perguntas repetitivas no chat. Escolha seu buffet, informe os convidados e veja o cálculo inicial pronto para validação da equipe.
          </p>
        </div>

        {/* Elegant Minimalist Flow Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-16">
          {CONCIERGE_STEPS.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#C5A059]/40 hover:bg-white/[0.07] transition-all duration-200 flex flex-col justify-between"
            >
              <span className="font-mono text-xs text-[#C5A059] font-bold mb-3 block">
                {step.num}
              </span>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#FAF8F5]/60 font-light leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* High-Impact Centered Gateway CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/10">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-2 text-white">
              Pronto para montar o seu orçamento?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 font-light">
              Leva menos de 2 minutos e não exige cadastro demorado.
            </p>
          </div>

          <Link
            href="/monte-seu-evento"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#E0631B] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#C44E0F] transition-all duration-200 active:scale-[0.98] shadow-xl shrink-0"
          >
            <span>Iniciar simulador do evento</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
