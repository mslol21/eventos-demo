'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '@/data/company';

export function CtaBanner() {
  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(
    'Olá! Gostaria de conversar com a equipe da SD Eventos sobre buffet a domicílio para meu evento.'
  )}`;

  return (
    <section className="bg-[#071E15] text-white py-24 sm:py-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-8">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-4">
              SD EVENTOS • BUFFET A DOMICÍLIO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-[-0.02em] mb-6">
              Pronto para viver uma experiência gastronômica inesquecível?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#FAF8F5]/80 font-light leading-relaxed max-w-2xl">
              Simule os detalhes do seu buffet em tempo real ou chame nossa equipe diretamente para tirar dúvidas e verificar datas disponíveis.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            <Link
              href="/monte-seu-evento"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#E0631B] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#C44E0F] transition-all active:scale-[0.98] shadow-xl text-center"
            >
              <span>Monte seu evento online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/[0.04] text-white text-xs sm:text-sm font-medium tracking-wide hover:bg-white/10 hover:border-white/40 transition-all active:scale-[0.98] text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
