import React from 'react';
import Link from 'next/link';
import { Utensils, CalendarDays, SlidersHorizontal, FileText, MessageSquare, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '1',
    title: 'Escolha seu buffet',
    description: 'Churrasco com carnes nobres, Coquetel com Finger Foods, Festival de Massas ou ilhas personalizadas.',
    icon: <Utensils className="w-6 h-6 text-[#E0631B]" />,
  },
  {
    step: '2',
    title: 'Informe os detalhes',
    description: 'Data desejada, horário aproximado, número de convidados e o bairro onde será realizada a comemoração.',
    icon: <CalendarDays className="w-6 h-6 text-[#E0631B]" />,
  },
  {
    step: '3',
    title: 'Personalize a experiência',
    description: 'Adicione bebidas geladas, sobremesas artesanais, choppeira, garçons extras ou louças completas com 1 clique.',
    icon: <SlidersHorizontal className="w-6 h-6 text-[#E0631B]" />,
  },
  {
    step: '4',
    title: 'Receba a estimativa',
    description: 'Veja um resumo organizado e uma estimativa de investimento calculada automaticamente sem esperar dias.',
    icon: <FileText className="w-6 h-6 text-[#E0631B]" />,
  },
  {
    step: '5',
    title: 'Finalize pelo WhatsApp',
    description: 'Envie tudo pronto e estruturado para nossa equipe no WhatsApp para validar disponibilidade e fechar sua data.',
    icon: <MessageSquare className="w-6 h-6 text-[#E0631B]" />,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-[#F3EFE9] border-y border-[#E9E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#E0631B] font-bold mb-2">
            Simples, Rápido e Sem Burocracia
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Organizar seu evento ficou mais fácil.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            Nada de formulários engessados ou dias esperando uma resposta. Você simula as opções no seu ritmo e recebe uma proposta pronta.
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {STEPS.map((item, idx) => {
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-6 border border-[#E9E2D7] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Step pill and Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-8 h-8 rounded-full bg-[#0B2F21] text-[#FAF8F5] font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#FFF6F0] border border-[#FFE6D6] group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0B2F21] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6762] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#C5A059]">
                    <ArrowRight className="w-5 h-5 opacity-40" />
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#0B2F21] text-white hover:bg-[#124330] shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span>Experimente o simulador agora</span>
            <ArrowRight className="w-4 h-4 text-[#E0631B]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
