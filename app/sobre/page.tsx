import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre a SD Eventos | Hospitalidade e Buffet a Domicílio',
  description:
    'Conheça a história e os valores da SD Eventos: gastronomia artesanal, pontualidade rigorosa e atendimento acolhedor para celebrações inesquecíveis em São Paulo.',
};

const PILLARS = [
  {
    num: '01',
    title: 'Qualidade dos Insumos',
    desc: 'Ingredientes frescos selecionados, carnes nobres e massas artesanais salteadas na hora do evento.',
  },
  {
    num: '02',
    title: 'Pontualidade Rigorosa',
    desc: 'Chegada da equipe com antecedência para montagem meticulosa da área e início pontual do serviço.',
  },
  {
    num: '03',
    title: 'Equipe Uniformizada',
    desc: 'Profissionais alinhados, educados e dedicados a proporcionar uma recepção acolhedora a todos os convidados.',
  },
  {
    num: '04',
    title: 'Fartura & Cuidado',
    desc: 'Cálculos generosos por pessoa para assegurar que cada convidado seja servido com fartura e atenção contínua.',
  },
];

export function SobrePage() {
  return (
    <div className="py-16 sm:py-28 bg-[#FAF7F2] text-[#121815]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-24 sm:space-y-36">
        {/* Editorial Intro */}
        <div className="max-w-3xl">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
            NOSSA TRAJETÓRIA & PROPÓSITO
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-[-0.03em] text-[#071E15] mb-6">
            Mais do que servir comida, cuidamos de momentos felizes.
          </h1>
          <p className="text-base sm:text-lg text-[#55635C] font-light leading-relaxed">
            A SD Eventos nasceu da convicção de que quem convida merece celebrar junto aos seus familiares e amigos, sem a sobrecarga da cozinha ou a preocupação com o serviço.
          </p>
        </div>

        {/* Narrative & Full-Bleed Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-xl bg-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85"
                alt="Montagem de buffet e hospitalidade em evento da SD Eventos"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Hospitalidade levada ao seu espaço.
            </h2>
            <p className="text-sm sm:text-base text-[#55635C] font-light leading-relaxed">
              O que começou como comemorações intimistas entre amigos rapidamente expandiu-se para uma estrutura profissional de buffet a domicílio. Levamos a gastronomia completa para casas, salões de condomínio, chácaras e empresas.
            </p>
            <p className="text-sm sm:text-base text-[#55635C] font-light leading-relaxed">
              Nossa operação integra equipe treinada de churrasqueiros, cozinheiros e atendimento, cuidando do transporte dos insumos, preparação in loco e higienização durante o evento.
            </p>
            <div className="border-l-2 border-[#C8521A] pl-5 py-1">
              <p className="font-serif text-lg text-[#071E15] italic">
                &ldquo;Trabalhamos para que cada anfitrião possa apenas relaxar e desfrutar do carinho dos seus convidados.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars without artificial boxes */}
        <div>
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-2">
              PADRÃO OPERACIONAL
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#071E15]">
              Nossos quatro compromissos com o seu evento.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-[#E5DFD5]">
            {PILLARS.map((p) => (
              <div key={p.num} className="space-y-3">
                <span className="font-serif text-3xl text-[#C8521A] font-light block">
                  {p.num}
                </span>
                <h3 className="font-serif text-xl font-normal text-[#071E15]">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#55635C] font-light leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Closing Banner */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#071E15] text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-4xl font-normal mb-3">
              Vamos planejar sua comemoração?
            </h3>
            <p className="text-sm text-[#FAF8F5]/80 font-light leading-relaxed">
              Use nosso simulador digital para receber uma estimativa transparente ou converse diretamente com nossa equipe.
            </p>
          </div>

          <Link
            href="/monte-seu-evento"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#E0631B] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#C44E0F] transition-all shrink-0 active:scale-[0.98] shadow-xl"
          >
            <span>Montar meu evento</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SobrePage;
