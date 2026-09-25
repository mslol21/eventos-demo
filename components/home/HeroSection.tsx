import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarClock, MessageCircle, ShieldCheck, Flame, GlassWater, Utensils, Sparkles } from 'lucide-react';
import { COMPANY_CONFIG } from '@/data/company';

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(
    COMPANY_CONFIG.defaultMessageTemplate
  )}`;

  return (
    <section className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center bg-[#072017] text-white overflow-hidden">
      {/* Background Gastronomic Image with Warm Vignette & Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=2000&q=85"
          alt="Mesa de buffet gastronômico requintado preparado pela SD Eventos"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#072017]/95 via-[#0B2F21]/80 to-[#072017]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
        {/* Editorial Sub-header Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#124330]/80 border border-[#C5A059]/40 text-[#E9E2D7] text-xs tracking-wider uppercase font-semibold mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E0631B]" />
          <span>Buffet a Domicílio • São Paulo & Região</span>
        </div>

        {/* Brand Name */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-[#E0631B] mb-3">
          SD EVENTOS
        </p>

        {/* Primary Headline with Editorial Typography */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6 max-w-4xl">
          SABORES QUE ENCANTAM.
          <br />
          <span className="text-[#FAF8F5] italic font-normal font-serif">
            MOMENTOS QUE FICAM.
          </span>
        </h1>

        {/* Elegant Gold Accent Line */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-6" />

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-[#FAF8F5]/90 max-w-2xl font-light leading-relaxed mb-8">
          Buffet a domicílio para transformar sua comemoração em uma experiência especial. Cardápios completos preparados com excelência no local do seu evento.
        </p>

        {/* Gastronomic Specialty Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 text-xs text-[#E9E2D7]/90">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-[#E0631B]" />
            Churrasco Nobre na Brasa
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
            <GlassWater className="w-3.5 h-3.5 text-[#E0631B]" />
            Finger Foods & Coquetéis
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
            <Utensils className="w-3.5 h-3.5 text-[#E0631B]" />
            Festival de Massas Artesanais
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Ilhas Gastronômicas
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <Link
            href="/monte-seu-evento"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0631B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#072017]"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Monte seu Evento</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-semibold border border-[#17523C] bg-[#0B2F21]/80 text-white hover:bg-[#124330] hover:border-[#1E694D] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#072017]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Fale pelo WhatsApp</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 border-t border-[#17523C]/50 w-full max-w-2xl text-xs text-[#E9E2D7]/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Equipe técnica uniformizada</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Estrutura completa a domicílio</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Estimativa inicial transparente</span>
          </div>
        </div>
      </div>
    </section>
  );
}
