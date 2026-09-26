'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '@/data/company';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/servicos', label: 'Cardápios' },
  { href: '/monte-seu-evento', label: 'Simulador' },
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

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHeroPage = pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#071E15]/95 backdrop-blur-md shadow-lg border-b border-white/10 py-3.5'
          : isHeroPage
          ? 'bg-[#071E15]/80 backdrop-blur-sm text-white border-b border-white/10 py-4 sm:py-5'
          : 'bg-[#071E15] text-white border-b border-white/10 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Typographic Luxury Brand Mark */}
          <Link
            href="/"
            onClick={closeDrawer}
            className="flex items-center gap-3.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-[#C5A059]/60 flex items-center justify-center font-serif text-lg text-[#C5A059] group-hover:border-[#E0631B] group-hover:text-[#E0631B] transition-colors">
              SD
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.08em] text-white">
                SD EVENTOS
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#C5A059] uppercase tracking-[0.25em] font-medium -mt-1">
                Buffet a Domicílio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.18em] font-medium transition-colors relative py-1 hover:text-[#E0631B] ${
                    isActive ? 'text-[#E0631B]' : 'text-white/80'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#E0631B]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/monte-seu-evento"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] transition-all duration-200 active:scale-[0.98] shadow-md"
            >
              <span>Monte seu evento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/monte-seu-evento"
              className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] transition-all"
            >
              Simular
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              className="p-2 text-white/90 hover:text-white rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#071E15] border-b border-white/10 px-5 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className={`text-sm uppercase tracking-widest py-2 border-b border-white/5 transition-colors ${
                    isActive ? 'text-[#E0631B] font-semibold' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2">
            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {COMPANY_CONFIG.whatsappFormatted}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
