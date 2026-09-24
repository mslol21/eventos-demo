import React from 'react';
import Link from 'next/link';
import { CalendarClock, MessageCircle, Sparkles } from 'lucide-react';
import { COMPANY_CONFIG } from '@/data/company';

export function CtaBanner() {
  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(
    'Olá! Quero tirar dúvidas e receber um orçamento para o meu evento com a SD Eventos.'
  )}`;

  return (
    <section className="py-20 bg-[#0B2F21] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E0631B_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17523C] text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#E0631B]" />
          <span>Transforme sua comemoração</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 max-w-3xl mx-auto">
          Pronto para viver uma experiência gastronômica inesquecível?
        </h2>

        <p className="text-base sm:text-lg text-[#E9E2D7]/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Simule os detalhes do seu buffet agora mesmo ou chame nossa equipe para tirar qualquer dúvida. Garantimos pontualidade, fartura e sabor.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/monte-seu-evento"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] shadow-lg hover:shadow-xl transition-all"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Monte seu Evento Agora</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold border border-[#1E694D] bg-[#124330] text-white hover:bg-[#17523C] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Conversar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
