'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { useSiteData } from '@/lib/useSiteData';

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const { company } = useSiteData();
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide on admin routes and wizard page where dedicated WhatsApp CTAs exist
  if (pathname.startsWith('/admin') || pathname.startsWith('/monte-seu-evento')) {
    return null;
  }

  const defaultMsg = encodeURIComponent('Olá! Estava navegando no site da SD Eventos e gostaria de tirar uma dúvida sobre os buffets.');
  const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${defaultMsg}`;

  return (
    <aside
      aria-label="Atendimento via WhatsApp"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-2 select-none pointer-events-none"
    >
      {/* Gentle Tooltip for visitors */}
      {showTooltip && (
        <div className="pointer-events-auto bg-white text-[#151D19] p-3 rounded-2xl shadow-xl border border-emerald-100 max-w-xs text-xs mb-1 relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Fechar mensagem de ajuda"
            className="absolute -top-1.5 -left-1.5 bg-[#FAF8F5] border border-gray-200 rounded-full p-1 text-gray-500 hover:text-gray-900"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-semibold text-emerald-800 mb-0.5">Dúvidas sobre o buffet?</p>
          <p className="text-gray-600">
            Fale conosco direto no WhatsApp para tirar dúvidas sobre datas e cardápios.
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp com a SD Eventos"
        onMouseEnter={() => setShowTooltip(true)}
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        
        {/* Subtle Online Badge */}
        <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>
      </a>
    </aside>
  );
}
