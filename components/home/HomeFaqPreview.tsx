'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FAQ_DATA } from '@/data/faq';

export function HomeFaqPreview() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);
  const previewFaqs = FAQ_DATA.slice(0, 5);

  return (
    <section className="py-24 sm:py-36 bg-[#FAF7F2] text-[#121815] border-t border-[#E5DFD5]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="mb-14 sm:mb-20">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
            TRANSPARÊNCIA & DÚVIDAS FREQUENTES
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-[#071E15] tracking-tight">
            Perguntas mais comuns antes de contratar.
          </h2>
          <p className="text-sm sm:text-base text-[#55635C] mt-3 font-light">
            Esclarecemos pontos essenciais sobre estrutura, horários, bebidas e contratação.
          </p>
        </div>

        {/* Editorial Accordion */}
        <div className="divide-y divide-[#E5DFD5] border-y border-[#E5DFD5]">
          {previewFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5 sm:py-6">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between text-left group focus:outline-none"
                >
                  <span className="font-serif text-lg sm:text-2xl font-normal text-[#071E15] group-hover:text-[#C8521A] transition-colors pr-6">
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
          })}
        </div>

        {/* Link to full FAQ page */}
        <div className="mt-12 text-center">
          <Link
            href="/duvidas"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#55635C] hover:text-[#071E15] underline underline-offset-8 decoration-[#E5DFD5] hover:decoration-[#071E15] transition-colors"
          >
            <span>Ver todas as perguntas e respostas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
