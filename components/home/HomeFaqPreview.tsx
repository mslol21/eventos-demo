'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '@/data/faq';

export function HomeFaqPreview() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  // Take first 5 questions for preview
  const previewFaqs = FAQ_DATA.slice(0, 5);

  return (
    <section className="py-20 sm:py-28 bg-[#F3EFE9] border-t border-[#E9E2D7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] text-[#E0631B] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire suas Dúvidas</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2F21] tracking-tight mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-[#5C6762]">
            Tudo o que você precisa saber para planejar sua festa com total transparência.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {previewFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E9E2D7] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-[#FAF8F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-[#0B2F21] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#E0631B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#5C6762] leading-relaxed border-t border-[#F3EFE9]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Link to full FAQ page */}
        <div className="mt-10 text-center">
          <Link
            href="/duvidas"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2F21] hover:text-[#E0631B] transition-colors"
          >
            <span>Ver todas as perguntas e respostas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
