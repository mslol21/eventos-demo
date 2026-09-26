'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { COMPANY_CONFIG } from '@/data/company';

const GALLERY_SAMPLES = [
  {
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    title: 'Churrasco nobre na brasa',
  },
  {
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    title: 'Finger foods contemporâneos',
  },
  {
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    title: 'Estação de massas frescas',
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    title: 'Ilhas gastronômicas para casamentos',
  },
];

export function InstagramGalleryStrip() {
  return (
    <section className="py-24 sm:py-36 bg-[#FAF7F2] text-[#121815] border-t border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
              BASTIDORES & EVENTOS REAIS
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-[#071E15] tracking-tight">
              Acompanhe nossas montagens.
            </h2>
          </div>

          <a
            href={COMPANY_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#071E15] hover:text-[#C8521A] transition-colors self-start md:self-auto"
          >
            <InstagramIcon className="w-4 h-4 text-[#C8521A]" />
            <span>{COMPANY_CONFIG.instagram}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Immersive Full-bleed Image Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {GALLERY_SAMPLES.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm bg-stone-200"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Link to full gallery page */}
        <div className="mt-12 text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#55635C] hover:text-[#071E15] underline underline-offset-8 decoration-[#E5DFD5] hover:decoration-[#071E15] transition-colors"
          >
            <span>Ver galeria completa de fotos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
