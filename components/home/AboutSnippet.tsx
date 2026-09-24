import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, HeartHandshake, ChefHat, Sparkles } from 'lucide-react';

export function AboutSnippet() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagery Composition */}
          <div className="relative">
            <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
                alt="Equipe SD Eventos montando buffet completo em evento particular"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2F21]/80 via-transparent to-transparent" />
            </div>

            {/* Floating gastronomic highlight badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-[#E9E2D7] max-w-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF6F0] flex items-center justify-center shrink-0">
                <ChefHat className="w-6 h-6 text-[#E0631B]" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-[#0B2F21]">Gastronomia Afetiva</p>
                <p className="text-xs text-[#5C6762]">Ingredientes frescos preparados na hora do evento.</p>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#1E694D] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E0631B]" />
              <span>Nossa Essência</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2F21] tracking-tight leading-tight">
              Mais do que servir comida, ajudamos a criar momentos.
            </h2>

            <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
              A <strong className="text-[#0B2F21] font-semibold">SD Eventos</strong> nasceu da paixão por reunir pessoas ao redor de uma boa mesa. Acreditamos que o anfitrião merece viver a sua festa com tranquilidade, sabendo que cada detalhe — do ponto da carne ao sorriso da equipe — está sendo cuidado com maestria.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E9E2D7]">
                <HeartHandshake className="w-5 h-5 text-[#E0631B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#0B2F21]">Hospitalidade Genuína</h4>
                  <p className="text-xs text-[#5C6762] mt-0.5">Equipe atenciosa, cordial e pronta para acolher seus convidados.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E9E2D7]">
                <ShieldCheck className="w-5 h-5 text-[#E0631B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#0B2F21]">Pontualidade & Padrão</h4>
                  <p className="text-xs text-[#5C6762] mt-0.5">Chegada com antecedência e estrutura impecável no local.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 font-bold text-sm text-[#0B2F21] hover:text-[#E0631B] transition-colors group"
              >
                <span>Conheça toda a história da SD Eventos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
