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
  const phoneWithCountry = cleanPhone.startsWith('55')
    ? cleanPhone
    : cleanPhone.length === 10 || cleanPhone.length === 11
    ? `55${cleanPhone}`
    : cleanPhone;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneWithCountry}?text=${encoded}`;
}

export function generateAdminFollowUpUrl(customerPhone: string, customerName: string, serviceName: string): string {
  const cleanPhone = customerPhone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const message = `Olá, ${customerName}! Tudo bem? Sou da equipe SD Eventos. Recebemos sua solicitação para o buffet de *${serviceName}* e gostaríamos de confirmar os detalhes do seu evento!`;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
}

export function generateAdminQuoteProposalUrl(quote: {
  customerName: string;
  phone: string;
  service: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  neighborhood: string;
  city: string;
  addons?: string[];
  estimatedPrice: number;
}): string {
  const cleanPhone = quote.phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const formattedDate = quote.eventDate ? quote.eventDate.split('-').reverse().join('/') : 'A combinar';
  const addonsText = quote.addons && quote.addons.length > 0 ? `➕ *Adicionais:* ${quote.addons.join(', ')}\n` : '';

  const message = `Olá, *${quote.customerName}*! Tudo bem? Aqui é da equipe da *SD Eventos*.

Preparamos a proposta para a sua celebração:

🎉 *Evento:* ${quote.eventType.toUpperCase()}
📅 *Data Prevista:* ${formattedDate} às ${quote.eventTime || '13:00'}
👥 *Convidados:* ${quote.guestCount} pessoas
🍽️ *Cardápio:* ${quote.service}
📍 *Local:* ${quote.neighborhood || quote.city}
${addonsText}💰 *Estimativa de Investimento:* R$ ${quote.estimatedPrice.toLocaleString('pt-BR')}

Incluso no pacote oficial da SD Eventos:
✅ Alimentação completa preparada no local
✅ Bebidas não alcoólicas inclusas
✅ Equipe profissional de atendimento
✅ Descartáveis completos fornecidos

Gostaria de confirmar a reserva da data ou tem alguma preferência sobre o cardápio?`;

  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
}

