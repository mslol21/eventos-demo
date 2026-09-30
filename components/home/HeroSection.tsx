'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '@/lib/useSiteData';

export function HeroSection() {
  const { company } = useSiteData();
  const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    'Olá! Gostaria de conversar com a SD Eventos sobre buffet para meu evento.'
  )}`;

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-end sm:items-center bg-[#071E15] text-white overflow-hidden pb-16 sm:pb-0">
      {/* Edge-to-Edge Dominant Gastronomy Photograph */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=2400&q=90"
          alt="Gastronomia refinada e mesa de buffet preparada pela SD Eventos"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
        />
        {/* Controlled Luxury Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#071E15]/95 via-[#071E15]/70 to-[#071E15]/30 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#071E15]/80" />
      </div>

      {/* Editorial Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-36 lg:pt-40">
        <div className="max-w-3xl lg:max-w-4xl">
          {/* Subtle Brand Origin Line */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8 text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#C5A059] font-medium">
            <span className="w-6 sm:w-8 h-px bg-[#C5A059]" />
            <span>SD EVENTOS • BUFFET A DOMICÍLIO</span>
          </div>

          {/* Monumental Editorial Headline */}
          <h1 className="font-serif text-[2.75rem] leading-[0.92] sm:text-6xl md:text-7xl lg:text-[5.75rem] xl:text-[6.75rem] font-normal tracking-[-0.03em] text-white mb-6 sm:mb-8">
            SABORES QUE<br />
            <span className="italic font-light text-[#FAF8F5]/90">ENCANTAM.</span><br />
            MOMENTOS<br />
            <span className="italic font-light text-[#E0631B]">QUE FICAM.</span>
          </h1>

          {/* Subtitle with High Legibility & Restraint */}
          <p className="text-sm sm:text-base lg:text-lg text-[#FAF8F5]/85 font-light leading-relaxed max-w-xl mb-8 sm:mb-10">
            Churrasco nobre na brasa, finger foods contemporâneos e massas artesanais preparados com excelência e hospitalidade onde você comemorar.
          </p>

          {/* Actions: Evident Primary + Discrete Secondary */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 pt-2">
            <Link
              href="/monte-seu-evento"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#E0631B] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#C44E0F] transition-all duration-200 active:scale-[0.98] shadow-xl hover:shadow-2xl"
            >
              <span>Monte seu evento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-[#FAF8F5]/80 hover:text-white underline underline-offset-8 decoration-white/30 hover:decoration-white transition-all tracking-wider uppercase font-medium py-2 sm:py-0"
            >
              <span>Fale no WhatsApp</span>
              <span className="text-xs">→</span>
            </a>
          </div>
        </div>

        {/* Quiet Editorial Footnote (Desktop) */}
        <div className="hidden lg:flex items-center justify-between border-t border-white/10 mt-20 pt-6 pb-8 text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/60">
          <div className="flex items-center gap-8">
            <span>São Paulo & Região Metropolitana</span>
            <span>•</span>
            <span>Alimentação, equipe e descartáveis inclusos</span>
          </div>
          <span className="font-mono text-[10px] text-[#C5A059]">@sdservicoseeventos</span>
        </div>
      </div>
    </section>
  );
}
