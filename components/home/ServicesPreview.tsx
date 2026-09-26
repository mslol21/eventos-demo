'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

interface EditorialServiceItem {
  number: string;
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  priceNote: string;
  installments: string;
  cashPrice: string;
  included: string[];
}

const EDITORIAL_SERVICES: EditorialServiceItem[] = [
  {
    number: '01',
    id: 'churrasco',
    name: 'Churrasco Completo na Brasa',
    subtitle: 'EXPERIÊNCIA AO VIVO • CORTES SELECIONADOS',
    description:
      'Uma estação completa de churrascaria levada até o seu evento. Carnes assadas no ponto desejado, guarnições frescas e serviço contínuo para você celebrar com total tranquilidade.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=85',
    priceNote: 'Pacote promocional para até 50 pessoas',
    installments: '10x de R$ 380',
    cashPrice: 'R$ 3.500 à vista',
    included: [
      'Alimentação completa preparada na brasa no local',
      'Bebidas não alcoólicas inclusas no pacote',
      'Equipe profissional de churrasqueiro e suporte',
      'Descartáveis completos fornecidos para o buffet',
    ],
  },
  {
    number: '02',
    id: 'finger-foods',
    name: 'Finger Foods & Coquetel Volante',
    subtitle: 'SOFISTICAÇÃO DINÂMICA • COQUETELARIA & CANAPÉS',
    description:
      'Canapés contemporâneos, folhados finos e mini porções quentes servidas continuamente. Ideal para comemorações dinâmicas onde os convidados circulam e conversam livremente.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1600&q=85',
    priceNote: 'Pacote promocional para até 50 pessoas',
    installments: '10x de R$ 300',
    cashPrice: 'R$ 2.750 à vista',
    included: [
      'Canapés finos e mini porções quentes salteadas',
      'Bebidas não alcoólicas inclusas no pacote',
      'Equipe dedicada de serviço e atendimento volante',
      'Descartáveis e utensílios adequados para finger tasting',
    ],
  },
  {
    number: '03',
    id: 'festival-de-massas',
    name: 'Festival de Massas Artesanais',
    subtitle: 'ESTAÇÃO INTERATIVA TRATTORIA • AO VIVO',
    description:
      'Massas frescas cozidas na hora com estação ao vivo. Cada convidado escolhe seu formato de massa favorito e combina com molhos aromáticos e ingredientes preparados na sua frente.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1600&q=85',
    priceNote: 'Pacote promocional para até 50 pessoas',
    installments: '10x de R$ 280',
    cashPrice: 'R$ 2.500 à vista',
    included: [
      'Massas artesanais frescas com variedade de molhos',
      'Bebidas não alcoólicas inclusas no pacote',
      'Equipe de chefs para finalização na hora',
      'Descartáveis e estrutura de réchauds inclusos',
    ],
  },
];

export function ServicesPreview() {
  return (
    <section className="bg-[#FAF7F2] py-24 sm:py-36 text-[#121815] border-t border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Introduction */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-4">
            GASTRONOMIA & FORMATOS DE ATENDIMENTO
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-[-0.02em] text-[#071E15] mb-6">
            Estrutura profissional, ingredientes selecionados e preparo ao vivo.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#55635C] font-light leading-relaxed">
            Eliminamos surpresas e perguntas repetitivas com cardápios transparentes, equipe uniformizada e pacotes completos para o seu evento.
          </p>
        </div>

        {/* Editorial Alternating Rhythm (55-65% Image vs Editorial Details) */}
        <div className="space-y-28 sm:space-y-40">
          {EDITORIAL_SERVICES.map((item, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <article
                key={item.id}
                id={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Large Editorial Image (58% desktop width) */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl bg-stone-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    
                    {/* Discrete Editorial Corner Watermark */}
                    <span className="absolute bottom-4 left-5 text-[11px] uppercase tracking-[0.2em] font-mono text-white/80">
                      SD EVENTOS • {item.name}
                    </span>
                  </div>
                </div>

                {/* Editorial Content (42% desktop width) */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {/* Service Number Accent */}
                  <span className="font-serif text-3xl sm:text-4xl text-[#C8521A] font-light mb-2">
                    {item.number}
                  </span>

                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8B7355] mb-2">
                    {item.subtitle}
                  </p>

                  <h3 className="font-serif text-2xl sm:text-4xl font-normal text-[#071E15] tracking-tight leading-tight mb-4">
                    {item.name}
                  </h3>

                  <p className="text-sm sm:text-base text-[#55635C] font-light leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Confirmed Promo Box (Official client pricing) */}
                  <div className="p-5 rounded-xl bg-white border border-[#E5DFD5] mb-6 shadow-xs">
                    <p className="text-[11px] uppercase tracking-wider text-[#C8521A] font-semibold mb-1">
                      {item.priceNote}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#071E15]">
                        {item.installments}
                      </span>
                      <span className="text-xs text-[#55635C]">
                        ou {item.cashPrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A8A82] italic">
                      * Valores demonstrativos sujeitos à confirmação conforme data e local.
                    </p>
                  </div>

                  {/* Included Essentials List */}
                  <div className="space-y-2 mb-8">
                    {item.included.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#071E15]/85">
                        <Check className="w-3.5 h-3.5 text-[#C8521A] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Editorial Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                      href={`/monte-seu-evento?service=${item.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#071E15] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#124330] transition-colors active:scale-[0.98]"
                    >
                      <span>Simular este buffet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/servicos#${item.id}`}
                      className="inline-flex items-center justify-center px-4 py-3 text-xs font-medium text-[#55635C] hover:text-[#071E15] underline underline-offset-4 decoration-[#E5DFD5] hover:decoration-[#071E15] transition-colors"
                    >
                      <span>Ver detalhes do cardápio</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Custom Events Editorial Banner (Discreet & Premium) */}
        <div className="mt-32 p-8 sm:p-12 rounded-3xl bg-[#071E15] text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-2">
              FORMATOS ESPECIAIS & CASAMENTOS
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal mb-4">
              Precisa de um cardápio híbrido ou ilhas gastronômicas?
            </h3>
            <p className="text-sm sm:text-base text-[#FAF8F5]/80 font-light leading-relaxed mb-6">
              Montamos cardápios personalizados combinando churrasco com ilhas de massas, queijos e antepastos nobres para casamentos e confraternizações sob medida.
            </p>
            <Link
              href="/monte-seu-evento?service=eventos-personalizados"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#E0631B] hover:text-white transition-colors"
            >
              <span>Personalizar meu evento exclusivo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
