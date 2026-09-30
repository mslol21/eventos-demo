'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { useSiteData } from '@/lib/useSiteData';
import { ServiceOption } from '@/types';

interface ServicesListClientProps {
  initialServices: ServiceOption[];
}

export function ServicesListClient({ initialServices }: ServicesListClientProps) {
  const { services } = useSiteData();

  // Use live services from useSiteData if loaded, otherwise fallback to initialServices
  const activeServices = useMemo(() => {
    const list = services && services.length > 0 ? services : initialServices;
    return list.filter((s) => s.active !== false);
  }, [services, initialServices]);

  return (
    <div>
      {/* Quick jump anchor links */}
      <div className="flex flex-wrap gap-2 pt-6 mb-16 sm:mb-24">
        {activeServices.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E5DFD5] text-[#071E15] hover:border-[#C8521A] hover:text-[#C8521A] transition-colors shadow-xs"
          >
            {s.name}
          </a>
        ))}
      </div>

      {/* Detailed Editorial Service Showcase */}
      <div className="space-y-24 sm:space-y-36">
        {activeServices.map((service, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <article
              key={service.id}
              id={service.id}
              className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-20 border-b border-[#E5DFD5] last:border-b-0"
            >
              {/* Visual Imagery Column (6 cols) */}
              <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl bg-stone-200 mb-3">
                  <Image
                    src={service.heroImage}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Thumbnail gallery */}
                {service.gallery && service.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {service.gallery.map((thumb, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-200">
                        <Image
                          src={thumb}
                          alt={`${service.name} detalhe ${idx + 1}`}
                          fill
                          sizes="20vw"
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content & Details Column (6 cols) */}
              <div className={`lg:col-span-6 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#C8521A] font-bold block mb-2">
                    PACOTE OFICIAL {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#071E15] tracking-tight leading-tight">
                    {service.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8B7355] uppercase tracking-wider font-semibold mt-1">
                    {service.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#55635C] font-light leading-relaxed">
                  {service.fullDescription}
                </p>

                {/* Official Promo Highlight */}
                {service.basePriceCash && (
                  <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                    <p className="text-[11px] uppercase tracking-wider text-[#C8521A] font-semibold mb-1">
                      {service.priceNote || 'Promoção Divulgada (Até 50 convidados)'}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <span className="font-serif text-3xl font-semibold text-[#071E15]">
                        {service.installmentCount || 10}x de R$ {service.basePriceInstallments}
                      </span>
                      <span className="text-sm text-[#55635C]">
                        ou R$ {service.basePriceCash.toLocaleString('pt-BR')} à vista
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A8A82] italic">
                      * Valores demonstrativos sujeitos à confirmação conforme data, local e necessidades adicionais.
                    </p>
                  </div>
                )}

                {/* Included list */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-[#E5DFD5] space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#071E15]">
                    O que está incluso no pacote:
                  </h3>
                  <ul className="space-y-2 text-xs text-[#55635C]">
                    {service.includedItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-[#C8521A] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/monte-seu-evento?service=${service.id}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#071E15] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#124330] transition-colors active:scale-[0.98] shadow-md"
                  >
                    <span>Simular este buffet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/contato"
                    className="inline-flex items-center justify-center px-4 py-3 text-xs font-medium text-[#55635C] hover:text-[#071E15] underline underline-offset-4 decoration-[#E5DFD5] hover:decoration-[#071E15] transition-colors"
                  >
                    <span>Tirar dúvidas com a equipe</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
