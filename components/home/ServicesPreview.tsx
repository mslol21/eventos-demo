import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';

export function ServicesPreview() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#E0631B] font-bold mb-2">
            Cardápios Exclusivos
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Seu evento, nosso cuidado.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            Cardápios pensados para encantar seus convidados com frescor, sabor marcante e serviço impecável na sua casa, salão ou empresa.
          </p>
        </div>

        {/* 4 Culinary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service) => {
            return (
              <div
                key={service.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E9E2D7] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Banner */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={service.heroImage}
                    alt={`Buffet de ${service.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  {service.badge && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B2F21]/90 text-[#FAF8F5] border border-[#C5A059]/40 backdrop-blur-sm">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2F21] mb-2 group-hover:text-[#E0631B] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C6762] leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    {/* Highlights bullets */}
                    <div className="space-y-2 mb-6 pt-3 border-t border-[#F3EFE9]">
                      <div className="flex items-center gap-2 text-xs text-[#0B2F21]/80">
                        <Check className="w-3.5 h-3.5 text-[#E0631B] shrink-0" />
                        <span>{service.suggestedGuests}</span>
                      </div>
                      {service.basePriceCash && (
                        <div className="flex items-center gap-2 text-xs text-[#0B2F21]/80 font-medium">
                          <Check className="w-3.5 h-3.5 text-[#E0631B] shrink-0" />
                          <span>
                            A partir de 10x de R$ {service.basePriceInstallments}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      href={`/servicos#${service.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider border border-[#0B2F21] text-[#0B2F21] hover:bg-[#0B2F21] hover:text-white transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2F21]"
                    >
                      <span>Conhecer opção</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Demo Price Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#5C6762] italic">
            * Valores demonstrativos sujeitos à confirmação conforme data, quantidade de convidados e endereço do evento.
          </p>
        </div>
      </div>
    </section>
  );
}
