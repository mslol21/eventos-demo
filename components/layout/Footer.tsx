'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { COMPANY_CONFIG } from '@/data/company';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#072017] text-[#FAF8F5] pt-16 pb-12 border-t border-[#103D2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#124330]">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E0631B] to-[#C44E0F] flex items-center justify-center text-white shadow">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-white">
                  SD EVENTOS
                </span>
                <span className="block text-[10px] text-[#C5A059] uppercase tracking-widest font-semibold">
                  Buffet a Domicílio
                </span>
              </div>
            </div>
            <p className="text-sm text-[#E9E2D7]/80 leading-relaxed">
              Sabores que encantam e momentos que ficam. Levamos a gastronomia completa e o serviço profissional até sua casa, condomínio, chácara ou empresa.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C5A059]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Higiene rigorosa e ingredientes selecionados</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#FAF8F5] uppercase tracking-wider">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm text-[#E9E2D7]/80">
              <li>
                <Link href="/" className="hover:text-[#E0631B] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="hover:text-[#E0631B] transition-colors">
                  Opções de Buffets
                </Link>
              </li>
              <li>
                <Link href="/monte-seu-evento" className="hover:text-[#E0631B] font-medium text-emerald-300 transition-colors">
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
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/duvidas" className="hover:text-[#E0631B] transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#E0631B] transition-colors">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#FAF8F5] uppercase tracking-wider">
              Nossos Cardápios
            </h3>
            <ul className="space-y-2 text-sm text-[#E9E2D7]/80">
              <li>
                <Link href="/servicos#churrasco" className="hover:text-[#E0631B] transition-colors">
                  Churrasco Completo na Brasa
                </Link>
              </li>
              <li>
                <Link href="/servicos#finger-foods" className="hover:text-[#E0631B] transition-colors">
                  Finger Foods & Coquetéis
                </Link>
              </li>
              <li>
                <Link href="/servicos#festival-de-massas" className="hover:text-[#E0631B] transition-colors">
                  Festival de Massas Artesanais
                </Link>
              </li>
              <li>
                <Link href="/servicos#eventos-personalizados" className="hover:text-[#E0631B] transition-colors">
                  Ilhas Gastronômicas & Casamentos
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E9E2D7]/50 hover:text-[#FAF8F5] transition-colors"
                >
                  <span>Área Interna (Painel Administrativo)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#FAF8F5] uppercase tracking-wider">
              Atendimento
            </h3>
            <div className="space-y-3 text-sm text-[#E9E2D7]/80">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#E0631B] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`https://wa.me/${COMPANY_CONFIG.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E0631B] transition-colors font-medium text-white"
                  >
                    {COMPANY_CONFIG.whatsappFormatted}
                  </a>
                  <p className="text-xs text-[#C5A059]">Atendimento direto no WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#E0631B] shrink-0 mt-0.5" />
                <a
                  href={COMPANY_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E0631B] transition-colors"
                >
                  {COMPANY_CONFIG.instagram}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E0631B] shrink-0 mt-0.5" />
                <span>{COMPANY_CONFIG.serviceArea}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E0631B] shrink-0 mt-0.5" />
                <span className="text-xs">{COMPANY_CONFIG.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E9E2D7]/60 gap-4">
          <p>© {new Date().getFullYear()} SD Eventos — Buffet a Domicílio. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para transformar celebrações em memórias.
          </p>
        </div>
      </div>
    </footer>
  );
}
