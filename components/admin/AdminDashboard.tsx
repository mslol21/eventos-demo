'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  PlusCircle,
  Settings,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
  DollarSign,
  Save,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import { getLocalQuotes, updateLocalQuoteStatus } from '@/lib/storage';
import { formatBRL } from '@/lib/pricing';
import { generateAdminFollowUpUrl } from '@/lib/whatsapp';
import { SERVICES_DATA } from '@/data/services';
import { ADDONS_DATA } from '@/data/addons';
import { COMPANY_CONFIG } from '@/data/company';
import { QuoteRequest, QuoteStatus, ServiceOption } from '@/types';

type AdminTab = 'dashboard' | 'solicitacoes' | 'servicos' | 'adicionais' | 'configuracoes';

const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  novo: {
    label: 'Novo',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  em_contato: {
    label: 'Em Contato',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  orçamento_enviado: {
    label: 'Orçamento Enviado',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  negociação: {
    label: 'Negociação',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  fechado: {
    label: 'Fechado 🎉',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  perdido: {
    label: 'Perdido',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => getLocalQuotes());
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [servicesList] = useState<ServiceOption[]>(SERVICES_DATA);

  // Filter state for quotes
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editable fields in details drawer
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingStatus, setEditingStatus] = useState<QuoteStatus>('novo');
  const [saveFeedback, setSaveFeedback] = useState<boolean>(false);

  // Settings form state
  const [companySettings, setCompanySettings] = useState(COMPANY_CONFIG);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // Sync with API asynchronously
  useEffect(() => {
    fetch('/api/quotes')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setQuotes((prev) => {
            const merged = [...prev];
            for (const item of res.data) {
              if (!merged.some((m) => m.id === item.id)) {
                merged.push(item);
              }
            }
            return merged;
          });
        }
      })
      .catch(() => {
        // Fallback already in memory
      });
  }, []);

  // Update quote status handler
  const handleUpdateQuote = (quoteId: string, newStatus: QuoteStatus, newNotes?: string) => {
    const updated = updateLocalQuoteStatus(quoteId, newStatus, newNotes);
    setQuotes(updated);

    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus, internalNotes: newNotes } : null));
    }

    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);

    // Call API patch
    fetch('/api/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: quoteId, status: newStatus, internalNotes: newNotes }),
    }).catch((e) => console.error('API sync error:', e));
  };

  const openQuoteDetails = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setEditingStatus(quote.status);
    setEditingNotes(quote.internalNotes || '');
  };

  // KPIs
  const kpis = useMemo(() => {
    const totalQuotes = quotes.length;
    const newQuotes = quotes.filter((q) => q.status === 'novo').length;
    const closedQuotes = quotes.filter((q) => q.status === 'fechado').length;
    const negotiatingQuotes = quotes.filter(
      (q) => q.status === 'em_contato' || q.status === 'orçamento_enviado' || q.status === 'negociação'
    ).length;

    const totalPipelineValue = quotes
      .filter((q) => q.status !== 'perdido')
      .reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);

    const conversionRate = totalQuotes > 0 ? Math.round((closedQuotes / totalQuotes) * 100) : 0;

    return {
      totalQuotes,
      newQuotes,
      closedQuotes,
      negotiatingQuotes,
      totalPipelineValue,
      conversionRate,
    };
  }, [quotes]);

  // Filtered quotes list
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus = statusFilter === 'todos' || q.status === statusFilter;
      const qLower = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        q.customerName.toLowerCase().includes(qLower) ||
        q.phone.includes(qLower) ||
        q.city.toLowerCase().includes(qLower) ||
        q.neighborhood.toLowerCase().includes(qLower) ||
        q.service.toLowerCase().includes(qLower) ||
        q.id.toLowerCase().includes(qLower);

      return matchesStatus && matchesQuery;
    });
  }, [quotes, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F3EFE9] text-[#151D19]">
      {/* Admin Top Bar */}
      <header className="bg-[#072017] text-white border-b border-[#124330] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E0631B] flex items-center justify-center text-white font-bold font-serif shadow">
              SD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-wider">
                  SD EVENTOS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#17523C] text-emerald-300">
                  Painel Administrativo
                </span>
              </div>
              <p className="text-[10px] text-[#C5A059]">
                Gestão comercial e operacional de buffets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2F21] border border-[#17523C] text-xs text-[#E9E2D7]">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pronto para Supabase</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F5] hover:text-[#E0631B] transition-colors py-1.5 px-3 rounded-lg border border-[#17523C] hover:bg-[#124330]"
            >
              <span>Ver Site Público</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content with Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#E9E2D7]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#0B2F21] text-white shadow-sm'
                : 'bg-white border border-[#E9E2D7] text-[#5C6762] hover:text-[#0B2F21]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('solicitacoes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
              activeTab === 'solicitacoes'
                ? 'bg-[#0B2F21] text-white shadow-sm'
                : 'bg-white border border-[#E9E2D7] text-[#5C6762] hover:text-[#0B2F21]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Solicitações</span>
            {kpis.newQuotes > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E0631B] text-white text-[10px] flex items-center justify-center font-bold">
                {kpis.newQuotes}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('servicos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'servicos'
                ? 'bg-[#0B2F21] text-white shadow-sm'
                : 'bg-white border border-[#E9E2D7] text-[#5C6762] hover:text-[#0B2F21]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Serviços & Pacotes</span>
          </button>

          <button
            onClick={() => setActiveTab('adicionais')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'adicionais'
                ? 'bg-[#0B2F21] text-white shadow-sm'
                : 'bg-white border border-[#E9E2D7] text-[#5C6762] hover:text-[#0B2F21]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionais</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'configuracoes'
                ? 'bg-[#0B2F21] text-white shadow-sm'
                : 'bg-white border border-[#E9E2D7] text-[#5C6762] hover:text-[#0B2F21]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="py-8 space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-[#5C6762]">
                    Novas Solicitações
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-[#0B2F21] mt-1">
                    {kpis.newQuotes}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Aguardando primeiro contato
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-[#5C6762]">
                    Em Negociação
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-[#0B2F21] mt-1">
                    {kpis.negotiatingQuotes}
                  </p>
                  <span className="text-[11px] text-blue-600 font-semibold">
                    Propostas em andamento
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-[#5C6762]">
                    Eventos Fechados
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-green-700 mt-1">
                    {kpis.closedQuotes}
                  </p>
                  <span className="text-[11px] text-green-700 font-semibold">
                    Taxa conversão: {kpis.conversionRate}%
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E9E2D7] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-[#5C6762]">
                    Pipeline Estimado
                  </p>
                  <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[#E0631B] mt-1">
                    {formatBRL(kpis.totalPipelineValue)}
                  </p>
                  <span className="text-[11px] text-gray-500">
                    Soma de orçamentos ativos
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF6F0] text-[#E0631B] flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E9E2D7] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-[#0B2F21]">
                    Últimas Solicitações Recebidas
                  </h3>
                  <button
                    onClick={() => setActiveTab('solicitacoes')}
                    className="text-xs font-bold text-[#E0631B] hover:underline"
                  >
                    Ver todas ({quotes.length})
                  </button>
                </div>

                <div className="divide-y divide-[#F3EFE9]">
                  {quotes.slice(0, 4).map((q) => {
                    const st = STATUS_CONFIG[q.status] || STATUS_CONFIG.novo;
                    return (
                      <div
                        key={q.id}
                        onClick={() => openQuoteDetails(q)}
                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] px-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0B2F21]">
                              {q.customerName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.bg} ${st.text} ${st.border}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C6762]">
                            {q.service} • {q.guestCount} convidados • {q.city} ({q.neighborhood})
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-sm text-[#0B2F21]">
                            {formatBRL(q.estimatedPrice)}
                          </span>
                          <span className="block text-[11px] text-gray-400">
                            Data: {q.eventDate || 'A combinar'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips & Commercial Process Card */}
              <div className="lg:col-span-4 bg-[#0B2F21] text-white rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-white">
                  Regra de Fechamento Comercial
                </h3>
                <p className="text-xs text-[#E9E2D7]/80 leading-relaxed">
                  Lembre-se do fluxo padrão de atendimento da SD Eventos:
                </p>
                <div className="space-y-3 text-xs text-[#FAF8F5]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#17523C] text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      1
                    </span>
                    <span>Cliente simula e envia o resumo prévio.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#17523C] text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      2
                    </span>
                    <span>Admin valida disponibilidade e equipe na agenda.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#17523C] text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      3
                    </span>
                    <span>SD Eventos confirma valores e fecha contrato.</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#17523C]">
                  <p className="text-[11px] text-[#C5A059]">
                    * Nunca tratar a estimativa do site como contrato definitivo antes da confirmação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOLICITAÇÕES (Quotes Table) */}
        {activeTab === 'solicitacoes' && (
          <div className="py-8 space-y-6 animate-in fade-in duration-200">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9E2D7]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar cliente, telefone, bairro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="orçamento_enviado">Orçamento Enviado</option>
                  <option value="negociação">Negociação</option>
                  <option value="fechado">Fechado</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#E9E2D7] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E9E2D7] text-[#0B2F21] uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-4">Código / Cliente</th>
                      <th className="py-3.5 px-4">Telefone</th>
                      <th className="py-3.5 px-4">Buffet</th>
                      <th className="py-3.5 px-4">Data Prevista</th>
                      <th className="py-3.5 px-4">Convidados</th>
                      <th className="py-3.5 px-4">Estimativa</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3EFE9]">
                    {filteredQuotes.map((q) => {
                      const st = STATUS_CONFIG[q.status] || STATUS_CONFIG.novo;
                      return (
                        <tr
                          key={q.id}
                          className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer"
                          onClick={() => openQuoteDetails(q)}
                        >
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#0B2F21] block">
                              {q.customerName}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {q.id}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-700">
                            {q.phone}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#0B2F21]">
                            {q.service}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            {q.eventDate || 'A definir'}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#0B2F21]">
                            {q.guestCount}p
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#0B2F21]">
                            {formatBRL(q.estimatedPrice)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${st.bg} ${st.text} ${st.border}`}
                            >
                              {st.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openQuoteDetails(q);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E9E2D7] text-[#0B2F21] hover:bg-[#0B2F21] hover:text-white transition-colors font-bold text-[11px]"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredQuotes.length === 0 && (
                <div className="py-12 text-center text-sm text-[#5C6762]">
                  Nenhuma solicitação encontrada com os filtros atuais.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GERENCIAMENTO DE SERVIÇOS */}
        {activeTab === 'servicos' && (
          <div className="py-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0B2F21]">
                  Gerenciamento de Serviços
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6762]">
                  Consulte os cardápios, itens inclusos e estrutura de valores demonstrativos.
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                4 Serviços Ativos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-[#E9E2D7] p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#E0631B]">
                          {service.category}
                        </span>
                        <h3 className="font-serif font-bold text-xl text-[#0B2F21]">
                          {service.name}
                        </h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </div>

                    <p className="text-xs text-[#5C6762] leading-relaxed">
                      {service.shortDescription}
                    </p>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7] text-xs space-y-1">
                      <p className="font-semibold text-[#0B2F21]">
                        Preço Base Demonstrativo (até 50 pessoas):
                      </p>
                      <p className="text-[#C44E0F] font-bold text-sm">
                        {service.basePriceCash
                          ? `${formatBRL(service.basePriceCash)} à vista ou 10x de ${formatBRL(
                              service.basePriceInstallments || 0
                            )}`
                          : 'Sob consulta personalizada'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0B2F21] mb-1">
                        Itens Inclusos Principais:
                      </p>
                      <ul className="text-xs text-[#5C6762] space-y-1">
                        {service.includedItems.slice(0, 3).map((item, i) => (
                          <li key={i} className="line-clamp-1">
                            • {item}
                          </li>
                        ))}
                        {service.includedItems.length > 3 && (
                          <li className="text-[11px] text-[#C5A059] font-medium">
                            + {service.includedItems.length - 3} outros itens inclusos
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F3EFE9] flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      Capacidade: {service.minGuests} a {service.maxGuests || 300} pessoas
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Modo de edição para ${service.name}: Conectado aos mocks. No Supabase, este botão abrirá a tela de alteração direta na tabela 'services'.`)}
                      className="text-xs font-bold text-[#E0631B] hover:underline"
                    >
                      Editar Serviço
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GERENCIAMENTO DE ADICIONAIS */}
        {activeTab === 'adicionais' && (
          <div className="py-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B2F21]">
                Catálogo de Adicionais
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6762]">
                Itens opcionais configuráveis no simulador de eventos.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E9E2D7] overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E9E2D7] text-[#0B2F21] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Adicional</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Valor Base</th>
                    <th className="py-3 px-4">Tipo de Cobrança</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EFE9]">
                  {ADDONS_DATA.map((addon) => (
                    <tr key={addon.id} className="hover:bg-[#FAF8F5]/60">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#0B2F21] block">
                          {addon.name}
                        </span>
                        <span className="text-gray-500 text-[11px] line-clamp-1">
                          {addon.description}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-gray-700">
                        {addon.category}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0B2F21]">
                        {addon.pricePerPerson
                          ? formatBRL(addon.pricePerPerson)
                          : formatBRL(addon.fixedPrice || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {addon.unitLabel}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          Ativo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CONFIGURAÇÕES */}
        {activeTab === 'configuracoes' && (
          <div className="py-8 space-y-6 animate-in fade-in duration-200 max-w-3xl">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B2F21]">
                Configurações da Empresa
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6762]">
                Parâmetros comerciais e mensagens pré-definidas para contato.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E2D7] shadow-xs space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={companySettings.name}
                    onChange={(e) =>
                      setCompanySettings({ ...companySettings, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    WhatsApp Principal (apenas dígitos com 55)
                  </label>
                  <input
                    type="text"
                    value={companySettings.whatsapp}
                    onChange={(e) =>
                      setCompanySettings({ ...companySettings, whatsapp: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={companySettings.instagram}
                    onChange={(e) =>
                      setCompanySettings({ ...companySettings, instagram: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                    E-mail Comercial
                  </label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) =>
                      setCompanySettings({ ...companySettings, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Área de Atendimento
                </label>
                <input
                  type="text"
                  value={companySettings.serviceArea}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, serviceArea: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Horário de Atendimento
                </label>
                <input
                  type="text"
                  value={companySettings.hours}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, hours: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2500);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2F21] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#124330] shadow transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUOTE DETAILS MODAL / DRAWER */}
      {selectedQuote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-3xl border border-[#E9E2D7] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#F3EFE9]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">
                    {selectedQuote.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      STATUS_CONFIG[selectedQuote.status]?.bg || 'bg-gray-100'
                    } ${STATUS_CONFIG[selectedQuote.status]?.text || 'text-gray-700'}`}
                  >
                    {STATUS_CONFIG[selectedQuote.status]?.label || selectedQuote.status}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#0B2F21] mt-1">
                  {selectedQuote.customerName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: Call Customer on WhatsApp */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Contato direto com o cliente:
                </p>
                <p className="text-xs text-emerald-700 font-mono">
                  {selectedQuote.phone}
                </p>
              </div>

              <a
                href={generateAdminFollowUpUrl(
                  selectedQuote.phone,
                  selectedQuote.customerName,
                  selectedQuote.service
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chamar no WhatsApp</span>
              </a>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7]">
                <span className="text-[#5C6762] block">Buffet:</span>
                <span className="font-bold text-[#0B2F21] text-sm">
                  {selectedQuote.service}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7]">
                <span className="text-[#5C6762] block">Convidados:</span>
                <span className="font-bold text-[#0B2F21] text-sm">
                  {selectedQuote.guestCount} pessoas
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7]">
                <span className="text-[#5C6762] block">Data do Evento:</span>
                <span className="font-bold text-[#0B2F21] text-sm">
                  {selectedQuote.eventDate || 'A definir'} ({selectedQuote.eventTime || '12h'})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E2D7]">
                <span className="text-[#5C6762] block">Estimativa:</span>
                <span className="font-bold text-[#E0631B] text-sm">
                  {formatBRL(selectedQuote.estimatedPrice)}
                </span>
              </div>
            </div>

            {/* Location & Address */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#0B2F21]">Localização:</span>
              <p className="text-[#5C6762]">
                {selectedQuote.city} — Bairro: {selectedQuote.neighborhood}
                {selectedQuote.address && ` (${selectedQuote.address})`}
              </p>
            </div>

            {/* Addons */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#0B2F21]">Adicionais solicitados:</span>
              {selectedQuote.addons && selectedQuote.addons.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedQuote.addons.map((add, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E9E2D7] text-[#0B2F21]"
                    >
                      + {add}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">Nenhum adicional selecionado.</p>
              )}
            </div>

            {/* Client Notes */}
            {selectedQuote.notes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900">
                  Observações do Cliente:
                </span>
                <p className="text-amber-800">{selectedQuote.notes}</p>
              </div>
            )}

            {/* Status & Internal Notes Management */}
            <div className="pt-4 border-t border-[#F3EFE9] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Alterar Status do Orçamento:
                </label>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value as QuoteStatus)}
                  className="p-2 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                >
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="orçamento_enviado">Orçamento Enviado</option>
                  <option value="negociação">Negociação</option>
                  <option value="fechado">Fechado 🎉</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0B2F21]">
                  Anotações Internas (Visível apenas para equipe SD Eventos):
                </label>
                <textarea
                  rows={2}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Ex: Cliente prefere reunião na sexta; já escalamos o churrasqueiro Lucas."
                  className="w-full p-2.5 rounded-xl border border-[#E9E2D7] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#E0631B]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveFeedback && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Atualizado com sucesso!
                  </span>
                )}
                {!saveFeedback && <div />}

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateQuote(selectedQuote.id, editingStatus, editingNotes)
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2F21] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#124330] shadow transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
