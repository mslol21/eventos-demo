import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarClock, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONFIG } from '@/data/company';

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(
    COMPANY_CONFIG.defaultMessageTemplate
  )}`;

  return (
    <section className="relative min-h-[88vh] lg:min-h-[92vh] flex items-center justify-center bg-[#072017] text-white overflow-hidden">
      {/* Background Gastronomic Image with Warm Vignette & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=2000&q=85"
          alt="Mesa farta de buffet gastronômico requintado preparado pela SD Eventos"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 transform scale-105 transition-transform duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072017] via-[#0B2F21]/80 to-[#072017]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#072017]/40 to-[#072017]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#124330]/80 border border-[#C5A059]/40 text-[#E9E2D7] text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Buffet a Domicílio em São Paulo & Região</span>
        </div>

        {/* Brand Name & Primary Headline */}
        <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold text-[#E0631B] mb-3">
          SD EVENTOS
        </h2>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight lg:leading-tight mb-6 max-w-4xl">
          SABORES QUE ENCANTAM.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF8F5] via-[#E9E2D7] to-[#C5A059]">
            MOMENTOS QUE FICAM.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-[#FAF8F5]/90 max-w-2xl font-light leading-relaxed mb-10">
          Buffet a domicílio para transformar sua comemoração em uma experiência especial. Cardápios completos, carnes na brasa, massas frescas e coquetéis sofisticados.
        </p>

        {/* Dual Primary Call-To-Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <Link
            href="/monte-seu-evento"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider bg-gradient-to-r from-[#E0631B] to-[#C44E0F] text-white hover:from-[#EA7B3B] hover:to-[#E0631B] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <CalendarClock className="w-5 h-5" />
            <span>Monte seu Evento</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm sm:text-base font-semibold border-2 border-[#1E694D] bg-[#0B2F21]/60 text-white hover:bg-[#124330] hover:border-[#268260] backdrop-blur-sm transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>Fale pelo WhatsApp</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-[#17523C]/60 w-full max-w-3xl text-left sm:text-center text-xs sm:text-sm text-[#E9E2D7]/85">
          <div className="flex items-center sm:justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Equipe técnica uniformizada</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Estrutura completa a domicílio</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Orçamento rápido e sem surpresas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
