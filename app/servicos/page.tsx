import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Check, X, Info, CalendarClock, Sparkles, Users, Clock, AlertCircle } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';
import { ADDONS_DATA } from '@/data/addons';

export const metadata: Metadata = {
  title: 'Buffets e Cardápios Exclusivos',
  description:
    'Conheça nossos cardápios completos para buffet a domicílio: Churrasco Nobre, Finger Foods & Coquetéis, Festival de Massas Artesanais e Menus Personalizados.',
};

export default function ServicosPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#1E694D] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E0631B]" />
            <span>Cardápios Completos & Transparentes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Nossos Buffets a Domicílio
          </h1>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            Estrutura profissional, ingredientes selecionados e preparo ao vivo. Entenda detalhadamente o que está incluso em cada experiência.
          </p>

          {/* Quick jump anchor links */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {SERVICES_DATA.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E9E2D7] text-[#0B2F21] hover:border-[#E0631B] hover:text-[#E0631B] transition-all shadow-xs"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Global Demo Note Banner */}
        <div className="mb-12 p-4 rounded-2xl bg-[#FFF6F0] border border-[#FFE6D6] flex items-start gap-3 max-w-4xl mx-auto">
          <Info className="w-5 h-5 text-[#E0631B] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#5C6762]">
            <p className="font-semibold text-[#0B2F21]">
              Transparência na contratação:
            </p>
            <p>
              Os valores apresentados abaixo são demonstrativos e servem como referência para pacotes padrão de até 50 pessoas. No simulador você personaliza o número exato de convidados e adicionais para obter sua estimativa em tempo real.
            </p>
          </div>
        </div>

        {/* Detailed Services List */}
        <div className="space-y-16">
          {SERVICES_DATA.map((service, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <section
                key={service.id}
                id={service.id}
                className="scroll-mt-28 bg-white rounded-3xl border border-[#E9E2D7] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Hero / Main Header Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Service Image & Mini Gallery */}
                  <div className={`lg:col-span-6 relative flex flex-col ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={service.heroImage}
                        alt={`Buffet ${service.name}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      {service.badge && (
                        <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B2F21]/95 text-white border border-[#C5A059]/40 backdrop-blur-sm">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-4 gap-2 p-3 bg-[#FAF8F5] border-t border-[#E9E2D7]">
                      {service.gallery.map((thumb, idx) => (
                        <div key={idx} className="relative h-16 sm:h-20 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={thumb}
                            alt={`${service.name} detalhe ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 25vw, 12vw"
                            className="object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Details */}
                  <div className={`lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between ${isReversed ? 'lg:order-1' : ''}`}>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
                        {service.tagline}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B2F21] mt-1 mb-3">
                        {service.name}
                      </h2>
                      <p className="text-sm sm:text-base text-[#5C6762] leading-relaxed mb-6">
                        {service.fullDescription}
                      </p>

                      {/* Guest suggestions & Timing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7]">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#0B2F21]">
                          <Users className="w-4 h-4 text-[#E0631B] shrink-0" />
                          <span>{service.suggestedGuests}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#0B2F21]">
                          <Clock className="w-4 h-4 text-[#E0631B] shrink-0" />
                          <span>4h a 4h30 de serviço contínuo</span>
                        </div>
                      </div>

                      {/* Pricing Highlight Box */}
                      {service.basePriceCash ? (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF6F0] to-[#FAF8F5] border border-[#FFE6D6] mb-6">
                          <p className="text-xs text-[#C44E0F] font-bold uppercase tracking-wider mb-1">
                            Pacote Promocional Demonstrativo (até 50 convidados)
                          </p>
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0B2F21]">
                              10x de R$ {service.basePriceInstallments}
                            </span>
                            <span className="text-sm text-[#5C6762]">
                              ou <strong className="text-[#0B2F21]">R$ {service.basePriceCash?.toLocaleString('pt-BR')}</strong> à vista
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C6762] mt-1 italic">
                            * Valores demonstrativos sujeitos à confirmação.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7] mb-6">
                          <p className="text-sm font-semibold text-[#0B2F21]">
                            Orçamento Sob Medida
                          </p>
                          <p className="text-xs text-[#5C6762] mt-0.5">
                            Formulação de menu e custos conforme formato e preferências do anfitrião.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div>
                      <Link
                        href={`/monte-seu-evento?servico=${service.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] shadow hover:shadow-lg transition-all duration-200"
                      >
                        <CalendarClock className="w-4 h-4" />
                        <span>Montar meu evento com este buffet</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Tabs / Accordion of What's Included, Not Included, and Observations */}
                <div className="border-t border-[#E9E2D7] p-6 sm:p-10 bg-[#FCFBF9]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* What is Included */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                          <Check className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#0B2F21]">
                          O que está incluso
                        </h3>
                      </div>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C6762]">
                        {service.includedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What is Not Included */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                          <X className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#0B2F21]">
                          O que não está incluso (disponível à parte)
                        </h3>
                      </div>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C6762]">
                        {service.notIncludedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Observations note */}
                      <div className="pt-4 mt-4 border-t border-[#E9E2D7]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2F21] mb-2 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Observações de atendimento</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-[#5C6762]">
                          {service.observations.map((obs, idx) => (
                            <li key={idx}>• {obs}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Available Addons Pills */}
                  <div className="mt-8 pt-6 border-t border-[#E9E2D7]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0B2F21] mb-3">
                      Adicionais disponíveis para este buffet:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.availableAddons.map((addonId) => {
                        const addon = ADDONS_DATA.find((a) => a.id === addonId);
                        if (!addon) return null;
                        return (
                          <span
                            key={addon.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white border border-[#E9E2D7] text-[#0B2F21]"
                          >
                            <span className="text-[#E0631B] font-bold">+</span>
                            <span>{addon.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
