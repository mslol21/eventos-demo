import { ADDONS_DATA } from '@/data/addons';
import { SERVICES_DATA } from '@/data/services';
import { ServiceOption, AddonOption } from '@/types';

export interface PricingCalculationResult {
  serviceBasePrice: number;
  addonsTotal: number;
  totalEstimatedPrice: number;
  installments10x: number;
  breakdown: {
    serviceName: string;
    guestCount: number;
    serviceUnitCost: number;
    serviceSubtotal: number;
    addonsList: Array<{
      name: string;
      cost: number;
      calculation: string;
    }>;
  };
  disclaimer: string;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateEstimatedPrice(
  serviceId: string,
  guestCount: number,
  selectedAddonIds: string[],
  customServices?: ServiceOption[],
  customAddons?: AddonOption[]
): PricingCalculationResult {
  const servicesList = customServices && customServices.length > 0 ? customServices : SERVICES_DATA;
  const addonsList = customAddons && customAddons.length > 0 ? customAddons : ADDONS_DATA;

  const service = servicesList.find((s) => s.id === serviceId) || servicesList[0];
  const safeGuests = Math.max(guestCount || 30, 20);

  // Derive standard base for 50 people and per person rate from ServiceOption
  const standard50Base =
    service.basePriceCash ||
    (service.basePriceInstallments ? service.basePriceInstallments * (service.installmentCount || 10) : 3500);
  const perPersonBase = Math.round(standard50Base / 50);

  // Calculate service subtotal
  let serviceSubtotal: number;
  if (safeGuests <= 50) {
    // For <= 50, use the promo package pricing structure or proportional with minimum package base
    // If fewer than 50 (e.g. 30), minimum package base is 80% of standard 50
    if (safeGuests < 35) {
      serviceSubtotal = Math.round(standard50Base * 0.85);
    } else {
      serviceSubtotal = standard50Base;
    }
  } else {
    // Over 50 people: base 50 + extra per person
    const extraGuests = safeGuests - 50;
    serviceSubtotal = standard50Base + extraGuests * perPersonBase;
  }

  // Calculate addons
  const addonsBreakdown: Array<{ name: string; cost: number; calculation: string }> = [];
  let addonsTotal = 0;

  for (const addonId of selectedAddonIds) {
    const addon = addonsList.find((a) => a.id === addonId);
    if (!addon) continue;

    let addonCost = 0;
    let calculationText = '';

    if (addon.pricePerPerson) {
      addonCost = addon.pricePerPerson * safeGuests;
      calculationText = `${formatBRL(addon.pricePerPerson)} × ${safeGuests} convidados`;
    } else if (addon.fixedPrice) {
      addonCost = addon.fixedPrice;
      calculationText = 'Valor fixo';
    }

    addonsTotal += addonCost;
    addonsBreakdown.push({
      name: addon.name,
      cost: addonCost,
      calculation: calculationText,
    });
  }

  const totalEstimatedPrice = serviceSubtotal + addonsTotal;
  const installments10x = Math.ceil(totalEstimatedPrice / 10);

  return {
    serviceBasePrice: serviceSubtotal,
    addonsTotal,
    totalEstimatedPrice,
    installments10x,
    breakdown: {
      serviceName: service.name,
      guestCount: safeGuests,
      serviceUnitCost: perPersonBase,
      serviceSubtotal,
      addonsList: addonsBreakdown,
    },
    disclaimer:
      'Valores demonstrativos sujeitos à confirmação. Este valor é apenas uma estimativa inicial. O orçamento final será confirmado e detalhado pela equipe SD Eventos.',
  };
}
