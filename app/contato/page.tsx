'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { COMPANY_CONFIG } from '@/data/company';

export default function ContatoPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const formatted = `Olá, SD Eventos! Meu nome é ${name} (${phone}).\n\nMensagem: ${
      message || 'Gostaria de conversar sobre buffet a domicílio para meu evento.'
    }`;
    const url = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(formatted)}`;

    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="py-16 sm:py-28 bg-[#FAF7F2] text-[#121815]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
            FALE CONOSCO • ATENDIMENTO OFICIAL
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[0.95] tracking-[-0.03em] text-[#071E15] mb-6">
            Planejando uma comemoração especial?
          </h1>
          <p className="text-base sm:text-lg text-[#55635C] font-light leading-relaxed">
            Estamos à disposição para apresentar opções de cardápio, verificar a disponibilidade da sua data e esclarecer qualquer dúvida com agilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Official Channels Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#071E15] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-medium block mb-2">
                SD EVENTOS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                Canais de Atendimento
              </h2>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-[#FAF8F5]/80 font-light">
              <div>
                <p className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold mb-1">
                  WhatsApp Oficial
                </p>
                <a
                  href={`https://wa.me/${COMPANY_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-xl sm:text-2xl text-white hover:text-[#E0631B] transition-colors block"
                >
                  {COMPANY_CONFIG.whatsappFormatted}
                </a>
                <p className="text-[11px] text-[#FAF8F5]/60 mt-0.5">
                  Atendimento direto com a equipe
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold mb-1">
                  Instagram Oficial
                </p>
                <a
                  href={COMPANY_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-[#E0631B] transition-colors flex items-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4 text-[#C8521A]" />
                  <span>{COMPANY_CONFIG.instagram}</span>
                </a>
              </div>

              <div>
                <p className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold mb-1">
                  Região Atendida
                </p>
                <p className="text-white">
                  {COMPANY_CONFIG.serviceArea}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold mb-1">
                  Horário de Atendimento
                </p>
                <p className="text-white">
                  {COMPANY_CONFIG.hours}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/monte-seu-evento"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#E0631B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#C44E0F] transition-all"
              >
                <span>Usar simulador de orçamento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5DFD5] shadow-xs">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15] mb-2">
              Envie uma mensagem direta
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] font-light mb-8">
              Preencha os campos abaixo para abrir a conversa no WhatsApp com os seus dados já organizados.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contactName" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                  Seu Nome:
                </label>
                <input
                  id="contactName"
                  type="text"
                  required
                  placeholder="Ex: Gabriela Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                  WhatsApp com DDD:
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                />
              </div>

              <div>
                <label htmlFor="contactMessage" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                  Mensagem ou Dúvida:
                </label>
                <textarea
                  id="contactMessage"
                  rows={4}
                  placeholder="Conte um pouco sobre o formato do evento, data prevista ou tire suas dúvidas..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#071E15] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#124330] transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Conversar no WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
