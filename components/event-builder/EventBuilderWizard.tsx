'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';
import { ADDONS_DATA } from '@/data/addons';
import { COMPANY_CONFIG } from '@/data/company';
import { calculateEstimatedPrice, formatBRL } from '@/lib/pricing';
import { buildWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';
import { saveLocalQuote } from '@/lib/storage';
import { EventType, QuoteRequest } from '@/types';

// Strict Step Flow requested by user:
// 1. evento -> 2. buffet -> 3. convidados -> 4. data -> 5. local -> 6. necessidades -> 7. contato -> 8. resumo -> WhatsApp
const STEP_CONFIG = [
  { id: 1, title: 'Tipo de Evento', shortLabel: 'Evento' },
  { id: 2, title: 'Cardápio Desejado', shortLabel: 'Buffet' },
  { id: 3, title: 'Quantidade de Convidados', shortLabel: 'Convidados' },
  { id: 4, title: 'Data & Horário', shortLabel: 'Data' },
  { id: 5, title: 'Local da Celebração', shortLabel: 'Local' },
  { id: 6, title: 'Opcionais & Necessidades', shortLabel: 'Opcionais' },
  { id: 7, title: 'Seus Dados para Contato', shortLabel: 'Contato' },
  { id: 8, title: 'Resumo da Simulação', shortLabel: 'Resumo' },
];

const EVENT_TYPE_OPTIONS: Array<{ id: EventType; label: string; icon: string; desc: string }> = [
  { id: 'aniversario', label: 'Aniversário', icon: '🎂', desc: 'Comemoração com amigos e família' },
  { id: 'casamento', label: 'Casamento / Noivado', icon: '💍', desc: 'Cerimônia ou festa intimista' },
  { id: 'confraternizacao', label: 'Confraternização', icon: '🥂', desc: 'Encontro descontraído entre amigos' },
  { id: 'empresarial', label: 'Corporativo / Empresa', icon: '💼', desc: 'Eventos de empresas e lançamentos' },
  { id: 'infantil', label: 'Festa Infantil', icon: '🎈', desc: 'Comemoração para crianças e família' },
  { id: 'outro', label: 'Outro Formato', icon: '✨', desc: 'Celebração sob medida ou formato especial' },
];

const GUEST_PRESETS = [20, 30, 40, 50, 70, 100, 150];
const MIN_EVENT_DATE = new Date(Date.now() + 86400000).toISOString().split('T')[0];

function WizardInner() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || searchParams.get('servico');

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [eventType, setEventType] = useState<EventType>('aniversario');
  const [serviceId, setServiceId] = useState<string>(() => {
    if (initialService && SERVICES_DATA.some((s) => s.id === initialService)) {
      return initialService;
    }
    return 'churrasco';
  });
  const [guestCount, setGuestCount] = useState<number>(50);
  const [customGuestMode, setCustomGuestMode] = useState<boolean>(false);
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('13:00');
  const [city, setCity] = useState<string>('São Paulo');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [spaceType, setSpaceType] = useState<string>('casa');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Contact State
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Pricing calculation
  const pricing = useMemo(() => {
    return calculateEstimatedPrice(serviceId, guestCount, selectedAddonIds);
  }, [serviceId, guestCount, selectedAddonIds]);

  const selectedService = useMemo(() => {
    return SERVICES_DATA.find((s) => s.id === serviceId) || SERVICES_DATA[0];
  }, [serviceId]);

  const selectedAddonsFull = useMemo(() => {
    return ADDONS_DATA.filter((a) => selectedAddonIds.includes(a.id));
  }, [selectedAddonIds]);

  // Validation per step
  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!eventType) {
        setErrorMsg('Por favor, selecione o tipo do seu evento.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!serviceId) {
        setErrorMsg('Por favor, escolha uma opção de cardápio.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!guestCount || guestCount < 10) {
        setErrorMsg('Por favor, informe ao menos 10 convidados.');
        return false;
      }
    }
    if (currentStep === 4) {
      if (!eventDate) {
        setErrorMsg('Por favor, indique a data prevista do evento.');
        return false;
      }
    }
    if (currentStep === 5) {
      if (!neighborhood.trim()) {
        setErrorMsg('Por favor, informe ao menos o bairro do evento.');
        return false;
      }
    }
    if (currentStep === 7) {
      if (!customerName.trim()) {
        setErrorMsg('Por favor, digite seu nome.');
        return false;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Por favor, informe seu WhatsApp com DDD (mínimo 10 dígitos).');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 8));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentWhatsAppMessage = useMemo(() => {
    return generateWhatsAppMessage({
      customerName: customerName || 'Cliente',
      eventType,
      eventDate,
      eventTime,
      guestCount,
      serviceName: selectedService.name,
      addonsList: selectedAddonsFull.map((a) => `${a.name} (Sob consulta)`),
      city,
      neighborhood: `${neighborhood} (${spaceType})`,
      notes,
      estimatedPrice: pricing.totalEstimatedPrice,
    });
  }, [
    customerName,
    eventType,
    eventDate,
    eventTime,
    guestCount,
    selectedService.name,
    selectedAddonsFull,
    city,
    neighborhood,
    spaceType,
    notes,
    pricing.totalEstimatedPrice,
  ]);

  const handleCompleteAndSendWhatsApp = () => {
    setIsSubmitting(true);

    const generatedQuote: QuoteRequest = {
      id: `quote-${Date.now()}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      eventType,
      eventDate,
      eventTime,
      guestCount,
      service: selectedService.name,
      serviceId: selectedService.id,
      addons: selectedAddonsFull.map((a) => a.name),
      city,
      neighborhood: `${neighborhood} (${spaceType})`,
      address: `${neighborhood}, ${city} (${spaceType})`,
      notes: notes || undefined,
      estimatedPrice: pricing.totalEstimatedPrice,
      status: 'novo',
      createdAt: new Date().toISOString(),
      internalNotes: 'Enviado pelo cliente via Monte seu Evento.',
    };

    saveLocalQuote(generatedQuote);
    setIsSubmitting(false);

    const url = buildWhatsAppUrl(currentWhatsAppMessage, COMPANY_CONFIG.whatsapp);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentWhatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 pb-32 sm:pb-20">
      {/* Editorial Flow Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-baseline justify-between mb-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C8521A] font-bold">
              0{currentStep} / 08
            </span>
            <span className="text-[#8B7355] text-xs font-medium uppercase tracking-wider">
              • {STEP_CONFIG[currentStep - 1].shortLabel}
            </span>
          </div>

          <div className="font-mono text-xs font-semibold text-[#071E15]">
            Estimativa: <span className="text-[#C8521A] font-bold">{formatBRL(pricing.totalEstimatedPrice)}</span>
          </div>
        </div>

        {/* Minimalist Progress Line */}
        <div className="h-1 w-full bg-[#E5DFD5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C8521A] transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Feedback */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: EVENTO */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 01 • OCASIÃO
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Qual celebração vamos realizar?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Selecione o formato para adequarmos o estilo de atendimento e tempo de serviço.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
            {EVENT_TYPE_OPTIONS.map((opt) => {
              const isSelected = eventType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setEventType(opt.id);
                    setErrorMsg(null);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] ${
                    isSelected
                      ? 'border-[#C8521A] bg-[#FFF8F3] shadow-xs ring-1 ring-[#C8521A]'
                      : 'border-[#E5DFD5] bg-white hover:border-[#071E15]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{opt.icon}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#C8521A]" />}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-[#071E15] font-medium">
                    {opt.label}
                  </h3>
                  <p className="text-xs text-[#55635C] mt-0.5 font-light">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: BUFFET */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 02 • GASTRONOMIA
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Qual cardápio melhor combina com sua festa?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Todos os pacotes incluem alimentação completa, bebidas não alcoólicas, equipe profissional e descartáveis.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {SERVICES_DATA.map((srv) => {
              const isSelected = serviceId === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => {
                    setServiceId(srv.id);
                    setErrorMsg(null);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-150 active:scale-[0.99] flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-[#C8521A] bg-[#FFF8F3] shadow-xs ring-1 ring-[#C8521A]'
                      : 'border-[#E5DFD5] bg-white hover:border-[#071E15]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                      <Image
                        src={srv.heroImage}
                        alt={srv.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-medium text-[#071E15]">
                          {srv.name}
                        </h3>
                        {isSelected && <Check className="w-4 h-4 text-[#C8521A]" />}
                      </div>
                      <p className="text-xs text-[#55635C] mt-0.5 line-clamp-2 font-light">
                        {srv.shortDescription}
                      </p>
                      {srv.basePriceCash && (
                        <p className="text-xs font-semibold text-[#C8521A] mt-1.5 font-mono">
                          Promoção até 50 pessoas: 10x de R$ {srv.basePriceInstallments} ou R$ {srv.basePriceCash.toLocaleString('pt-BR')} à vista
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: CONVIDADOS */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 03 • CONVIDADOS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Quantas pessoas você pretende receber?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Pacote promocional oficial estruturado para até 50 pessoas. Ajustamos para a quantidade exata da sua lista.
            </p>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 pt-2">
            {GUEST_PRESETS.map((preset) => {
              const isSelected = !customGuestMode && guestCount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setCustomGuestMode(false);
                    setGuestCount(preset);
                    setErrorMsg(null);
                  }}
                  className={`py-3.5 rounded-xl border text-center transition-all duration-150 active:scale-[0.98] ${
                    isSelected
                      ? 'border-[#C8521A] bg-[#FFF8F3] text-[#071E15] font-bold ring-1 ring-[#C8521A]'
                      : 'border-[#E5DFD5] bg-white text-[#55635C] hover:border-[#071E15]/30'
                  }`}
                >
                  <span className="text-sm sm:text-base font-serif">{preset}</span>
                  <span className="block text-[10px] text-[#8B7355]">convidados</span>
                </button>
              );
            })}
          </div>

          {/* Custom guest count input */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-medium text-[#071E15] block">
                Outra quantidade de pessoas:
              </span>
              <span className="text-[11px] text-[#55635C] font-light">
                Digite o número exato de adultos e crianças
              </span>
            </div>
            <input
              type="number"
              min={10}
              max={500}
              value={guestCount}
              onChange={(e) => {
                setCustomGuestMode(true);
                setGuestCount(Math.max(10, parseInt(e.target.value) || 10));
              }}
              className="w-24 text-center font-serif text-xl font-bold p-2 rounded-lg border border-[#E5DFD5] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
            />
          </div>
        </div>
      )}

      {/* STEP 4: DATA & HORÁRIO */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 04 • AGENDA
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Qual é a data e o horário previsto?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Chegamos com antecedência ao local para montagem, mise en place e início pontual.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
              <label htmlFor="eventDateInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15]">
                Data do Evento:
              </label>
              <input
                id="eventDateInput"
                type="date"
                min={MIN_EVENT_DATE}
                value={eventDate}
                onChange={(e) => {
                  setEventDate(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
              <label htmlFor="eventTimeInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15]">
                Horário de Início do Serviço:
              </label>
              <input
                id="eventTimeInput"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: LOCAL */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 05 • LOCALIDADE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Onde será realizada a celebração?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Atendemos toda a cidade de São Paulo, ABC Paulista e municípios vizinhos.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5]">
                <label htmlFor="cityInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                  Cidade:
                </label>
                <select
                  id="cityInput"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                >
                  <option value="São Paulo">São Paulo (Capital)</option>
                  <option value="Santo André">Santo André (ABC)</option>
                  <option value="São Bernardo do Campo">São Bernardo do Campo</option>
                  <option value="São Caetano do Sul">São Caetano do Sul</option>
                  <option value="Diadema">Diadema</option>
                  <option value="Barueri / Alphaville">Barueri / Alphaville</option>
                  <option value="Osasco">Osasco</option>
                  <option value="Guarulhos">Guarulhos</option>
                  <option value="Outra Cidade">Outra Cidade (Sob consulta)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5]">
                <label htmlFor="neighborhoodInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                  Bairro:
                </label>
                <input
                  id="neighborhoodInput"
                  type="text"
                  placeholder="Ex: Pinheiros, Moema, Campestre..."
                  value={neighborhood}
                  onChange={(e) => {
                    setNeighborhood(e.target.value);
                    setErrorMsg(null);
                  }}
                  className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5]">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                Tipo do Espaço:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'casa', label: 'Casa' },
                  { id: 'apartamento', label: 'Salão de Prédio' },
                  { id: 'chacara', label: 'Chácara / Sítio' },
                  { id: 'empresa', label: 'Espaço Comercial' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSpaceType(sp.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      spaceType === sp.id
                        ? 'border-[#C8521A] bg-[#FFF8F3] text-[#071E15] font-bold'
                        : 'border-[#E5DFD5] text-[#55635C]'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: NECESSIDADES & OPCIONAIS */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 06 • ITENS SOB CONSULTA
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Deseja incluir adicionais sob consulta?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Itens opcionais para complementar o pacote base oficial. A equipe confirma a disponibilidade na proposta.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {ADDONS_DATA.map((addon) => {
              const isChecked = selectedAddonIds.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                    isChecked
                      ? 'border-[#C8521A] bg-[#FFF8F3] shadow-xs ring-1 ring-[#C8521A]'
                      : 'border-[#E5DFD5] bg-white hover:border-[#071E15]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-[#C8521A] border-[#C8521A] text-white' : 'border-[#E5DFD5]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#071E15]">
                        {addon.name}
                      </p>
                      <p className="text-[11px] text-[#55635C] font-light">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8B7355] shrink-0 ml-2">
                    Sob consulta
                  </span>
                </div>
              );
            })}

            <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] mt-4">
              <label htmlFor="notesInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                Restrições Alimentares ou Observações Especiais:
              </label>
              <textarea
                id="notesInput"
                rows={2}
                placeholder="Ex: convidados vegetarianos, preferência por ponto da carne, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5DFD5] text-xs sm:text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: CONTATO */}
      {currentStep === 7 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 07 • SEUS DADOS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Como podemos te chamar?
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Informe seu WhatsApp para validarmos a data e enviarmos a proposta formal personalizada.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5]">
              <label htmlFor="nameInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                Seu Nome Completo:
              </label>
              <input
                id="nameInput"
                type="text"
                placeholder="Ex: Mariana Castro"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5]">
              <label htmlFor="phoneInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                WhatsApp com DDD:
              </label>
              <input
                id="phoneInput"
                type="tel"
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5]">
              <label htmlFor="emailInput" className="block text-xs font-semibold uppercase tracking-wider text-[#071E15] mb-2">
                E-mail (Opcional):
              </label>
              <input
                id="emailInput"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5DFD5] text-sm text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: RESUMO & WHATSAPP */}
      {currentStep === 8 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8521A] block mb-1">
              PASSO 08 • CONFERÊNCIA
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#071E15] font-normal tracking-tight">
              Tudo pronto para sua festa!
            </h2>
            <p className="text-xs sm:text-sm text-[#55635C] mt-2 font-light">
              Revise a simulação abaixo e envie com um clique para a equipe da SD Eventos no WhatsApp.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm space-y-6">
            {/* Header of summary */}
            <div className="border-b border-[#E5DFD5] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#8B7355] uppercase tracking-wider">
                  SOLICITANTE: {customerName}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#071E15]">
                  {selectedService.name}
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DFD5] text-[#071E15] font-semibold">
                {guestCount} convidados
              </span>
            </div>

            {/* Event Key Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#8B7355] block">Ocasião:</span>
                <span className="font-medium text-[#071E15] capitalize">{eventType}</span>
              </div>
              <div>
                <span className="text-[#8B7355] block">Data:</span>
                <span className="font-medium text-[#071E15]">
                  {eventDate ? eventDate.split('-').reverse().join('/') : 'A definir'}
                </span>
              </div>
              <div>
                <span className="text-[#8B7355] block">Início:</span>
                <span className="font-medium text-[#071E15]">{eventTime}</span>
              </div>
              <div>
                <span className="text-[#8B7355] block">Local:</span>
                <span className="font-medium text-[#071E15]">{neighborhood || city}</span>
              </div>
            </div>

            {/* Included in official package */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]/80 space-y-2 text-xs">
              <span className="font-semibold text-[#071E15] block">
                Itens inclusos no pacote padrão oficial:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#55635C]">
                <div>• Alimentação completa preparada no local</div>
                <div>• Bebidas não alcoólicas inclusas</div>
                <div>• Equipe profissional de atendimento</div>
                <div>• Descartáveis completos inclusos</div>
              </div>
            </div>

            {/* Optional items if selected */}
            {selectedAddonsFull.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="font-semibold text-[#071E15] block">
                  Adicionais selecionados (Sob consulta):
                </span>
                {selectedAddonsFull.map((a) => (
                  <div key={a.id} className="text-[#55635C]">
                    + {a.name}
                  </div>
                ))}
              </div>
            )}

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-[#F3DFC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C8521A] font-semibold block">
                  Estimativa Inicial Base
                </span>
                <span className="font-serif text-3xl font-semibold text-[#071E15]">
                  {formatBRL(pricing.totalEstimatedPrice)}
                </span>
                {selectedService.basePriceInstallments && (
                  <p className="text-xs text-[#55635C] mt-0.5">
                    ou em até 10x sem burocracia na confirmação
                  </p>
                )}
              </div>

              <div className="text-[11px] text-[#7A8A82] italic sm:text-right max-w-xs">
                * Valores demonstrativos sujeitos à confirmação conforme data, endereço e disponibilidade da equipe.
              </div>
            </div>

            {/* Primary WhatsApp Action */}
            <button
              type="button"
              onClick={handleCompleteAndSendWhatsApp}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#25D366] text-[#071E15] font-semibold text-sm uppercase tracking-wider hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 text-[#071E15]" />
              <span>Enviar Proposta no WhatsApp da SD Eventos</span>
            </button>

            {/* Copy message helper */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 text-xs text-[#55635C] hover:text-[#071E15] transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Mensagem copiada para a área de transferência!' : 'Copiar texto da mensagem'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ergonomic Navigation Bar */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#E5DFD5]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#E5DFD5] bg-white text-xs font-semibold text-[#071E15] hover:bg-stone-50 transition-colors active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 8 && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#071E15] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#124330] transition-colors active:scale-[0.98] shadow-sm ml-auto"
          >
            <span>Continuar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function EventBuilderWizard() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-serif text-lg text-[#071E15]">
          Carregando simulador da SD Eventos...
        </div>
      }
    >
      <WizardInner />
    </Suspense>
  );
}
