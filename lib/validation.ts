export interface ValidationErrors {
  [key: string]: string;
}

export function sanitizeText(value: string | undefined): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .slice(0, 1000); // safety cap
}

export function validateQuoteForm(data: {
  customerName?: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  serviceId?: string;
  guestCount?: number;
  city?: string;
  neighborhood?: string;
}): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.customerName = 'Por favor, informe seu nome completo.';
  }

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
    errors.phone = 'Informe um número de WhatsApp válido com DDD (ex: 11 98406-6393).';
  }

  if (!data.serviceId) {
    errors.serviceId = 'Selecione uma opção de buffet.';
  }

  if (!data.guestCount || data.guestCount < 10) {
    errors.guestCount = 'O número de convidados deve ser de pelo menos 10 pessoas.';
  }

  if (!data.eventDate) {
    errors.eventDate = 'Informe a data aproximada do evento.';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Informe a cidade do evento.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
