'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  CalendarClock,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { COMPANY_CONFIG } from '@/data/company';

export default function ContatoPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const formatted = `Olá, SD Eventos! Meu nome é ${name} (${phone}).\n\nMensagem: ${message || 'Gostaria de falar sobre opções de buffet para o meu evento.'}`;
    const url = `https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(formatted)}`;

    setSent(true);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] text-[#E0631B] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fale com Nossa Equipe</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2F21] tracking-tight mb-4">
            Planejando uma comemoração?
          </h1>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            Conte para nós como será seu evento. Estamos prontos para apresentar o cardápio ideal para surpreender seus convidados.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#0B2F21] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white mb-2">
                Canais de Atendimento
              </h2>
              <p className="text-xs sm:text-sm text-[#E9E2D7]/80">
                Priorizamos agilidade e clareza. Você pode nos contatar diretamente pelo WhatsApp ou preencher o formulário ao lado.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#17523C] flex items-center justify-center shrink-0 text-emerald-300">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                    WhatsApp Principal
                  </p>
                  <a
                    href={`https://wa.me/${COMPANY_CONFIG.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-base text-white hover:text-[#E0631B] transition-colors"
                  >
                    {COMPANY_CONFIG.whatsappFormatted}
                  </a>
                  <p className="text-[11px] text-[#E9E2D7]/60 mt-0.5">
                    Tempo médio de resposta: menos de 30 min
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#17523C] flex items-center justify-center shrink-0 text-[#E0631B]">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                    Instagram Oficial
                  </p>
                  <a
                    href={COMPANY_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-base text-white hover:text-[#E0631B] transition-colors"
                  >
                    {COMPANY_CONFIG.instagram}
                  </a>
                  <p className="text-[11px] text-[#E9E2D7]/60 mt-0.5">
                    Acompanhe fotos e bastidores dos eventos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#17523C] flex items-center justify-center shrink-0 text-[#C5A059]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                    Região Atendida
                  </p>
                  <p className="text-white font-medium">
                    {COMPANY_CONFIG.serviceArea}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#17523C] flex items-center justify-center shrink-0 text-emerald-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                    Horários
                  </p>
                  <p className="text-xs text-[#E9E2D7]/80">
                    {COMPANY_CONFIG.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Simulator Shortcut Box */}
            <div className="pt-4 border-t border-[#17523C]">
              <div className="p-4 rounded-2xl bg-[#103D2C] border border-[#1E694D] space-y-2">
                <p className="text-xs font-semibold text-emerald-200">
                  Quer um orçamento com estimativa de valor na hora?
                </p>
                <Link
                  href="/monte-seu-evento"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#E0631B] hover:text-white transition-colors"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>Acessar Simulador de Buffet</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2D7] shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#0B2F21] mb-2">
              Envie sua Mensagem
            </h2>
            <p className="text-sm text-[#5C6762] mb-6">
              Preencha o formulário abaixo e conectaremos você ao nosso WhatsApp com a mensagem pronta.
            </p>

            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Mensagem gerada com sucesso!</span>
                </div>
                <p className="text-xs sm:text-sm">
                  Abrimos a janela do WhatsApp. Se desejar enviar outra mensagem ou fechar este aviso, clique abaixo.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-2 text-xs font-bold text-emerald-700 underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="contactName" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    Seu Nome *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    required
                    placeholder="Como prefere ser chamado?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contactPhone" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    WhatsApp com DDD *
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    required
                    placeholder="(11) 98406-6393"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contactMessage" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    Conte para nós como será seu evento *
                  </label>
                  <textarea
                    id="contactMessage"
                    required
                    rows={4}
                    placeholder="Conte sobre o tipo de comemoração, data prevista, número estimado de pessoas e qualquer detalhe que desejar..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#E0631B] hover:bg-[#C44E0F] text-white font-bold text-sm uppercase tracking-wider shadow transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem pelo WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
