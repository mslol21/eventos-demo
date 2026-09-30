import { INITIAL_MOCK_QUOTES } from '@/data/mock-quotes';
import { SERVICES_DATA } from '@/data/services';
import { ADDONS_DATA } from '@/data/addons';
import { COMPANY_CONFIG } from '@/data/company';
import { INITIAL_PROMOTIONS } from '@/data/promotions';
import {
  QuoteRequest,
  QuoteStatus,
  ServiceOption,
  AddonOption,
  CompanyConfig,
  CampaignPromotion,
  ManualQuoteInput,
} from '@/types';
import { calculateEstimatedPrice } from './pricing';

const QUOTES_KEY = 'sd_eventos_quote_requests';
const SERVICES_KEY = 'sd_eventos_services_data';
const ADDONS_KEY = 'sd_eventos_addons_data';
const PROMOTIONS_KEY = 'sd_eventos_promotions_data';
const COMPANY_KEY = 'sd_eventos_company_config';

function dispatchUpdate(entity: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sd_storage_update', { detail: { entity } }));
  }
}

// ==========================================
// 1. QUOTES MANAGEMENT (ORÇAMENTOS)
// ==========================================
export function getLocalQuotes(): QuoteRequest[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_QUOTES;
  }

  try {
    const raw = localStorage.getItem(QUOTES_KEY);
    if (!raw) {
      localStorage.setItem(QUOTES_KEY, JSON.stringify(INITIAL_MOCK_QUOTES));
      return INITIAL_MOCK_QUOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MOCK_QUOTES;
  } catch (error) {
    console.error('Error reading local quotes:', error);
    return INITIAL_MOCK_QUOTES;
  }
}

export function saveLocalQuote(newQuote: QuoteRequest): QuoteRequest[] {
  if (typeof window === 'undefined') {
    return [newQuote, ...INITIAL_MOCK_QUOTES];
  }

  try {
    const current = getLocalQuotes();
    const updated = [newQuote, ...current.filter((q) => q.id !== newQuote.id)];
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
    dispatchUpdate('quotes');
    return updated;
  } catch (error) {
    console.error('Error saving local quote:', error);
    return [newQuote, ...INITIAL_MOCK_QUOTES];
  }
}

export function updateLocalQuoteStatus(
  quoteId: string,
  status: QuoteStatus,
  internalNotes?: string
): QuoteRequest[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_QUOTES;
  }

  try {
    const current = getLocalQuotes();
    const updated = current.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          status,
          internalNotes: internalNotes !== undefined ? internalNotes : q.internalNotes,
        };
      }
      return q;
    });
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
    dispatchUpdate('quotes');
    return updated;
  } catch (error) {
    console.error('Error updating local quote status:', error);
    return INITIAL_MOCK_QUOTES;
  }
}

export function deleteLocalQuote(quoteId: string): QuoteRequest[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_QUOTES;
  }

  try {
    const current = getLocalQuotes();
    const updated = current.filter((q) => q.id !== quoteId);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
    dispatchUpdate('quotes');
    return updated;
  } catch (error) {
    console.error('Error deleting local quote:', error);
    return INITIAL_MOCK_QUOTES;
  }
}

