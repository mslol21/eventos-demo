'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, CalendarClock, MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '@/data/faq';
import { COMPANY_CONFIG } from '@/data/company';

export default function DuvidasPage() {
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

  const whatsappDoubtUrl = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(
    'Olá! Tenho uma dúvida sobre os serviços de buffet da SD Eventos que gostaria de esclarecer.'
  )}`;

  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] text-[#E0631B] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Central de Dúvidas</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2F21] tracking-tight">
            Perguntas Frequentes
          </h1>
          <p className="text-base sm:text-lg text-[#5C6762] max-w-2xl mx-auto">
            Reunimos as respostas para as principais perguntas que nossos clientes fazem sobre cardápios, regiões de atendimento e dinâmica do evento.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 mt-2" />
            <input
              type="text"
              placeholder="Buscar por pergunta ou palavra-chave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#E9E2D7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B] shadow-xs"
            />
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#E9E2D7] overflow-hidden shadow-xs hover:border-[#0B2F21]/30 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-[#FCFBF9] transition-colors focus:outline-none"
                  >
                    <div>
                      {faq.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C44E0F] block mb-1">
                          {faq.category}
                        </span>
                      )}
                      <span className="font-serif font-bold text-base sm:text-lg text-[#0B2F21]">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#E0631B] shrink-0 ml-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-sm sm:text-base text-[#5C6762] leading-relaxed border-t border-[#F3EFE9]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E9E2D7] p-8">
              <p className="text-sm text-[#5C6762]">
                Nenhuma resposta encontrada para &quot;{search}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-3 text-xs font-bold text-[#E0631B] underline cursor-pointer"
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>

        {/* Still have questions? Help Card */}
        <div className="bg-[#FAF8F5] border-2 border-dashed border-[#E9E2D7] rounded-3xl p-8 text-center space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2F21]">
            Não encontrou o que procurava?
          </h3>
          <p className="text-sm text-[#5C6762] max-w-md mx-auto">
            Nossa equipe está disponível no WhatsApp para responder sua dúvida específica em poucos minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={whatsappDoubtUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tirar Dúvida no WhatsApp</span>
            </a>
            <Link
              href="/monte-seu-evento"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2F21] hover:bg-[#124330] text-white font-bold text-xs uppercase tracking-wider shadow transition-colors"
            >
              <CalendarClock className="w-4 h-4 text-[#E0631B]" />
              <span>Simular Meu Evento</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
