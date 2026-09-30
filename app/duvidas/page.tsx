'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '@/data/faq';
import { useSiteData } from '@/lib/useSiteData';

export default function DuvidasPage() {
  const { company } = useSiteData();
  const [search, setSearch] = useState('');
  const [openIds, setOpenIds] = useState<string[]>([FAQ_DATA[0].id, FAQ_DATA[1].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const cleanPhone = company.whatsapp.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55')
    ? cleanPhone
    : cleanPhone.length === 10 || cleanPhone.length === 11
    ? `55${cleanPhone}`
    : cleanPhone;

  const whatsappDoubtUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(
    'Olá! Tenho uma dúvida sobre os serviços de buffet da SD Eventos que gostaria de esclarecer.'
  )}`;

  return (
    <div className="py-16 sm:py-28 bg-[#FAF7F2] text-[#121815]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="max-w-3xl">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
            TRANSPARÊNCIA TOTAL
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight text-[#071E15] tracking-tight mb-4">
            Dúvidas Frequentes.
          </h1>
          <p className="text-base sm:text-lg text-[#55635C] font-light leading-relaxed">
            Reunimos as respostas para as principais questões sobre cardápios, equipe, bebidas, horários e formas de pagamento.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg pt-6">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 mt-3" />
            <input
              type="text"
              placeholder="Buscar por pergunta ou assunto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#E5DFD5] bg-white text-xs sm:text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
            />
          </div>
        </div>

        {/* Editorial Accordion */}
        <div className="divide-y divide-[#E5DFD5] border-y border-[#E5DFD5]">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#55635C]">
              Nenhuma dúvida encontrada para &ldquo;{search}&rdquo;. Converse com nossa equipe no WhatsApp!
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div key={faq.id} className="py-6">
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between text-left group focus:outline-none"
                  >
                    <span className="font-serif text-xl sm:text-2xl font-normal text-[#071E15] group-hover:text-[#C8521A] transition-colors pr-6">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8B7355] shrink-0 mt-1 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C8521A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-4 text-xs sm:text-sm text-[#55635C] leading-relaxed font-light animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Help Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-normal text-[#071E15] mb-2">
              Sua dúvida não está listada?
            </h3>
            <p className="text-xs sm:text-sm text-[#55635C] font-light">
              Nossa equipe está disponível para responder perguntas sobre o seu evento diretamente no chat.
            </p>
          </div>

          <a
            href={whatsappDoubtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#071E15] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#124330] transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Falar com especialista</span>
          </a>
        </div>
      </div>
    </div>
  );
}
