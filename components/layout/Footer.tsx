'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Clock, Heart } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { useSiteData } from '@/lib/useSiteData';

export function Footer() {
  const { company } = useSiteData();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#071E15] text-[#FAF8F5] pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#C5A059]/60 flex items-center justify-center font-serif text-lg text-[#C5A059]">
                SD
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.08em] text-white">
                  SD EVENTOS
                </span>
                <span className="text-[9px] text-[#C5A059] uppercase tracking-[0.25em] font-medium -mt-1">
                  Buffet a Domicílio
                </span>
              </div>
            </div>

            <p className="text-sm text-[#FAF8F5]/75 font-light leading-relaxed max-w-sm">
              Sabores que encantam e momentos que ficam. Levamos a gastronomia completa e o atendimento profissional até o seu evento em São Paulo e região.
            </p>

            <p className="text-xs text-[#C5A059] tracking-wider uppercase font-medium">
              Alimentação • Bebidas • Equipe • Descartáveis inclusos
            </p>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.2em]">
              Navegação
            </h3>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/70">
              <li>
                <Link href="/" className="hover:text-[#E0631B] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="hover:text-[#E0631B] transition-colors">
                  Cardápios & Serviços
                </Link>
              </li>
              <li>
                <Link href="/monte-seu-evento" className="hover:text-[#E0631B] text-[#E0631B] transition-colors font-medium">
                  Monte seu Evento (Simulador)
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-[#E0631B] transition-colors">
                  Galeria de Fotos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-[#E0631B] transition-colors">
                  Sobre a SD Eventos
                </Link>
              </li>
              <li>
                <Link href="/duvidas" className="hover:text-[#E0631B] transition-colors">
                  Dúvidas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#E0631B] transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Contact Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.2em]">
              Atendimento Oficial
            </h3>
            <div className="space-y-3 text-xs text-[#FAF8F5]/75 font-light">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E0631B] font-medium"
                >
                  WhatsApp: {company.whatsappFormatted}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a
                  href={company.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E0631B] font-medium"
                >
                  {company.instagram}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{company.hours}</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/admin"
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-widest"
              >
                Acesso Administrativo
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60 font-light">
          <p>© {new Date().getFullYear()} SD Eventos — Buffet a Domicílio. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Feito com</span>
            <Heart className="w-3 h-3 text-[#E0631B] fill-[#E0631B]" />
            <span>para comemorações memoráveis.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
