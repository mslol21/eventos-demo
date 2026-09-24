import { INITIAL_MOCK_QUOTES } from '@/data/mock-quotes';
import { QuoteRequest, QuoteStatus } from '@/types';

const STORAGE_KEY = 'sd_eventos_quote_requests';

export function getLocalQuotes(): QuoteRequest[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_QUOTES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_QUOTES));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving local quote:', error);
    return [newQuote, ...INITIAL_MOCK_QUOTES];
  }
}

export function updateLocalQuoteStatus(quoteId: string, status: QuoteStatus, internalNotes?: string): QuoteRequest[] {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating local quote status:', error);
    return INITIAL_MOCK_QUOTES;
  }
}
