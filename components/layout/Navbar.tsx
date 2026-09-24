'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, UtensilsCrossed, CalendarClock, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '@/data/company';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/servicos', label: 'Buffets' },
  { href: '/monte-seu-evento', label: 'Monte seu Evento' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/duvidas', label: 'Dúvidas' },
  { href: '/contato', label: 'Contato' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeDrawer = () => setIsOpen(false);

  // Don't show public navbar on admin pages to keep admin clean
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B2F21]/95 backdrop-blur-md shadow-lg border-b border-[#17523C]'
          : 'bg-[#0B2F21] text-white border-b border-[#124330]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={closeDrawer}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#E0631B] rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E0631B] to-[#C44E0F] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white">
                  SD EVENTOS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0631B]" />
              </div>
              <span className="text-[10px] sm:text-xs text-[#E9E2D7] font-medium tracking-widest uppercase">
                Buffet a Domicílio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 hover:text-[#E0631B] ${
                    isActive ? 'text-[#E0631B] font-semibold' : 'text-[#FAF8F5]/90'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E0631B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Action */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/monte-seu-evento"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold bg-[#E0631B] text-white hover:bg-[#C44E0F] active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              <CalendarClock className="w-4 h-4" />
              <span>Pedir Orçamento</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/monte-seu-evento"
              onClick={closeDrawer}
              className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold bg-[#E0631B] text-white hover:bg-[#C44E0F] transition-all"
            >
              Orçamento
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-white hover:bg-[#124330] focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
              aria-label={isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6 text-[#E0631B]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#17523C] bg-[#0B2F21] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#17523C] text-[#E0631B] font-semibold'
                      : 'text-white hover:bg-[#124330] hover:text-[#FAF8F5]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-[#17523C] space-y-3">
            <Link
              href="/monte-seu-evento"
              onClick={closeDrawer}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#E0631B] text-white shadow hover:bg-[#C44E0F] active:scale-98 transition-all"
            >
              <CalendarClock className="w-4 h-4" />
              <span>Monte seu Evento</span>
            </Link>

            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsapp}?text=${encodeURIComponent(
                COMPANY_CONFIG.defaultMessageTemplate
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeDrawer}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border border-[#17523C] text-[#FAF8F5] hover:bg-[#124330] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Fale pelo WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