export function createManualQuote(input: ManualQuoteInput): QuoteRequest {
  const services = getLocalServices();
  const addons = getLocalAddons();
  const serviceObj = services.find((s) => s.id === input.serviceId) || services[0];

  // Calculate pricing if customPrice not provided
  let calculatedPrice = input.customPrice;
  if (calculatedPrice === undefined || calculatedPrice <= 0) {
    const pricingResult = calculateEstimatedPrice(
      input.serviceId,
      input.guestCount,
      input.addons,
      services,
      addons
    );
    calculatedPrice = pricingResult.totalEstimatedPrice;
  }

  const newQuote: QuoteRequest = {
    id: `quote-manual-${Date.now()}`,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    eventType: input.eventType,
    eventDate: input.eventDate,
    eventTime: input.eventTime || '13:00',
    guestCount: Number(input.guestCount) || 50,
    service: serviceObj.name,
    serviceId: serviceObj.id,
    addons: input.addons,
    city: input.city.trim() || 'São Paulo',
    neighborhood: input.neighborhood.trim() || 'A definir',
    address: input.address?.trim() || `${input.neighborhood}, ${input.city}`,
    notes: input.notes?.trim() || undefined,
    estimatedPrice: calculatedPrice,
    status: input.status || 'orçamento_enviado',
    createdAt: new Date().toISOString(),
    internalNotes: input.internalNotes?.trim() || 'Orçamento cadastrado manualmente pelo painel admin.',
  };

  saveLocalQuote(newQuote);
  return newQuote;
}

export function exportQuotesToCSV(quotes: QuoteRequest[]): string {
  const headers = [
    'ID',
    'Data Criacao',
    'Cliente',
    'Telefone',
    'Email',
    'Tipo Evento',
    'Data Evento',
    'Horario',
    'Convidados',
    'Servico',
    'Cidade',
    'Bairro',
    'Adicionais',
    'Valor Estimado (R$)',
    'Status',
    'Notas Internas',
  ];

  const escapeCSV = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = quotes.map((q) => [
    q.id,
    q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : '',
    q.customerName,
    q.phone,
    q.email || '',
    q.eventType,
    q.eventDate,
    q.eventTime,
    q.guestCount,
    q.service,
    q.city,
    q.neighborhood,
    (q.addons || []).join('; '),
    q.estimatedPrice,
    q.status,
    q.internalNotes || '',
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csvContent;
}

// ==========================================
// 2. SERVICES MANAGEMENT (CARDÁPIOS / BUFFETS)
// ==========================================
export function getLocalServices(): ServiceOption[] {
  if (typeof window === 'undefined') {
    return SERVICES_DATA;
  }

  try {
    const raw = localStorage.getItem(SERVICES_KEY);
    if (!raw) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(SERVICES_DATA));
      return SERVICES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SERVICES_DATA;
  } catch (error) {
    console.error('Error reading local services:', error);
    return SERVICES_DATA;
  }
}

export function saveLocalServices(services: ServiceOption[]): ServiceOption[] {
  if (typeof window === 'undefined') {
    return services;
  }

  try {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    dispatchUpdate('services');
    return services;
  } catch (error) {
    console.error('Error saving local services:', error);
    return services;
  }
}

export function updateLocalService(updatedService: ServiceOption): ServiceOption[] {
  const current = getLocalServices();
  const updated = current.map((s) => (s.id === updatedService.id ? updatedService : s));
  return saveLocalServices(updated);
}

export function resetServicesToDefault(): ServiceOption[] {
  if (typeof window === 'undefined') {
    return SERVICES_DATA;
  }
  localStorage.setItem(SERVICES_KEY, JSON.stringify(SERVICES_DATA));
  dispatchUpdate('services');
  return SERVICES_DATA;
}

// ==========================================
// 3. ADDONS MANAGEMENT (OPCIONAIS)
// ==========================================
export function getLocalAddons(): AddonOption[] {
  if (typeof window === 'undefined') {
    return ADDONS_DATA;
  }

  try {
    const raw = localStorage.getItem(ADDONS_KEY);
    if (!raw) {
      localStorage.setItem(ADDONS_KEY, JSON.stringify(ADDONS_DATA));
      return ADDONS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return ADDONS_DATA;
  } catch (error) {
    console.error('Error reading local addons:', error);
    return ADDONS_DATA;
  }
}

export function saveLocalAddons(addons: AddonOption[]): AddonOption[] {
  if (typeof window === 'undefined') {
    return addons;
  }

  try {
    localStorage.setItem(ADDONS_KEY, JSON.stringify(addons));
    dispatchUpdate('addons');
    return addons;
  } catch (error) {
    console.error('Error saving local addons:', error);
    return addons;
  }
}

export function updateLocalAddon(updatedAddon: AddonOption): AddonOption[] {
  const current = getLocalAddons();
  const updated = current.map((a) => (a.id === updatedAddon.id ? updatedAddon : a));
  return saveLocalAddons(updated);
}

export function resetAddonsToDefault(): AddonOption[] {
  if (typeof window === 'undefined') {
    return ADDONS_DATA;
  }
  localStorage.setItem(ADDONS_KEY, JSON.stringify(ADDONS_DATA));
  dispatchUpdate('addons');
  return ADDONS_DATA;
}

// ==========================================
// 4. PROMOTIONS & CAMPAIGNS MANAGEMENT
// ==========================================
export function getLocalPromotions(): CampaignPromotion[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROMOTIONS;
  }

  try {
    const raw = localStorage.getItem(PROMOTIONS_KEY);
    if (!raw) {
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(INITIAL_PROMOTIONS));
      return INITIAL_PROMOTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PROMOTIONS;
  } catch (error) {
    console.error('Error reading local promotions:', error);
    return INITIAL_PROMOTIONS;
  }
}

export function saveLocalPromotions(promotions: CampaignPromotion[]): CampaignPromotion[] {
  if (typeof window === 'undefined') {
    return promotions;
  }

  try {
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotions));
    dispatchUpdate('promotions');
    return promotions;
  } catch (error) {
    console.error('Error saving local promotions:', error);
    return promotions;
  }
}

