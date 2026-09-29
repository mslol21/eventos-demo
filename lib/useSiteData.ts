'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getLocalServices,
  updateLocalService,
  resetServicesToDefault,
  getLocalCompanyConfig,
  saveLocalCompanyConfig,
  resetCompanyConfigToDefault,
  getLocalAddons,
  updateLocalAddon,
  resetAddonsToDefault,
  getLocalPromotions,
  updateLocalPromotion,
  createLocalPromotion,
  deleteLocalPromotion,
  resetPromotionsToDefault,
  getLocalQuotes,
  updateLocalQuoteStatus,
  deleteLocalQuote,
  createManualQuote,
} from './storage';
import {
  ServiceOption,
  CompanyConfig,
  AddonOption,
  CampaignPromotion,
  QuoteRequest,
  QuoteStatus,
  ManualQuoteInput,
} from '@/types';

export function useSiteData() {
  const [services, setServices] = useState<ServiceOption[]>(() => getLocalServices());
  const [company, setCompany] = useState<CompanyConfig>(() => getLocalCompanyConfig());
  const [addons, setAddons] = useState<AddonOption[]>(() => getLocalAddons());
  const [promotions, setPromotions] = useState<CampaignPromotion[]>(() => getLocalPromotions());
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => getLocalQuotes());

  // Function to refresh state from localStorage
  const refreshAll = useCallback(() => {
    setServices(getLocalServices());
    setCompany(getLocalCompanyConfig());
    setAddons(getLocalAddons());
    setPromotions(getLocalPromotions());
    setQuotes(getLocalQuotes());
  }, []);

  // Listen to cross-component and cross-window events
  useEffect(() => {
    const handleUpdate = () => {
      refreshAll();
    };

    window.addEventListener('sd_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('sd_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshAll]);

  // Action wrappers
  const handleUpdateService = (updated: ServiceOption) => {
    const list = updateLocalService(updated);
    setServices(list);
    return list;
  };

  const handleResetServices = () => {
    const list = resetServicesToDefault();
    setServices(list);
    return list;
  };

  const handleUpdateCompany = (config: CompanyConfig) => {
    const saved = saveLocalCompanyConfig(config);
    setCompany(saved);
    return saved;
  };

  const handleResetCompany = () => {
    const res = resetCompanyConfigToDefault();
    setCompany(res);
    return res;
  };

  const handleUpdateAddon = (updated: AddonOption) => {
    const list = updateLocalAddon(updated);
    setAddons(list);
    return list;
  };

  const handleResetAddons = () => {
    const list = resetAddonsToDefault();
    setAddons(list);
    return list;
  };

  const handleUpdatePromotion = (updated: CampaignPromotion) => {
    const list = updateLocalPromotion(updated);
    setPromotions(list);
    return list;
  };

  const handleCreatePromotion = (promo: Omit<CampaignPromotion, 'id' | 'createdAt'>) => {
    const list = createLocalPromotion(promo);
    setPromotions(list);
    return list;
  };

  const handleDeletePromotion = (id: string) => {
    const list = deleteLocalPromotion(id);
    setPromotions(list);
    return list;
  };

  const handleResetPromotions = () => {
    const list = resetPromotionsToDefault();
    setPromotions(list);
    return list;
  };

  const handleUpdateQuoteStatus = (id: string, status: QuoteStatus, internalNotes?: string) => {
    const list = updateLocalQuoteStatus(id, status, internalNotes);
    setQuotes(list);
    return list;
  };

  const handleDeleteQuote = (id: string) => {
    const list = deleteLocalQuote(id);
    setQuotes(list);
    return list;
  };

  const handleCreateManualQuote = (input: ManualQuoteInput) => {
    const created = createManualQuote(input);
    setQuotes(getLocalQuotes());
    return created;
  };

  // Find active global banner campaign if any
  const activeGlobalPromotion = promotions.find(
    (p) => p.active && p.showGlobalBanner && p.bannerText
  );

  return {
    services,
    company,
    addons,
    promotions,
    quotes,
    activeGlobalPromotion,
    refreshAll,
    updateService: handleUpdateService,
    resetServices: handleResetServices,
    updateCompany: handleUpdateCompany,
    resetCompany: handleResetCompany,
    updateAddon: handleUpdateAddon,
    resetAddons: handleResetAddons,
    updatePromotion: handleUpdatePromotion,
    createPromotion: handleCreatePromotion,
    deletePromotion: handleDeletePromotion,
    resetPromotions: handleResetPromotions,
    updateQuoteStatus: handleUpdateQuoteStatus,
    deleteQuote: handleDeleteQuote,
    createManualQuote: handleCreateManualQuote,
  };
}
