import React from 'react';
import { Star, MessageSquareQuote, Info } from 'lucide-react';
import { TESTIMONIALS_DATA } from '@/data/testimonials';

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#E0631B] font-bold mb-2">
            Experiências Reais
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Quem contrata, recomenda.
          </h2>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            A satisfação dos nossos anfitriões e o sorriso dos convidados são a nossa maior assinatura.
          </p>

          {/* Ethical disclaimer badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#FFE6D6] text-xs text-[#C44E0F]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Exemplo de apresentação visual para pré-lançamento do sistema</span>
          </div>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-7 border border-[#E9E2D7] shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-8 h-8 text-[#E9E2D7]" />
                </div>

                <p className="text-sm text-[#5C6762] leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F3EFE9]">
                <h4 className="font-serif font-bold text-sm text-[#0B2F21]">
                  {t.name}
                </h4>
                <p className="text-xs text-[#C5A059] font-medium mt-0.5">
                  {t.eventType}
                </p>
                {t.isDemo && (
                  <span className="inline-block mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    • Demonstração
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