export function createLocalPromotion(promo: Omit<CampaignPromotion, 'id' | 'createdAt'>): CampaignPromotion[] {
  const current = getLocalPromotions();
  const newPromo: CampaignPromotion = {
    ...promo,
    id: `promo-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  return saveLocalPromotions([newPromo, ...current]);
}

export function updateLocalPromotion(updatedPromo: CampaignPromotion): CampaignPromotion[] {
  const current = getLocalPromotions();
  const updated = current.map((p) => (p.id === updatedPromo.id ? updatedPromo : p));
  return saveLocalPromotions(updated);
}

export function deleteLocalPromotion(promoId: string): CampaignPromotion[] {
  const current = getLocalPromotions();
  const updated = current.filter((p) => p.id !== promoId);
  return saveLocalPromotions(updated);
}

export function resetPromotionsToDefault(): CampaignPromotion[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROMOTIONS;
  }
  localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(INITIAL_PROMOTIONS));
  dispatchUpdate('promotions');
  return INITIAL_PROMOTIONS;
}

// ==========================================
// 5. COMPANY CONFIG (CONFIGURAÇÕES GERAIS)
// ==========================================
export function getLocalCompanyConfig(): CompanyConfig {
  if (typeof window === 'undefined') {
    return COMPANY_CONFIG;
  }

  try {
    const raw = localStorage.getItem(COMPANY_KEY);
    if (!raw) {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(COMPANY_CONFIG));
      return COMPANY_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.whatsapp) {
      return parsed;
    }
    return COMPANY_CONFIG;
  } catch (error) {
    console.error('Error reading local company config:', error);
    return COMPANY_CONFIG;
  }
}

export function saveLocalCompanyConfig(config: CompanyConfig): CompanyConfig {
  if (typeof window === 'undefined') {
    return config;
  }

  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(config));
    dispatchUpdate('company');
    return config;
  } catch (error) {
    console.error('Error saving local company config:', error);
    return config;
  }
}

export function resetCompanyConfigToDefault(): CompanyConfig {
  if (typeof window === 'undefined') {
    return COMPANY_CONFIG;
  }
  localStorage.setItem(COMPANY_KEY, JSON.stringify(COMPANY_CONFIG));
  dispatchUpdate('company');
  return COMPANY_CONFIG;
}
