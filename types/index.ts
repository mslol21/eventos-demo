export type ServiceCategory = 'churrasco' | 'finger_foods' | 'massas' | 'personalizado';

export interface ServiceOption {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  gallery: string[];
  suggestedGuests: string;
  minGuests: number;
  maxGuests?: number;
  basePriceCash?: number;
  basePriceInstallments?: number;
  installmentCount?: number;
  priceNote: string;
  includedItems: string[];
  notIncludedItems: string[];
  observations: string[];
  availableAddons: string[];
  badge?: string;
  active: boolean;
}

export type AddonCategory = 'bebidas' | 'sobremesas' | 'entradas' | 'equipe' | 'descartaveis' | 'outros';

export interface AddonOption {
  id: string;
  name: string;
  category: AddonCategory;
  description: string;
  pricePerPerson?: number;
  fixedPrice?: number;
  unitLabel: string;
  popular?: boolean;
}

export type EventType =
  | 'aniversario'
  | 'casamento'
  | 'confraternizacao'
  | 'empresarial'
  | 'infantil'
  | 'formatura'
  | 'outro';

export type QuoteStatus =
  | 'novo'
  | 'em_contato'
  | 'orçamento_enviado'
  | 'negociação'
  | 'fechado'
  | 'perdido';

export interface QuoteRequest {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  service: string;
  serviceId: string;
  addons: string[];
  city: string;
  neighborhood: string;
  address: string;
  notes?: string;
  estimatedPrice: number;
  status: QuoteStatus;
  createdAt: string;
  internalNotes?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export type GalleryCategory =
  | 'Buffets'
  | 'Churrascos'
  | 'Finger Foods'
  | 'Massas'
  | 'Eventos'
  | 'Montagens';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  description?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  eventType: string;
  rating: number;
  comment: string;
  isDemo: boolean;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  whatsappFormatted: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  serviceArea: string;
  hours: string;
  defaultMessageTemplate: string;
}
