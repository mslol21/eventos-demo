'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function AboutSnippet() {
  return (
    <section className="py-24 sm:py-36 bg-[#FAF7F2] text-[#121815] border-t border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Authentic Imagery Composition */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-xl bg-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85"
                alt="Equipe SD Eventos montando buffet completo em evento particular"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-mono uppercase tracking-widest">
                SD Eventos • Alta Hospitalidade a Domicílio
              </div>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C8521A] font-bold mb-3">
                NOSSA FILOSOFIA
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-[-0.02em] text-[#071E15]">
                Você deve ser um convidado na sua própria comemoração.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#55635C] font-light leading-relaxed">
              A <strong className="text-[#071E15] font-medium">SD Eventos</strong> nasceu da convicção de que celebrar não deveria significar passar horas na frente da brasa ou no fogão. Levamos a experiência completa de gastronomia e atendimento até você, cuidando de cada detalhe com pontualidade, higiene e cordialidade.
            </p>

            <div className="border-l-2 border-[#C8521A] pl-5 space-y-2 py-1">
              <p className="font-serif text-xl sm:text-2xl text-[#071E15] italic font-light">
                &ldquo;Do primeiro brinde à finalização do evento, nossa missão é encantar quem você mais ama.&rdquo;
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/sobre"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-[#071E15] hover:text-[#C8521A] transition-colors group"
              >
                <span>Conhecer a história da SD Eventos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
