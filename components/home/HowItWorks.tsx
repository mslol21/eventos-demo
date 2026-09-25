import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Escolha seu buffet',
    description: 'Churrasco com cortes nobres, Coquetel com Finger Foods, Festival de Massas ou ilhas personalizadas.',
  },
  {
    step: '02',
    title: 'Informe os detalhes',
    description: 'Data aproximada, horário de início, quantidade de convidados e o bairro onde será a comemoração.',
  },
  {
    step: '03',
    title: 'Personalize com adicionais',
    description: 'Adicione bebidas geladas, sobremesas artesanais, choppeira, garçons extras ou louças completas.',
  },
  {
    step: '04',
    title: 'Receba a estimativa',
    description: 'Veja um resumo organizado e uma estimativa calculada em tempo real com total transparência.',
  },
  {
    step: '05',
    title: 'Finalize pelo WhatsApp',
    description: 'Envie todas as informações organizadas para nossa equipe validar a data e confirmar os detalhes.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-[#F3EFE9] border-y border-[#E9E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#E0631B] font-bold mb-2">
            Simples, Rápido e Sem Burocracia
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Organizar seu evento ficou mais fácil.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            Nada de formulários intermináveis ou dias esperando por uma resposta. Você simula no seu ritmo e recebe uma proposta pronta.
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 relative">
          {STEPS.map((item, idx) => {
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between p-6 rounded-2xl bg-white/70 border border-[#E9E2D7]/80 hover:bg-white transition-colors duration-200"
              >
                <div>
                  {/* Step Numeral */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-[#C5A059] tracking-wider">
                      {item.step}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E0631B]" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0B2F21] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6762] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#C5A059]/40">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Action */}
        <div className="mt-14 text-center">
          <Link
            href="/monte-seu-evento"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#0B2F21] text-white hover:bg-[#124330] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2F21]"
          >
            <span>Experimente o simulador agora</span>
            <ArrowRight className="w-4 h-4 text-[#E0631B]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
