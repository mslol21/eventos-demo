import { NextRequest, NextResponse } from 'next/server';
import { calculateEstimatedPrice } from '@/lib/pricing';
import { sanitizeText, validateQuoteForm } from '@/lib/validation';
import { QuoteRequest } from '@/types';
import { INITIAL_MOCK_QUOTES } from '@/data/mock-quotes';

// In-memory store for server runtime (prepared for Supabase database table 'quote_requests')
let serverQuotes: QuoteRequest[] = [...INITIAL_MOCK_QUOTES];

// Simple in-memory rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverQuotes,
    total: serverQuotes.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local-client';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Muitas solicitações enviadas. Aguarde um instante.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 1. Sanitize input strings
    const customerName = sanitizeText(body.customerName);
    const phone = sanitizeText(body.phone);
    const email = sanitizeText(body.email);
    const eventType = body.eventType || 'outro';
    const eventDate = sanitizeText(body.eventDate);
    const eventTime = sanitizeText(body.eventTime);
    const serviceId = sanitizeText(body.serviceId);
    const service = sanitizeText(body.service);
    const city = sanitizeText(body.city);
    const neighborhood = sanitizeText(body.neighborhood);
    const address = sanitizeText(body.address);
    const notes = sanitizeText(body.notes);
    const guestCount = Number(body.guestCount) || 50;
    const addons = Array.isArray(body.addons) ? body.addons : [];

    // 2. Validate input
    const validation = validateQuoteForm({
      customerName,
      phone,
      eventType,
      eventDate,
      serviceId,
      guestCount,
      city,
      neighborhood,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // 3. Server-side price recalculation (Never trust prices sent from the client!)
    const pricing = calculateEstimatedPrice(serviceId, guestCount, body.selectedAddonIds || []);
    const calculatedPrice = pricing.totalEstimatedPrice;

    // 4. Build QuoteRequest object
    const newQuote: QuoteRequest = {
      id: `ORC-${new Date().getFullYear()}-${String(serverQuotes.length + 85).padStart(3, '0')}`,
      customerName,
      phone,
      email: email || undefined,
      eventType,
      eventDate,
      eventTime: eventTime || '12:00',
      guestCount,
      service: service || pricing.breakdown.serviceName,
      serviceId,
      addons,
      city: city || 'São Paulo',
      neighborhood: neighborhood || '',
      address: address || '',
      notes: notes || undefined,
      estimatedPrice: calculatedPrice,
      status: 'novo',
      createdAt: new Date().toISOString(),
      internalNotes: 'Solicitação recebida via formulário web "Monte seu Evento".',
    };

    // 5. Store quote
    // NOTE FOR SUPABASE INTEGRATION:
    // Replace the line below with:
    // const { data, error } = await supabase.from('quote_requests').insert([newQuote]);
    serverQuotes = [newQuote, ...serverQuotes];

    return NextResponse.json({
      success: true,
      data: newQuote,
      message: 'Solicitação registrada com sucesso no sistema.',
    });
  } catch (error) {
    console.error('Error handling quote request POST:', error);
    return NextResponse.json(
      { success: false, error: 'Ocorreu um erro interno ao processar o orçamento.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do orçamento é obrigatório.' }, { status: 400 });
    }

    const index = serverQuotes.findIndex((q) => q.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Orçamento não encontrado.' }, { status: 404 });
    }

    serverQuotes[index] = {
      ...serverQuotes[index],
      status: status || serverQuotes[index].status,
      internalNotes: internalNotes !== undefined ? sanitizeText(internalNotes) : serverQuotes[index].internalNotes,
    };

    return NextResponse.json({
      success: true,
      data: serverQuotes[index],
    });
  } catch (error) {
    console.error('Error updating quote PATCH:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar orçamento.' },
      { status: 500 }
    );
  }
}
