import { COMPANY_CONFIG } from '@/data/company';
import { EventType } from '@/types';

export interface WhatsAppQuoteData {
  customerName: string;
  eventType: EventType | string;
  eventDate: string;
  eventTime: string;
  guestCount: number | string;
  serviceName: string;
  addonsList: string[];
  city: string;
  neighborhood: string;
  address?: string;
  notes?: string;
  estimatedPrice?: number;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  aniversario: 'Aniversário',
  casamento: 'Casamento / Noivado',
  confraternizacao: 'Confraternização',
  empresarial: 'Evento Empresarial / Corporativo',
  infantil: 'Festa Infantil',
  formatura: 'Formatura',
  outro: 'Outro / Personalizado',
};

export function formatEventTypeName(type: string): string {
  return EVENT_TYPE_LABELS[type] || type || 'Não informado';
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return 'A definir';
  // Check if it's YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function generateWhatsAppMessage(data: WhatsAppQuoteData): string {
  const eventLabel = formatEventTypeName(data.eventType);
  const formattedDate = formatDateBR(data.eventDate);
  const addonsSection =
    data.addonsList && data.addonsList.length > 0
      ? data.addonsList.join('\n- ')
      : 'Nenhum adicional selecionado no momento';

  const notesSection = data.notes && data.notes.trim() ? data.notes.trim() : 'Nenhuma observação informada';
  const locationSection = `${data.city || 'São Paulo'} - SP\nBairro: ${data.neighborhood || 'A informar'}${data.address ? `\nLocal: ${data.address}` : ''}`;

  const message = `Olá! Conheci a SD Eventos pelo site e gostaria de solicitar um orçamento.

🎉 EVENTO
Tipo: ${eventLabel}
Data: ${formattedDate}
Horário: ${data.eventTime || 'A combinar'}

👥 CONVIDADOS
${data.guestCount} pessoas

🍽️ BUFFET
${data.serviceName}

➕ ADICIONAIS
${addonsSection.startsWith('-') ? addonsSection : `- ${addonsSection}`}

📍 LOCAL
${locationSection}

👤 CONTATO
Nome: ${data.customerName}

📝 OBSERVAÇÕES
${notesSection}

Gostaria de confirmar disponibilidade e receber o orçamento final.`;

  return message;
}

export function buildWhatsAppUrl(message: string, phone: string = COMPANY_CONFIG.whatsapp): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function generateAdminFollowUpUrl(customerPhone: string, customerName: string, serviceName: string): string {
  const cleanPhone = customerPhone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const message = `Olá, ${customerName}! Tudo bem? Sou da equipe SD Eventos. Recebemos sua solicitação para o buffet de *${serviceName}* e gostaríamos de confirmar os detalhes do seu evento!`;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
}
