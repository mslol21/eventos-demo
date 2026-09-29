'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  UtensilsCrossed,
  Tag,
  Sliders,
  Settings,
  Search,
  Download,
  MessageCircle,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Edit,
  Trash2,
  X,
  Save,
  Plus,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useSiteData } from '@/lib/useSiteData';
import { exportQuotesToCSV } from '@/lib/storage';
import { formatBRL } from '@/lib/pricing';
import { generateAdminQuoteProposalUrl, generateAdminFollowUpUrl } from '@/lib/whatsapp';
import {
  QuoteRequest,
  QuoteStatus,
  ServiceOption,
  AddonOption,
  EventType,
} from '@/types';

type AdminTab =
  | 'dashboard'
  | 'orcamentos'
  | 'novo-orcamento'
  | 'servicos'
  | 'promocoes'
  | 'adicionais'
  | 'configuracoes';

const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  novo: {
    label: 'Novo Lead',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  em_contato: {
    label: 'Em Atendimento',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  orçamento_enviado: {
    label: 'Proposta Enviada',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  negociação: {
    label: 'Em Negociação',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  fechado: {
    label: 'Fechado 🎉',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
  },
  perdido: {
    label: 'Perdido / Cancelado',
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'border-stone-200',
  },
};

const EVENT_TYPE_OPTIONS: Array<{ id: EventType; label: string }> = [
  { id: 'aniversario', label: 'Aniversário' },
  { id: 'casamento', label: 'Casamento / Noivado' },
  { id: 'confraternizacao', label: 'Confraternização' },
  { id: 'empresarial', label: 'Corporativo / Empresa' },
  { id: 'infantil', label: 'Festa Infantil' },
  { id: 'formatura', label: 'Formatura' },
  { id: 'outro', label: 'Outro Formato' },
];

export function AdminDashboard() {
  const {
    services,
    company,
    addons,
    promotions,
    quotes,
    updateService,
    resetServices,
    updateCompany,
    resetCompany,
    updateAddon,
    resetAddons,
    updatePromotion,
    createPromotion,
    deletePromotion,
    resetPromotions,
    updateQuoteStatus,
    deleteQuote,
    createManualQuote,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  // Filters for quotes
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Editing service state
  const [editingService, setEditingService] = useState<ServiceOption | null>(null);
  const [newItemIncluded, setNewItemIncluded] = useState('');

  // Creating promotion state
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [newPromoForm, setNewPromoForm] = useState({
    title: '',
    badge: 'Destaque',
    description: '',
    discountNote: '',
    highlightPrice: '',
    targetServiceId: 'churrasco',
    validUntil: '',
    showGlobalBanner: true,
    bannerText: '',
    bannerCtaText: 'Simular Evento',
    bannerLink: '/monte-seu-evento',
    active: true,
  });

  // Editing addon state
  const [editingAddon, setEditingAddon] = useState<AddonOption | null>(null);

  // Manual Quote Form State
  const [manualForm, setManualForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    eventType: 'aniversario' as EventType,
    eventDate: '',
    eventTime: '13:00',
    guestCount: 50,
    serviceId: 'churrasco',
    addons: [] as string[],
    city: 'São Paulo',
    neighborhood: '',
    address: '',
    notes: '',
    customPrice: '' as string | number,
    internalNotes: '',
    status: 'orçamento_enviado' as QuoteStatus,
  });

  // Toast / feedback message
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = quotes.length;
    const novos = quotes.filter((q) => q.status === 'novo').length;
    const fechados = quotes.filter((q) => q.status === 'fechado');
    const valorFechado = fechados.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);
    const emNegociacao = quotes.filter(
      (q) => q.status === 'negociação' || q.status === 'orçamento_enviado'
    );
    const valorNegociacao = emNegociacao.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);
    const ticketMedio = fechados.length > 0 ? valorFechado / fechados.length : 3500;
    const taxaConversao = total > 0 ? Math.round((fechados.length / total) * 100) : 0;

    return {
      total,
      novos,
      fechadosCount: fechados.length,
      valorFechado,
      valorNegociacao,
      ticketMedio,
      taxaConversao,
    };
  }, [quotes]);

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus = statusFilter === 'todos' || q.status === statusFilter;
      const qLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        q.customerName.toLowerCase().includes(qLower) ||
        q.phone.includes(qLower) ||
        q.service.toLowerCase().includes(qLower) ||
        (q.neighborhood && q.neighborhood.toLowerCase().includes(qLower)) ||
        (q.city && q.city.toLowerCase().includes(qLower));

      return matchesStatus && matchesSearch;
    });
  }, [quotes, statusFilter, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    const csvData = exportQuotesToCSV(filteredQuotes);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orcamentos-sd-eventos-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('Relatório CSV exportado com sucesso!');
  };

  // Handle manual quote submit
  const handleCreateManualQuoteSubmit = (e: React.FormEvent, sendToWhatsApp = false) => {
    e.preventDefault();
    if (!manualForm.customerName || !manualForm.phone) {
      alert('Por favor, informe ao menos o nome e WhatsApp do cliente.');
      return;
    }

    const priceNum = manualForm.customPrice !== '' ? Number(manualForm.customPrice) : undefined;

    const created = createManualQuote({
      ...manualForm,
      customPrice: priceNum,
    });

    showFeedback('Orçamento cadastrado com sucesso!');

    if (sendToWhatsApp) {
      const url = generateAdminQuoteProposalUrl(created);
      window.open(url, '_blank');
    }

    // Reset form and switch to quotes tab
    setManualForm({
      customerName: '',
      phone: '',
      email: '',
      eventType: 'aniversario',
      eventDate: '',
      eventTime: '13:00',
      guestCount: 50,
      serviceId: 'churrasco',
      addons: [],
      city: 'São Paulo',
      neighborhood: '',
      address: '',
      notes: '',
      customPrice: '',
      internalNotes: '',
      status: 'orçamento_enviado',
    });

    setActiveTab('orcamentos');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#121815] flex flex-col">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#071E15] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C5A059]/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="bg-[#071E15] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 shrink-0 rounded-full border border-[#C5A059]/60 flex items-center justify-center font-serif text-sm text-[#C5A059]">
                SD
              </div>
              <div className="whitespace-nowrap">
                <span className="font-serif text-sm sm:text-base font-normal tracking-wider block leading-none">
                  SD EVENTOS
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059]">
                  Painel de Gestão
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Ambiente Ativo
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/90 hover:bg-white/10 transition-colors"
            >
              <span className="hidden sm:inline">Ver Site Público</span>
              <span className="sm:hidden">Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setActiveTab('novo-orcamento')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#E0631B] text-white text-xs font-semibold hover:bg-[#C44E0F] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo Orçamento</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-white border-b border-[#E5DFD5] sticky top-16 z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-14">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
            { id: 'orcamentos', label: `Orçamentos (${quotes.length})`, icon: ClipboardList },
            { id: 'novo-orcamento', label: '+ Criar Orçamento', icon: PlusCircle },
            { id: 'servicos', label: 'Cardápios & Preços', icon: UtensilsCrossed },
            { id: 'promocoes', label: 'Campanhas & Promoções', icon: Tag },
            { id: 'adicionais', label: 'Opcionais', icon: Sliders },
            { id: 'configuracoes', label: 'Configurações do Site', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#071E15] text-white font-semibold shadow-xs'
                    : 'text-[#55635C] hover:bg-stone-100 hover:text-[#071E15]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================================== */}
        {/* TAB 1: DASHBOARD / VISÃO GERAL */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                  Controle Comercial da SD Eventos
                </h1>
                <p className="text-xs text-[#55635C] mt-1 font-light">
                  Acompanhamento de solicitações recebidas, valores em negociação e cotações.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-semibold text-[#071E15] hover:bg-stone-50 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8521A]" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  onClick={() => setActiveTab('novo-orcamento')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071E15] text-white text-xs font-semibold hover:bg-[#124330] transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Cadastrar Proposta</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                <div className="flex items-center justify-between text-[#8B7355] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Total de Cotações</span>
                  <ClipboardList className="w-4 h-4 text-[#C8521A]" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#071E15]">
                  {kpis.total}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">
                  {kpis.novos} novos leads para responder
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                <div className="flex items-center justify-between text-[#8B7355] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Em Negociação</span>
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#071E15]">
                  {formatBRL(kpis.valorNegociacao)}
                </div>
                <span className="text-[11px] text-[#55635C] font-light mt-1 inline-block">
                  Valor potencial em aberto
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                <div className="flex items-center justify-between text-[#8B7355] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Eventos Fechados</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-3xl font-semibold text-emerald-800">
                  {formatBRL(kpis.valorFechado)}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">
                  {kpis.fechadosCount} contratos fechados
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                <div className="flex items-center justify-between text-[#8B7355] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Ticket Médio</span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#071E15]">
                  {formatBRL(kpis.ticketMedio)}
                </div>
                <span className="text-[11px] text-[#55635C] font-light mt-1 inline-block">
                  Taxa de conversão: ~{kpis.taxaConversao}%
                </span>
              </div>
            </div>

            {/* Recent Quotes Quick Access */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-normal text-[#071E15]">
                    Últimas Solicitações de Orçamento
                  </h2>
                  <p className="text-xs text-[#55635C] font-light">
                    Clientes que simularam no site ou foram cadastrados recentemente.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('orcamentos')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8521A] hover:underline"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#E5DFD5]">
                {quotes.slice(0, 5).map((q) => {
                  const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.novo;
                  return (
                    <div
                      key={q.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-100 border border-[#E5DFD5] flex items-center justify-center font-serif text-sm text-[#071E15] font-semibold shrink-0">
                          {q.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#071E15]">
                              {q.customerName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#55635C] mt-0.5">
                            {q.service} • {q.guestCount} convidados • {q.neighborhood || q.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:self-center">
                        <div className="text-right">
                          <span className="font-serif text-base font-semibold text-[#071E15] block">
                            {formatBRL(q.estimatedPrice)}
                          </span>
                          <span className="text-[10px] text-[#8B7355]">
                            {q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                          </span>
                        </div>

                        <a
                          href={generateAdminQuoteProposalUrl(q)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
                          title="Enviar proposta pronta no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="px-3 py-1.5 rounded-xl border border-[#E5DFD5] text-xs font-semibold text-[#071E15] hover:bg-white"
                        >
                          Detalhes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GESTÃO COMPLETA DE ORÇAMENTOS */}
        {/* ============================================================== */}
        {activeTab === 'orcamentos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                  Gestão de Cotações & Propostas
                </h1>
                <p className="text-xs text-[#55635C] font-light">
                  {filteredQuotes.length} de {quotes.length} orçamentos encontrados.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-semibold text-[#071E15] hover:bg-stone-50 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8521A]" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  onClick={() => setActiveTab('novo-orcamento')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E0631B] text-white text-xs font-semibold hover:bg-[#C44E0F] shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Orçamento</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, telefone, serviço ou bairro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                />
              </div>

              {/* Status pills filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'novo', label: 'Novos' },
                  { id: 'em_contato', label: 'Em Contato' },
                  { id: 'orçamento_enviado', label: 'Proposta' },
                  { id: 'negociação', label: 'Negociação' },
                  { id: 'fechado', label: 'Fechados' },
                  { id: 'perdido', label: 'Perdidos' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      statusFilter === st.id
                        ? 'bg-[#071E15] text-white font-semibold'
                        : 'bg-stone-50 text-[#55635C] hover:bg-stone-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#8B7355] uppercase text-[10px] tracking-wider border-b border-[#E5DFD5]">
                    <tr>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Contato / Local</th>
                      <th className="py-3 px-4">Serviço / Convidados</th>
                      <th className="py-3 px-4">Data do Evento</th>
                      <th className="py-3 px-4">Valor Estimado</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD5]">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#55635C]">
                          Nenhum orçamento encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((q) => {
                        const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.novo;
                        return (
                          <tr key={q.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-sm text-[#071E15] block">
                                {q.customerName}
                              </span>
                              <span className="text-[10px] text-[#8B7355]">
                                Criado em: {q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-[#55635C]">
                              <span className="font-medium text-[#071E15] block">{q.phone}</span>
                              <span className="text-[11px]">{q.neighborhood || q.city}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-medium text-[#071E15] block">{q.service}</span>
                              <span className="text-[11px] text-[#55635C]">
                                {q.guestCount} convidados
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-[#55635C]">
                              <span className="block font-medium text-[#071E15]">
                                {q.eventDate ? q.eventDate.split('-').reverse().join('/') : 'A combinar'}
                              </span>
                              <span className="text-[11px]">{q.eventTime || '13:00'}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-serif font-semibold text-sm text-[#071E15] block">
                                {formatBRL(q.estimatedPrice)}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <select
                                value={q.status}
                                onChange={(e) => {
                                  updateQuoteStatus(q.id, e.target.value as QuoteStatus);
                                  showFeedback(`Status atualizado para "${e.target.value}"`);
                                }}
                                className={`text-[11px] font-semibold py-1 px-2 rounded-lg border focus:outline-none ${cfg.bg} ${cfg.text} ${cfg.border}`}
                              >
                                <option value="novo">Novo Lead</option>
                                <option value="em_contato">Em Atendimento</option>
                                <option value="orçamento_enviado">Proposta Enviada</option>
                                <option value="negociação">Em Negociação</option>
                                <option value="fechado">Fechado 🎉</option>
                                <option value="perdido">Perdido / Cancelado</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={generateAdminQuoteProposalUrl(q)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                  title="Enviar proposta pronta no WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  onClick={() => setSelectedQuote(q)}
                                  className="p-1.5 rounded-lg border border-[#E5DFD5] text-[#071E15] hover:bg-stone-100 transition-colors"
                                  title="Ver todos os detalhes"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Deseja excluir a cotação de ${q.customerName}?`)) {
                                      deleteQuote(q.id);
                                      showFeedback('Orçamento excluído.');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CRIAR NOVO ORÇAMENTO MANUALMENTE */}
        {/* ============================================================== */}
        {activeTab === 'novo-orcamento' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C8521A] font-bold block mb-1">
                CADASTRO MANUAL
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                Criar Novo Orçamento
              </h1>
              <p className="text-xs text-[#55635C] font-light">
                Cadastre propostas negociadas por telefone, WhatsApp ou Instagram com recálculo automático de valores.
              </p>
            </div>

            <form
              onSubmit={(e) => handleCreateManualQuoteSubmit(e, false)}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-6"
            >
              {/* Cliente */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-3">
                  1. Dados do Cliente
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Nome do Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Albuquerque"
                      value={manualForm.customerName}
                      onChange={(e) => setManualForm({ ...manualForm, customerName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={manualForm.phone}
                      onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="cliente@email.com"
                      value={manualForm.email}
                      onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    />
                  </div>
                </div>
              </div>

              {/* Evento & Data */}
              <div className="border-t border-[#E5DFD5] pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-3">
                  2. Dados do Evento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Tipo de Evento
                    </label>
                    <select
                      value={manualForm.eventType}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, eventType: e.target.value as EventType })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    >
                      {EVENT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Data Prevista
                    </label>
                    <input
                      type="date"
                      value={manualForm.eventDate}
                      onChange={(e) => setManualForm({ ...manualForm, eventDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Horário de Início
                    </label>
                    <input
                      type="time"
                      value={manualForm.eventTime}
                      onChange={(e) => setManualForm({ ...manualForm, eventTime: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Convidados
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={manualForm.guestCount}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, guestCount: Number(e.target.value) || 10 })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">Cidade</label>
                    <input
                      type="text"
                      value={manualForm.city}
                      onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">Bairro</label>
                    <input
                      type="text"
                      placeholder="Ex: Pinheiros, Morumbi..."
                      value={manualForm.neighborhood}
                      onChange={(e) => setManualForm({ ...manualForm, neighborhood: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Endereço / Local
                    </label>
                    <input
                      type="text"
                      placeholder="Rua, número ou nome do condomínio"
                      value={manualForm.address}
                      onChange={(e) => setManualForm({ ...manualForm, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Serviço & Adicionais */}
              <div className="border-t border-[#E5DFD5] pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-3">
                  3. Cardápio & Opcionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Cardápio Escolhido
                    </label>
                    <select
                      value={manualForm.serviceId}
                      onChange={(e) => setManualForm({ ...manualForm, serviceId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.basePriceCash ? `Até 50p: R$ ${s.basePriceCash}` : 'Sob consulta'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                      Valor Customizado / Negociado (R$)
                    </label>
                    <input
                      type="number"
                      placeholder="Deixe em branco para calcular automaticamente"
                      value={manualForm.customPrice}
                      onChange={(e) => setManualForm({ ...manualForm, customPrice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#8B7355]">
                      Se vazio, calcula automaticamente com base no cardápio e convidados.
                    </span>
                  </div>
                </div>

                {/* Addons checkboxes */}
                <div className="mt-4">
                  <span className="block text-[11px] font-semibold text-[#071E15] mb-2">
                    Adicionais Opcionais:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {addons.map((ad) => {
                      const isChecked = manualForm.addons.includes(ad.name);
                      return (
                        <label
                          key={ad.id}
                          className="flex items-center gap-2 p-2 rounded-lg border border-[#E5DFD5] text-xs cursor-pointer hover:bg-stone-50"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setManualForm({
                                  ...manualForm,
                                  addons: [...manualForm.addons, ad.name],
                                });
                              } else {
                                setManualForm({
                                  ...manualForm,
                                  addons: manualForm.addons.filter((a) => a !== ad.name),
                                });
                              }
                            }}
                            className="rounded text-[#C8521A] focus:ring-0"
                          />
                          <span className="truncate">{ad.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Notas e Status */}
              <div className="border-t border-[#E5DFD5] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Status Inicial da Cotação
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, status: e.target.value as QuoteStatus })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15]"
                  >
                    <option value="novo">Novo Lead</option>
                    <option value="em_contato">Em Atendimento</option>
                    <option value="orçamento_enviado">Proposta Enviada</option>
                    <option value="negociação">Em Negociação</option>
                    <option value="fechado">Fechado 🎉</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Notas Internas da Equipe
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cliente prefere carnes bem passadas, indicação de fulano..."
                    value={manualForm.internalNotes}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, internalNotes: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5] text-xs text-[#071E15]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-[#E5DFD5] pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#E5DFD5] bg-white text-xs font-semibold text-[#071E15] hover:bg-stone-50 transition-colors"
                >
                  Salvar Apenas no Painel
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCreateManualQuoteSubmit(e, true)}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#25D366] text-[#071E15] text-xs font-semibold hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-[#071E15]" />
                  <span>Salvar e Enviar Proposta no WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: GESTÃO DE SERVIÇOS & CARDÁPIOS */}
        {/* ============================================================== */}
        {activeTab === 'servicos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C8521A] font-bold block mb-1">
                  GASTRONOMIA OFICIAL
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                  Cardápios & Tabela de Preços
                </h1>
                <p className="text-xs text-[#55635C] font-light">
                  Edite os valores promocionais, descrições e itens inclusos que aparecem no site e simulador.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Deseja restaurar todos os cardápios para o padrão oficial original?')) {
                    resetServices();
                    showFeedback('Cardápios restaurados para o padrão original!');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-medium text-[#55635C] hover:text-[#071E15] shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão Oficial</span>
              </button>
            </div>

            {/* List of services cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#C8521A] uppercase tracking-wider">
                        {service.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          service.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {service.active ? 'Ativo no Site' : 'Inativo'}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-medium text-[#071E15] mb-1">
                      {service.name}
                    </h2>
                    <p className="text-xs text-[#8B7355] italic mb-3">{service.tagline}</p>

                    {/* Pricing box */}
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] text-[#8B7355] block">Pacote até 50 pessoas</span>
                        <span className="font-serif text-lg font-semibold text-[#071E15]">
                          {service.basePriceInstallments ? `10x de R$ ${service.basePriceInstallments}` : 'Sob medida'}
                        </span>
                      </div>
                      {service.basePriceCash && (
                        <div className="text-right">
                          <span className="text-[10px] text-[#8B7355] block">À vista com desconto</span>
                          <span className="font-semibold text-sm text-[#071E15]">
                            {formatBRL(service.basePriceCash)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Included items preview */}
                    <div className="space-y-1 text-xs text-[#55635C]">
                      <span className="text-[11px] font-semibold text-[#071E15] block">
                        Itens Inclusos ({service.includedItems.length}):
                      </span>
                      {service.includedItems.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="truncate">
                          • {item}
                        </p>
                      ))}
                      {service.includedItems.length > 3 && (
                        <span className="text-[10px] text-[#8B7355]">
                          +{service.includedItems.length - 3} outros itens inclusos
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
                    <button
                      onClick={() => {
                        updateService({ ...service, active: !service.active });
                        showFeedback(`Cardápio ${service.active ? 'desativado' : 'ativado'}.`);
                      }}
                      className="text-xs text-[#55635C] hover:text-[#071E15] underline"
                    >
                      {service.active ? 'Desativar' : 'Ativar no site'}
                    </button>

                    <button
                      onClick={() => setEditingService(service)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#071E15] text-white text-xs font-semibold hover:bg-[#124330] transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar Cardápio & Preços</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal / Drawer for Editing Service */}
            {editingService && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
                  <div className="p-6 border-b border-[#E5DFD5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C8521A] font-bold">
                        EDITANDO CARDÁPIO
                      </span>
                      <h2 className="font-serif text-xl font-normal text-[#071E15]">
                        {editingService.name}
                      </h2>
                    </div>
                    <button
                      onClick={() => setEditingService(null)}
                      className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Nome do Cardápio
                      </label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({ ...editingService, name: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Slogan / Tagline
                      </label>
                      <input
                        type="text"
                        value={editingService.tagline}
                        onChange={(e) =>
                          setEditingService({ ...editingService, tagline: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                          Parcela 10x (R$)
                        </label>
                        <input
                          type="number"
                          value={editingService.basePriceInstallments || ''}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              basePriceInstallments: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                          Preço à Vista (R$)
                        </label>
                        <input
                          type="number"
                          value={editingService.basePriceCash || ''}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              basePriceCash: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Descrição Completa
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.fullDescription}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            fullDescription: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>

                    {/* Items inclusos editor */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Itens Inclusos no Pacote:
                      </label>
                      <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto pr-1">
                        {editingService.includedItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const copy = [...editingService.includedItems];
                                copy[idx] = e.target.value;
                                setEditingService({ ...editingService, includedItems: copy });
                              }}
                              className="flex-1 p-2 rounded-lg border border-[#E5DFD5] text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingService.includedItems.filter((_, i) => i !== idx);
                                setEditingService({ ...editingService, includedItems: copy });
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Adicionar novo item incluso..."
                          value={newItemIncluded}
                          onChange={(e) => setNewItemIncluded(e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-[#E5DFD5] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newItemIncluded.trim()) {
                              setEditingService({
                                ...editingService,
                                includedItems: [...editingService.includedItems, newItemIncluded.trim()],
                              });
                              setNewItemIncluded('');
                            }
                          }}
                          className="px-3 py-2 bg-[#071E15] text-white rounded-lg text-xs font-semibold"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#E5DFD5] flex items-center justify-end gap-2 bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 rounded-full border border-[#E5DFD5] bg-white text-xs font-medium text-[#55635C]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateService(editingService);
                        setEditingService(null);
                        showFeedback('Cardápio e preços atualizados no site!');
                      }}
                      className="px-6 py-2 rounded-full bg-[#E0631B] text-white text-xs font-semibold hover:bg-[#C44E0F]"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: CAMPANHAS & PROMOÇÕES */}
        {/* ============================================================== */}
        {activeTab === 'promocoes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C8521A] font-bold block mb-1">
                  MARKETING & VENDAS
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                  Campanhas & Promoções Ativas
                </h1>
                <p className="text-xs text-[#55635C] font-light">
                  Crie campanhas, ative banners de topo no site e configure pacotes comemorativos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('Deseja restaurar as promoções para o padrão original?')) {
                      resetPromotions();
                      showFeedback('Promoções restauradas!');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-medium text-[#55635C]"
                >
                  Restaurar Padrão
                </button>

                <button
                  onClick={() => setIsCreatingPromo(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E0631B] text-white text-xs font-semibold hover:bg-[#C44E0F] shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Nova Campanha</span>
                </button>
              </div>
            </div>

            {/* List of Promotions */}
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className={`p-6 rounded-3xl border transition-all bg-white shadow-xs ${
                    promo.active ? 'border-[#E5DFD5]' : 'border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                          {promo.badge}
                        </span>
                        {promo.showGlobalBanner && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C8521A]/10 text-[#C8521A] border border-[#C8521A]/20">
                            Banner de Topo Ativo 🔥
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-medium text-[#071E15]">
                        {promo.title}
                      </h3>

                      <p className="text-xs text-[#55635C] font-light leading-relaxed">
                        {promo.description}
                      </p>

                      {promo.highlightPrice && (
                        <p className="text-xs font-semibold text-[#071E15] font-mono">
                          Condição: <span className="text-[#C8521A]">{promo.highlightPrice}</span>
                        </p>
                      )}

                      {promo.showGlobalBanner && promo.bannerText && (
                        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] text-[11px] text-[#071E15]">
                          <span className="font-bold text-[#8B7355] block mb-0.5">Texto do Banner Superior:</span>
                          &ldquo;{promo.bannerText}&rdquo;
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <button
                        onClick={() => {
                          updatePromotion({ ...promo, active: !promo.active });
                          showFeedback(`Campanha ${promo.active ? 'pausada' : 'ativada'}!`);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          promo.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {promo.active ? 'Ativa' : 'Pausada'}
                      </button>

                      <button
                        onClick={() => {
                          updatePromotion({
                            ...promo,
                            showGlobalBanner: !promo.showGlobalBanner,
                          });
                          showFeedback('Visibilidade do banner global atualizada!');
                        }}
                        className="text-[11px] text-[#C8521A] hover:underline"
                      >
                        {promo.showGlobalBanner ? 'Ocultar banner de topo' : 'Ativar no topo do site'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Deseja excluir a promoção "${promo.title}"?`)) {
                            deletePromotion(promo.id);
                            showFeedback('Promoção excluída.');
                          }
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Promo Modal */}
            {isCreatingPromo && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-2xl max-w-lg w-full p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                    <h2 className="font-serif text-lg font-medium text-[#071E15]">
                      Nova Campanha Promocional
                    </h2>
                    <button
                      onClick={() => setIsCreatingPromo(false)}
                      className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Título da Campanha
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Pacote Especial de Fim de Ano"
                        value={newPromoForm.title}
                        onChange={(e) =>
                          setNewPromoForm({ ...newPromoForm, title: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                          Selo / Badge
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 10x Sem Juros"
                          value={newPromoForm.badge}
                          onChange={(e) =>
                            setNewPromoForm({ ...newPromoForm, badge: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                          Preço / Condição
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 10x de R$ 280"
                          value={newPromoForm.highlightPrice}
                          onChange={(e) =>
                            setNewPromoForm({ ...newPromoForm, highlightPrice: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Descrição da Oferta
                      </label>
                      <textarea
                        rows={2}
                        placeholder="O que está incluso e quais os diferenciais..."
                        value={newPromoForm.description}
                        onChange={(e) =>
                          setNewPromoForm({ ...newPromoForm, description: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#071E15]">
                        <input
                          type="checkbox"
                          checked={newPromoForm.showGlobalBanner}
                          onChange={(e) =>
                            setNewPromoForm({
                              ...newPromoForm,
                              showGlobalBanner: e.target.checked,
                            })
                          }
                          className="rounded text-[#C8521A]"
                        />
                        <span>Exibir no Banner Superior do Site</span>
                      </label>

                      {newPromoForm.showGlobalBanner && (
                        <div>
                          <input
                            type="text"
                            placeholder="Texto de impacto do banner de topo..."
                            value={newPromoForm.bannerText}
                            onChange={(e) =>
                              setNewPromoForm({
                                ...newPromoForm,
                                bannerText: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-lg border border-[#E5DFD5] text-xs bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPromo(false)}
                      className="px-4 py-2 rounded-full border border-[#E5DFD5] text-xs font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPromoForm.title) {
                          alert('Informe o título da promoção.');
                          return;
                        }
                        createPromotion(newPromoForm);
                        setIsCreatingPromo(false);
                        showFeedback('Campanha criada com sucesso!');
                      }}
                      className="px-6 py-2 rounded-full bg-[#E0631B] text-white text-xs font-semibold"
                    >
                      Criar Campanha
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: GESTÃO DE OPCIONAIS / ADICIONAIS */}
        {/* ============================================================== */}
        {activeTab === 'adicionais' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C8521A] font-bold block mb-1">
                  EXTRAS & UPGRADES
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                  Opcionais do Buffet
                </h1>
                <p className="text-xs text-[#55635C] font-light">
                  Configure itens opcionais como choppeira, sobremesas nobres e garçons extras.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Deseja restaurar os opcionais para o padrão?')) {
                    resetAddons();
                    showFeedback('Opcionais restaurados!');
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-medium text-[#55635C]"
              >
                Restaurar Padrão
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#8B7355] uppercase text-[10px] tracking-wider border-b border-[#E5DFD5]">
                  <tr>
                    <th className="py-3 px-4">Item Opcional</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Preço Sugerido</th>
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]">
                  {addons.map((addon) => (
                    <tr key={addon.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-sm text-[#071E15]">
                        {addon.name}
                      </td>
                      <td className="py-3 px-4 text-stone-500 uppercase text-[10px] tracking-wider">
                        {addon.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#071E15]">
                        {addon.pricePerPerson
                          ? `R$ ${addon.pricePerPerson}/pessoa`
                          : addon.fixedPrice
                          ? `R$ ${addon.fixedPrice} (fixo)`
                          : 'Sob consulta'}
                      </td>
                      <td className="py-3 px-4 text-[#55635C] max-w-xs truncate">
                        {addon.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingAddon(addon)}
                          className="px-3 py-1.5 rounded-lg border border-[#E5DFD5] text-xs font-medium hover:bg-stone-100"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal for editing addon */}
            {editingAddon && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-2xl max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                    <h2 className="font-serif text-lg font-medium text-[#071E15]">
                      Editar Opcional
                    </h2>
                    <button
                      onClick={() => setEditingAddon(null)}
                      className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Nome do Adicional
                      </label>
                      <input
                        type="text"
                        value={editingAddon.name}
                        onChange={(e) =>
                          setEditingAddon({ ...editingAddon, name: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                          Preço / Pessoa (R$)
                        </label>
                        <input
                          type="number"
                          value={editingAddon.pricePerPerson || ''}
                          onChange={(e) =>
                            setEditingAddon({
                              ...editingAddon,
                              pricePerPerson: Number(e.target.value) || undefined,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                          Preço Fixo (R$)
                        </label>
                        <input
                          type="number"
                          value={editingAddon.fixedPrice || ''}
                          onChange={(e) =>
                            setEditingAddon({
                              ...editingAddon,
                              fixedPrice: Number(e.target.value) || undefined,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                        Descrição
                      </label>
                      <textarea
                        rows={2}
                        value={editingAddon.description}
                        onChange={(e) =>
                          setEditingAddon({ ...editingAddon, description: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingAddon(null)}
                      className="px-4 py-2 rounded-full border border-[#E5DFD5] text-xs font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateAddon(editingAddon);
                        setEditingAddon(null);
                        showFeedback('Opcional atualizado com sucesso!');
                      }}
                      className="px-6 py-2 rounded-full bg-[#E0631B] text-white text-xs font-semibold"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: CONFIGURAÇÕES GERAIS DO SITE */}
        {/* ============================================================== */}
        {activeTab === 'configuracoes' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#C8521A] font-bold block mb-1">
                  CONFIGURAÇÕES
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#071E15]">
                  Dados Gerais da SD Eventos
                </h1>
                <p className="text-xs text-[#55635C] font-light">
                  Altere o WhatsApp de atendimento, Instagram, telefones e textos de rodapé.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Deseja restaurar as configurações gerais para o padrão?')) {
                    resetCompany();
                    showFeedback('Configurações restauradas!');
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-medium text-[#55635C]"
              >
                Restaurar Padrão
              </button>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DFD5] shadow-xs space-y-6 text-xs">
              {/* Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => updateCompany({ ...company, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={company.tagline}
                    onChange={(e) => updateCompany({ ...company, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>
              </div>

              {/* Contatos */}
              <div className="border-t border-[#E5DFD5] pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    WhatsApp (Apenas números)
                  </label>
                  <input
                    type="text"
                    value={company.whatsapp}
                    onChange={(e) => updateCompany({ ...company, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    WhatsApp Formatado
                  </label>
                  <input
                    type="text"
                    value={company.whatsappFormatted}
                    onChange={(e) =>
                      updateCompany({ ...company, whatsappFormatted: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Instagram Oficial
                  </label>
                  <input
                    type="text"
                    value={company.instagram}
                    onChange={(e) => updateCompany({ ...company, instagram: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>
              </div>

              {/* Localização e Horários */}
              <div className="border-t border-[#E5DFD5] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Região Atendida
                  </label>
                  <input
                    type="text"
                    value={company.serviceArea}
                    onChange={(e) => updateCompany({ ...company, serviceArea: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                    Horários de Atendimento
                  </label>
                  <input
                    type="text"
                    value={company.hours}
                    onChange={(e) => updateCompany({ ...company, hours: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                  />
                </div>
              </div>

              {/* Mensagem Padrão */}
              <div className="border-t border-[#E5DFD5] pt-6">
                <label className="block text-[11px] font-semibold text-[#071E15] mb-1">
                  Mensagem Inicial do WhatsApp (ao clicar no botão flutuante)
                </label>
                <textarea
                  rows={2}
                  value={company.defaultMessageTemplate}
                  onChange={(e) =>
                    updateCompany({ ...company, defaultMessageTemplate: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E5DFD5]"
                />
              </div>

              <div className="border-t border-[#E5DFD5] pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => showFeedback('Configurações salvas e aplicadas em todo o site!')}
                  className="px-7 py-3 rounded-full bg-[#071E15] text-white font-semibold text-xs hover:bg-[#124330] shadow-md flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Salvar Configurações Gerais</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* DRAWER LATERAL DE DETALHES DO ORÇAMENTO */}
        {/* ============================================================== */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
            <div className="bg-white max-w-lg w-full h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E5DFD5] flex items-center justify-between bg-[#FAF7F2]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B7355]">
                    ID: {selectedQuote.id}
                  </span>
                  <h2 className="font-serif text-xl font-medium text-[#071E15]">
                    {selectedQuote.customerName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-1 rounded-lg text-stone-500 hover:bg-stone-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
                {/* Status bar */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-[#E5DFD5] flex items-center justify-between">
                  <span className="font-semibold text-[#071E15]">Status Atual:</span>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => {
                      const newSt = e.target.value as QuoteStatus;
                      updateQuoteStatus(selectedQuote.id, newSt);
                      setSelectedQuote({ ...selectedQuote, status: newSt });
                      showFeedback(`Status atualizado para "${newSt}".`);
                    }}
                    className="p-1.5 rounded-lg border border-[#E5DFD5] font-semibold text-xs"
                  >
                    <option value="novo">Novo Lead</option>
                    <option value="em_contato">Em Atendimento</option>
                    <option value="orçamento_enviado">Proposta Enviada</option>
                    <option value="negociação">Em Negociação</option>
                    <option value="fechado">Fechado 🎉</option>
                    <option value="perdido">Perdido / Cancelado</option>
                  </select>
                </div>

                {/* Key Facts */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#8B7355]">
                    Informações da Comemoração
                  </h3>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E5DFD5]">
                    <div>
                      <span className="text-[#8B7355] block">Cardápio:</span>
                      <span className="font-medium text-[#071E15]">{selectedQuote.service}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355] block">Convidados:</span>
                      <span className="font-medium text-[#071E15]">{selectedQuote.guestCount} pessoas</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355] block">Data:</span>
                      <span className="font-medium text-[#071E15]">
                        {selectedQuote.eventDate
                          ? selectedQuote.eventDate.split('-').reverse().join('/')
                          : 'A definir'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8B7355] block">Horário:</span>
                      <span className="font-medium text-[#071E15]">{selectedQuote.eventTime || '13:00'}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355] block">Local:</span>
                      <span className="font-medium text-[#071E15]">
                        {selectedQuote.neighborhood || selectedQuote.city}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8B7355] block">Valor Estimado:</span>
                      <span className="font-serif text-base font-semibold text-[#C8521A]">
                        {formatBRL(selectedQuote.estimatedPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contato do Cliente */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#8B7355]">
                    Contato do Cliente
                  </h3>
                  <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#55635C]">WhatsApp:</span>
                      <span className="font-mono font-bold text-[#071E15]">{selectedQuote.phone}</span>
                    </div>
                    {selectedQuote.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#55635C]">E-mail:</span>
                        <span className="text-[#071E15]">{selectedQuote.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adicionais se houver */}
                {selectedQuote.addons && selectedQuote.addons.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-[#8B7355]">
                      Adicionais Solicitados
                    </h3>
                    <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] space-y-1">
                      {selectedQuote.addons.map((a, i) => (
                        <p key={i} className="text-[#071E15]">
                          + {a}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações do Cliente */}
                {selectedQuote.notes && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-[#8B7355]">
                      Observações do Cliente
                    </h3>
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-amber-900">
                      {selectedQuote.notes}
                    </div>
                  </div>
                )}

                {/* Notas Internas da Equipe */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#8B7355]">
                    Notas Internas da Equipe SD Eventos
                  </h3>
                  <textarea
                    rows={3}
                    placeholder="Adicione anotações sobre contato telefônico, preferências do cliente, etc..."
                    value={selectedQuote.internalNotes || ''}
                    onChange={(e) => {
                      const notesVal = e.target.value;
                      setSelectedQuote({ ...selectedQuote, internalNotes: notesVal });
                      updateQuoteStatus(selectedQuote.id, selectedQuote.status, notesVal);
                    }}
                    className="w-full p-3 rounded-xl border border-[#E5DFD5] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8521A]"
                  />
                  <span className="text-[10px] text-[#8B7355] block">
                    Salvo automaticamente conforme você digita.
                  </span>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-[#E5DFD5] bg-[#FAF7F2] flex flex-col gap-2.5">
                <a
                  href={generateAdminQuoteProposalUrl(selectedQuote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-full bg-[#25D366] text-[#071E15] font-semibold text-xs uppercase tracking-wider hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#071E15]" />
                  <span>Enviar Proposta Completa no WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={generateAdminFollowUpUrl(
                      selectedQuote.phone,
                      selectedQuote.customerName,
                      selectedQuote.service
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-full border border-[#E5DFD5] bg-white text-xs font-semibold text-center hover:bg-stone-50"
                  >
                    Saudação Rápida
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`Deseja excluir permanentemente a cotação de ${selectedQuote.customerName}?`)) {
                        deleteQuote(selectedQuote.id);
                        setSelectedQuote(null);
                        showFeedback('Orçamento excluído com sucesso.');
                      }
                    }}
                    className="p-2.5 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-200"
                    title="Excluir Cotação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
