'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useSiteData } from '@/lib/useSiteData';

export function TopPromotionBanner() {
  const pathname = usePathname();
  const { activeGlobalPromotion } = useSiteData();
  const [dismissedId, setDismissedId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('sd_dismissed_banner_id');
      } catch {
        return null;
      }
    }
    return null;
  });

  const isDismissed = Boolean(
    activeGlobalPromotion && dismissedId === activeGlobalPromotion.id
  );

  // Don't show on admin routes or if dismissed or if no active promotion
  if (pathname.startsWith('/admin') || !activeGlobalPromotion || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    if (activeGlobalPromotion) {
      try {
        sessionStorage.setItem('sd_dismissed_banner_id', activeGlobalPromotion.id);
      } catch {
        // Ignore storage exceptions
      }
      setDismissedId(activeGlobalPromotion.id);
    }
  };

  return (
    <aside
      aria-label="Campanha Promocional"
      className="bg-[#C8521A] text-white py-2 px-4 sm:px-6 relative z-50 text-xs transition-all duration-300 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2.5 text-center min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {activeGlobalPromotion.badge || 'Promoção'}
          </span>

          <p className="truncate font-medium text-white/95 text-xs sm:text-[13px]">
            {activeGlobalPromotion.bannerText}
          </p>

          {activeGlobalPromotion.bannerLink && (
            <Link
              href={activeGlobalPromotion.bannerLink}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-amber-200 transition-colors shrink-0 font-semibold ml-1"
            >
              <span>{activeGlobalPromotion.bannerCtaText || 'Aproveitar'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          aria-label="Fechar aviso promocional"
          className="text-white/80 hover:text-white p-1 rounded-md hover:bg-black/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
