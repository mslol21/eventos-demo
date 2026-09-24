'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Users,
  Calendar,
  Clock,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';
import { ADDONS_DATA } from '@/data/addons';
import { COMPANY_CONFIG } from '@/data/company';
import { calculateEstimatedPrice, formatBRL } from '@/lib/pricing';
import { buildWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';
import { saveLocalQuote } from '@/lib/storage';
import { EventType, QuoteRequest } from '@/types';

const EVENT_TYPE_OPTIONS: Array<{ id: EventType; label: string; icon: string }> = [
  { id: 'aniversario', label: 'Aniversário', icon: '🎂' },
  { id: 'casamento', label: 'Casamento / Noivado', icon: '💍' },
  { id: 'confraternizacao', label: 'Confraternização', icon: '🍻' },
  { id: 'empresarial', label: 'Evento Empresarial', icon: '💼' },
  { id: 'infantil', label: 'Festa Infantil', icon: '🎈' },
  { id: 'formatura', label: 'Formatura', icon: '🎓' },
  { id: 'outro', label: 'Outro / Especial', icon: '✨' },
];

const GUEST_PRESETS = [
  { label: 'Até 30', value: 30 },
  { label: '31 – 50', value: 50 },
  { label: '51 – 80', value: 80 },
  { label: '81 – 100', value: 100 },
  { label: 'Mais de 100', value: 120 },
];

function WizardInner() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('servico');

  // Form State initialized with query param if valid
  const [currentStep, setCurrentStep] = useState(1);
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
  const [eventType, setEventType] = useState<EventType>('aniversario');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    'bebidas-nao-alcoolicas',
  ]);

  // Contact State
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [city, setCity] = useState<string>('São Paulo');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  // Real-time pricing estimate calculation
  const pricing = useMemo(() => {
    return calculateEstimatedPrice(serviceId, guestCount, selectedAddonIds);
  }, [serviceId, guestCount, selectedAddonIds]);

  const selectedService = useMemo(() => {
    return SERVICES_DATA.find((s) => s.id === serviceId) || SERVICES_DATA[0];
  }, [serviceId]);

  const selectedAddonsFull = useMemo(() => {
    return ADDONS_DATA.filter((a) => selectedAddonIds.includes(a.id));
  }, [selectedAddonIds]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!serviceId) {
        setErrorMsg('Selecione uma opção de buffet para continuar.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!guestCount || guestCount < 10) {
        setErrorMsg('Informe uma quantidade válida de convidados (mínimo 10).');
        return false;
      }
    } else if (currentStep === 3) {
      if (!eventDate) {
        setErrorMsg('Por favor, informe a data prevista do evento.');
        return false;
      }
    } else if (currentStep === 4) {
      if (!eventType) {
        setErrorMsg('Selecione o tipo de evento.');
        return false;
      }
    } else if (currentStep === 6) {
      if (!customerName.trim() || customerName.trim().length < 2) {
        setErrorMsg('Por favor, informe seu nome.');
        return false;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Informe seu número de WhatsApp com DDD (ex: 11 98406-6393).');
        return false;
      }
      if (!city.trim()) {
        setErrorMsg('Informe a cidade onde será realizado o evento.');
        return false;
      }
      if (!neighborhood.trim()) {
        setErrorMsg('Informe o bairro do evento.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Structured WhatsApp Message & Submission
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const quoteData = {
      customerName,
      phone,
      email: email || undefined,
      eventType,
      eventDate,
      eventTime,
      guestCount,
      service: selectedService.name,
      serviceId: selectedService.id,
      selectedAddonIds,
      addons: selectedAddonsFull.map((a) => a.name),
      city,
      neighborhood,
      address,
      notes,
      estimatedPrice: pricing.totalEstimatedPrice,
    };

    let generatedQuote: QuoteRequest;

    try {
      // 1. Send to internal API endpoint with server-side price recalculation & rate limiting
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      });

      const json = await res.json();
      if (json.success && json.data) {
        generatedQuote = json.data;
      } else {
        throw new Error(json.error || 'Falha ao salvar');
      }
    } catch {
      // Fallback: create local quote object if offline or network issue
      generatedQuote = {
        id: `ORC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        customerName,
        phone,
        email: email || undefined,
        eventType,
        eventDate,
        eventTime,
        guestCount,
        service: selectedService.name,
        serviceId: selectedService.id,
        addons: selectedAddonsFull.map((a) => a.name),
        city,
        neighborhood,
        address,
        notes: notes || undefined,
        estimatedPrice: pricing.totalEstimatedPrice,
        status: 'novo',
        createdAt: new Date().toISOString(),
        internalNotes: 'Enviado pelo cliente via Monte seu Evento.',
      };
    }

    // 2. Persist in local storage for instant sync with /admin dashboard
    saveLocalQuote(generatedQuote);
    setSubmittedQuote(generatedQuote);
    setIsCompleted(true);
    setIsSubmitting(false);

    // 3. Generate structured WhatsApp Message
    const whatsAppMessage = generateWhatsAppMessage({
      customerName,
      eventType,
      eventDate,
      eventTime,
      guestCount,
      serviceName: selectedService.name,
      addonsList: selectedAddonsFull.map((a) => a.name),
      city,
      neighborhood,
      address,
      notes,
      estimatedPrice: pricing.totalEstimatedPrice,
    });

    const url = buildWhatsAppUrl(whatsAppMessage, COMPANY_CONFIG.whatsapp);

    // Open WhatsApp in a new tab
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const currentWhatsAppMessage = useMemo(() => {
    return generateWhatsAppMessage({
      customerName: customerName || 'Nome do Cliente',
      eventType,
      eventDate,
      eventTime,
      guestCount,
      serviceName: selectedService.name,
      addonsList: selectedAddonsFull.map((a) => a.name),
      city: city || 'São Paulo',
      neighborhood: neighborhood || 'Bairro',
      address,
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
    address,
    notes,
    pricing.totalEstimatedPrice,
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentWhatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Progress Stepper Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2F21] mb-2">
          <span>
            {currentStep < 7 ? `Etapa ${currentStep} de 6` : 'Resumo e Envio 🎉'}
          </span>
          <span className="text-[#E0631B]">
            {Math.round((Math.min(currentStep, 6) / 6) * 100)}% concluído
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#E9E2D7] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0B2F21] to-[#E0631B] transition-all duration-300 rounded-full"
            style={{ width: `${(Math.min(currentStep, 6) / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Error alert if step is invalid */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Buffets */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Etapa 1
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21] mt-1">
              Qual experiência você procura?
            </h1>
            <p className="text-sm text-[#5C6762] mt-1">
              Selecione o estilo gastronômico que mais combina com seu evento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES_DATA.map((service) => {
              const isSelected = serviceId === service.id;
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setServiceId(service.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between group relative overflow-hidden focus:outline-none ${
                    isSelected
                      ? 'border-[#E0631B] bg-white ring-2 ring-[#E0631B]/20 shadow-md'
                      : 'border-[#E9E2D7] bg-white hover:border-[#0B2F21]/40 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative h-20 w-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={service.heroImage}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#E0631B] bg-[#E0631B] text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0B2F21]">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#5C6762] mt-1 line-clamp-2">
                      {service.shortDescription}
                    </p>
                  </div>

                  {service.basePriceCash && (
                    <div className="mt-3 pt-3 border-t border-[#F3EFE9] flex items-center justify-between text-xs">
                      <span className="text-[#C44E0F] font-semibold">
                        A partir de 10x R$ {service.basePriceInstallments}
                      </span>
                      <span className="text-gray-400">até 50 pessoas</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Guests */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Etapa 2
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21] mt-1">
              Quantas pessoas participarão?
            </h1>
            <p className="text-sm text-[#5C6762] mt-1">
              Escolha uma faixa rápida ou digite a quantidade exata de convidados.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GUEST_PRESETS.map((preset) => {
              const isSelected = !customGuestMode && guestCount === preset.value;
              return (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => {
                    setCustomGuestMode(false);
                    setGuestCount(preset.value);
                  }}
                  className={`p-4 rounded-xl border-2 text-center transition-all focus:outline-none ${
                    isSelected
                      ? 'border-[#E0631B] bg-white ring-2 ring-[#E0631B]/20 text-[#0B2F21] font-bold shadow-sm'
                      : 'border-[#E9E2D7] bg-white text-[#5C6762] hover:border-[#0B2F21]/40'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1 text-[#E0631B]" />
                  <span className="text-sm">{preset.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCustomGuestMode(true)}
              className={`p-4 rounded-xl border-2 text-center transition-all focus:outline-none ${
                customGuestMode
                  ? 'border-[#E0631B] bg-white ring-2 ring-[#E0631B]/20 text-[#0B2F21] font-bold shadow-sm'
                  : 'border-[#E9E2D7] bg-white text-[#5C6762] hover:border-[#0B2F21]/40'
              }`}
            >
              <Plus className="w-5 h-5 mx-auto mb-1 text-[#E0631B]" />
              <span className="text-sm">Personalizado</span>
            </button>
          </div>

          {/* Custom Input or Slider */}
          <div className="p-6 rounded-2xl bg-white border border-[#E9E2D7] space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="guestInput" className="font-semibold text-sm text-[#0B2F21]">
                Quantidade selecionada:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="guestInput"
                  type="number"
                  min={10}
                  max={500}
                  value={guestCount}
                  onChange={(e) => {
                    setCustomGuestMode(true);
                    setGuestCount(Math.max(10, parseInt(e.target.value) || 10));
                  }}
                  className="w-24 text-center font-serif text-xl font-bold p-2 rounded-lg border border-[#E9E2D7] focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
                <span className="text-sm text-[#5C6762]">pessoas</span>
              </div>
            </div>

            <input
              type="range"
              min={15}
              max={250}
              step={5}
              value={guestCount}
              onChange={(e) => {
                setCustomGuestMode(true);
                setGuestCount(parseInt(e.target.value));
              }}
              className="w-full accent-[#E0631B] cursor-pointer"
            />

            <p className="text-xs text-[#5C6762]">
              * Crianças de até 6 anos não contam no cálculo de buffet; de 7 a 10 anos pagam meia.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Etapa 3
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21] mt-1">
              Quando será o evento?
            </h1>
            <p className="text-sm text-[#5C6762] mt-1">
              Informe a data prevista e o horário aproximado de início.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E9E2D7] space-y-2">
              <label htmlFor="eventDate" className="flex items-center gap-2 text-sm font-semibold text-[#0B2F21]">
                <Calendar className="w-4 h-4 text-[#E0631B]" />
                <span>Data prevista</span>
              </label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
              />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E9E2D7] space-y-2">
              <label htmlFor="eventTime" className="flex items-center gap-2 text-sm font-semibold text-[#0B2F21]">
                <Clock className="w-4 h-4 text-[#E0631B]" />
                <span>Horário aproximado de início</span>
              </label>
              <select
                id="eventTime"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
              >
                <option value="11:30">11h30 (Almoço)</option>
                <option value="12:00">12h00 (Almoço)</option>
                <option value="13:00">13h00 (Almoço / Tarde)</option>
                <option value="16:00">16h00 (Sunset / Tarde)</option>
                <option value="18:00">18h00 (Coquetel / Início noite)</option>
                <option value="19:00">19h00 (Jantar)</option>
                <option value="20:00">20h00 (Jantar / Festa)</option>
                <option value="outro">Outro horário a combinar</option>
              </select>
            </div>
          </div>

          {/* Non-promising availability disclaimer banner */}
          <div className="p-4 rounded-xl bg-[#FFF6F0] border border-[#FFE6D6] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#E0631B] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#0B2F21]">
              <strong>Importante:</strong> A disponibilidade da data será confirmada diretamente pela equipe SD Eventos após a conferência de nossa agenda e escala de equipes.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: Event Type */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Etapa 4
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21] mt-1">
              Que tipo de evento será?
            </h1>
            <p className="text-sm text-[#5C6762] mt-1">
              Isso nos ajuda a sugerir a melhor dinâmica de atendimento para seus convidados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EVENT_TYPE_OPTIONS.map((item) => {
              const isSelected = eventType === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setEventType(item.id)}
                  className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all focus:outline-none ${
                    isSelected
                      ? 'border-[#E0631B] bg-white ring-2 ring-[#E0631B]/20 text-[#0B2F21] font-bold shadow-sm'
                      : 'border-[#E9E2D7] bg-white text-[#5C6762] hover:border-[#0B2F21]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#E0631B] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: Add-ons */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Etapa 5
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21] mt-1">
              Personalize seu evento
            </h1>
            <p className="text-sm text-[#5C6762] mt-1">
              Selecione itens complementares para enriquecer sua celebração.
            </p>
          </div>

          <div className="space-y-3">
            {ADDONS_DATA.map((addon) => {
              const isSelected = selectedAddonIds.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`cursor-pointer p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-[#E0631B] bg-white ring-2 ring-[#E0631B]/15 shadow-sm'
                      : 'border-[#E9E2D7] bg-white hover:border-[#0B2F21]/30'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#E0631B] bg-[#E0631B] text-white'
                          : 'border-gray-300 bg-[#FAF8F5]'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#0B2F21]">
                          {addon.name}
                        </h4>
                        {addon.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5C6762] mt-1 max-w-xl">
                        {addon.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <span className="font-bold text-sm text-[#0B2F21]">
                      {addon.pricePerPerson
                        ? `${formatBRL(addon.pricePerPerson)}`
                        : `${formatBRL(addon.fixedPrice || 0)}`}
                    </span>
                    <span className="block text-[11px] text-[#5C6762]">
                      {addon.unitLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 6: Event & Contact Details */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Etapa 6
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2F21] mt-1">
              Dados do Evento & Contato
            </h1>
            <p className="text-sm text-[#5C6762] mt-1">
              Para onde e para quem devemos formalizar a proposta?
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E2D7] shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="customerName" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Seu Nome Completo *
                </label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="Ex: Amanda Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="customerPhone" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  WhatsApp com DDD *
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  placeholder="(11) 98406-6393"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="customerCity" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Cidade do Evento *
                </label>
                <input
                  id="customerCity"
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="customerNeighborhood" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Bairro *
                </label>
                <input
                  id="customerNeighborhood"
                  type="text"
                  placeholder="Ex: Moema / Tatuapé / Jardins"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customerAddress" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                Endereço ou Tipo do Local (Opcional)
              </label>
              <input
                id="customerAddress"
                type="text"
                placeholder="Ex: Salão de festas do condomínio, chácara da família, residência"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customerEmail" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                E-mail (Opcional para envio de PDF)
              </label>
              <input
                id="customerEmail"
                type="email"
                placeholder="Ex: amanda@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customerNotes" className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                Observações, restrições ou pedidos especiais
              </label>
              <textarea
                id="customerNotes"
                rows={3}
                placeholder="Ex: Teremos convidados com restrição a lactose; local possui churrasqueira de alvenaria com pia ao lado."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: RESUMO & CONFIRMAÇÃO */}
      {currentStep === 7 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E0631B]">
              Tudo pronto
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2F21] mt-1">
              Seu evento está quase pronto 🎉
            </h1>
            <p className="text-sm text-[#5C6762] mt-2 max-w-xl mx-auto">
              Confira os detalhes da sua simulação e envie para o WhatsApp da SD Eventos para validar a disponibilidade e receber o orçamento final.
            </p>
          </div>

          {/* Master Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E9E2D7] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#F3EFE9]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C44E0F] font-bold">
                  Cardápio Selecionado
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0B2F21]">
                  {selectedService.name}
                </h3>
                <p className="text-xs text-[#5C6762] mt-1">
                  {selectedService.tagline}
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5C6762]">Tipo de evento:</span>
                  <span className="font-semibold text-[#0B2F21] capitalize">
                    {eventType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6762]">Convidados:</span>
                  <span className="font-semibold text-[#0B2F21]">
                    {guestCount} pessoas
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6762]">Data prevista:</span>
                  <span className="font-semibold text-[#0B2F21]">
                    {eventDate
                      ? `${eventDate.split('-')[2]}/${eventDate.split('-')[1]}/${
                          eventDate.split('-')[0]
                        }`
                      : 'A combinar'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6762]">Horário aproximado:</span>
                  <span className="font-semibold text-[#0B2F21]">{eventTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6762]">Local:</span>
                  <span className="font-semibold text-[#0B2F21]">
                    {neighborhood ? `${neighborhood}, ` : ''}
                    {city}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Add-ons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2F21] mb-2">
                Adicionais Escolhidos:
              </h4>
              {selectedAddonsFull.length > 0 ? (
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#5C6762]">
                  {selectedAddonsFull.map((addon) => (
                    <li key={addon.id} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E0631B]" />
                      <span>{addon.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Nenhum adicional selecionado.
                </p>
              )}
            </div>

            {/* Pricing Estimation Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF6F0] to-[#FAF8F5] border-2 border-[#FFE6D6] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C44E0F]">
                    Estimativa Inicial
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0B2F21]">
                      {formatBRL(pricing.totalEstimatedPrice)}
                    </span>
                    <span className="text-xs text-[#5C6762]">
                      ou em até 10x de {formatBRL(pricing.installments10x)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Calculado para {guestCount} pessoas
                  </span>
                </div>
              </div>

              {/* Strict Requirement Disclaimer */}
              <div className="pt-3 border-t border-[#FFE6D6] text-xs text-[#5C6762] space-y-1">
                <p className="font-semibold text-[#0B2F21]">
                  Atenção sobre valores:
                </p>
                <p>
                  Este valor é apenas uma estimativa inicial. O orçamento final com itens detalhados, cardápio formal e eventuais taxas de deslocamento será confirmado e enviado pela equipe SD Eventos.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-6 rounded-2xl text-sm sm:text-base font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <MessageCircle className="w-6 h-6" />
                <span>
                  {isSubmitting
                    ? 'Preparando seu orçamento...'
                    : 'Solicitar Orçamento pelo WhatsApp'}
                </span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5C6762] pt-2">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 hover:text-[#0B2F21] underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Mensagem copiada!' : 'Copiar texto da mensagem'}</span>
                </button>

                <span className="text-gray-400">
                  Canal oficial SD Eventos: {COMPANY_CONFIG.whatsappFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Success Dialog & Confirmation if completed */}
          {isCompleted && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  Solicitação {submittedQuote?.id ? `(${submittedQuote.id}) ` : ''}gerada com sucesso!
                </span>
              </div>
              <p className="text-xs sm:text-sm">
                Caso a janela do WhatsApp não tenha aberto automaticamente, clique no botão abaixo para conversar com a nossa equipe agora mesmo:
              </p>
              <div className="pt-2">
                <a
                  href={buildWhatsAppUrl(currentWhatsAppMessage, COMPANY_CONFIG.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                >
                  <span>Abrir WhatsApp Novamente</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons (Back & Next) */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#E9E2D7]">
        {currentStep > 1 && currentStep < 7 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border border-[#E9E2D7] bg-white text-[#0B2F21] hover:bg-[#FAF8F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        ) : currentStep === 7 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border border-[#E9E2D7] bg-white text-[#0B2F21] hover:bg-[#FAF8F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Editar Informações</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 7 && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#E0631B] text-white hover:bg-[#C44E0F] shadow hover:shadow-md transition-all active:scale-95"
          >
            <span>{currentStep === 6 ? 'Ver Resumo Final' : 'Avançar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function EventBuilderWizard() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-[#5C6762]">Carregando simulador de eventos...</div>}>
      <WizardInner />
    </Suspense>
  );
}
