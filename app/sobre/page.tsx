import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre a SD Eventos | Nossa História e Propósito',
  description:
    'Conheça a SD Eventos: buffet a domicílio com foco em gastronomia afetiva, organização impecável e atendimento acolhedor para festas e eventos corporativos.',
};

export default function SobrePage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Section of About */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#1E694D] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E0631B]" />
            <span>Sobre a SD Eventos</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B2F21] tracking-tight mb-6">
            Mais do que servir comida, ajudamos a criar momentos.
          </h1>
          <p className="text-base sm:text-lg text-[#5C6762] leading-relaxed">
            A SD Eventos nasceu do propósito de libertar o anfitrião do trabalho pesado da cozinha para que ele possa viver o que realmente importa: celebrar com quem ama.
          </p>
        </div>

        {/* Story & Image 2-col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80"
              alt="Mesa de buffet bem cuidada pela equipe SD Eventos"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21]">
              Nossa Trajetória
            </h2>
            <p className="text-sm sm:text-base text-[#5C6762] leading-relaxed">
              O que começou como reuniões intimistas de amigos e familiares rapidamente se transformou em uma operação especializada de buffet a domicílio. Percebemos que as pessoas queriam a qualidade de um restaurante renomado ou churrascaria no conforto de suas casas, condomínios e chácaras.
            </p>
            <p className="text-sm sm:text-base text-[#5C6762] leading-relaxed">
              Hoje, a <strong className="text-[#0B2F21]">SD Eventos</strong> conta com equipes treinadas de churrasqueiros, chefs de massas, cozinheiros, garçons e copeiras. Cuidamos do transporte seguro dos insumos, montagem elegante dos pontos de serviço, preparo na hora e limpeza contínua durante todo o evento.
            </p>

            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#E9E2D7] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF6F0] flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-[#E0631B]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B2F21]">Compromisso com o Anfitrião</h4>
                  <p className="text-xs text-[#5C6762]">Você é o convidado de honra da sua própria festa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21]">
              Os 4 Pilares da Nossa Entrega
            </h2>
            <p className="text-sm text-[#5C6762] mt-2">
              Tudo o que fazemos é guiado por padrões rigorosos de qualidade e hospitalidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#0B2F21]">
                Qualidade dos Insumos
              </h3>
              <p className="text-xs text-[#5C6762] leading-relaxed">
                Carnes nobres com procedência garantida, massas frescas selecionadas e guarnições feitas no dia do evento.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#E0631B]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#0B2F21]">
                Pontualidade Britânica
              </h3>
              <p className="text-xs text-[#5C6762] leading-relaxed">
                Chegada ao local com 2 horas de antecedência para organização minuciosa do mise en place e início pontual.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#0B2F21]">
                Equipe Uniformizada
              </h3>
              <p className="text-xs text-[#5C6762] leading-relaxed">
                Profissionais alinhados, educados e proativos que tratam seus familiares e convidados com extrema cortesia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#0B2F21]">
                Fartura & Reposição
              </h3>
              <p className="text-xs text-[#5C6762] leading-relaxed">
                Cálculos generosos por pessoa para assegurar que nenhum convidado fique sem comer bem do início ao fim.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-[#0B2F21] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Queremos fazer parte da sua próxima história feliz.
          </h2>
          <p className="text-sm sm:text-base text-[#E9E2D7]/80 max-w-xl mx-auto">
            Faça uma simulação rápida no nosso site e receba os detalhes organizados diretamente no WhatsApp.
          </p>
          <div className="pt-2">
            <Link
              href="/monte-seu-evento"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] shadow-lg transition-all"
            >
              <span>Montar Meu Evento Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
