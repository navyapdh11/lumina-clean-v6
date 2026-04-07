// Shared pricing engine — used by BOTH server (tRPC) and client (calculator)
// This ensures consistent pricing across the entire application

export interface PricingInput {
  serviceType: string;
  postcode: string;
  sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  frequency?: 'once' | 'weekly' | 'fortnightly' | 'monthly';
}

const BASE_PRICES = {
  residential: { base: 99, perBedroom: 30, perBathroom: 35, perSqm: 0 },
  commercial: { base: 150, perBedroom: 0, perBathroom: 0, perSqm: 0.65 },
  airbnb: { base: 120, perBedroom: 25, perBathroom: 0, perSqm: 0 },
  'real-estate': { base: 180, perBedroom: 20, perBathroom: 0, perSqm: 0 },
  realestate: { base: 180, perBedroom: 20, perBathroom: 0, perSqm: 0 },
  strata: { base: 450, perBedroom: 0, perBathroom: 0, perSqm: 0 },
  ndis: { base: 135, perBedroom: 0, perBathroom: 0, perSqm: 0 },
};

const METRO_POSTCODES = new Set(['2000', '2001', '3000', '3001', '4000', '4001', '6000', '6001']);

const FREQUENCY_DISCOUNTS: Record<string, number> = {
  once: 0,
  weekly: 0.20,
  fortnightly: 0.15,
  monthly: 0.10,
};

export const pricingEngine = {
  calculate(input: PricingInput): number {
    const base = BASE_PRICES[input.serviceType as keyof typeof BASE_PRICES];
    if (!base) return 199; // Default fallback

    let price = base.base;

    if (base.perBedroom && input.bedrooms) {
      price += input.bedrooms * base.perBedroom;
    }
    if (base.perBathroom && input.bathrooms) {
      price += input.bathrooms * base.perBathroom;
    }
    if (base.perSqm && input.sqm) {
      price += input.sqm * base.perSqm;
    }

    // Metro loading surcharge (15%)
    if (METRO_POSTCODES.has(input.postcode)) {
      price *= 1.15;
    }

    // Frequency discount
    const frequency = input.frequency || 'once';
    const discount = FREQUENCY_DISCOUNTS[frequency] || 0;
    if (discount > 0) {
      price *= (1 - discount);
    }

    return Math.round(price);
  },

  /**
   * Get human-readable price description
   */
  getDescription(serviceType: string): string {
    const descriptions: Record<string, string> = {
      residential: 'Standard home cleaning (all floors, dusting, kitchen, bathrooms)',
      commercial: 'Office/commercial cleaning at $0.65/sqm',
      airbnb: 'Airbnb turnover cleaning (linen change, full clean, restock)',
      'real-estate': 'Pre-sale presentation clean (deep clean + exterior)',
      realestate: 'Pre-sale presentation clean (deep clean + exterior)',
      strata: 'Per location strata cleaning (foyer, common areas, facilities)',
      ndis: 'NDIS home support cleaning (customized to your plan)',
    };
    return descriptions[serviceType] || 'Custom cleaning service';
  },

  /**
   * Check if a postcode is in a metro area (surcharge applies)
   */
  isMetroPostcode(postcode: string): boolean {
    return METRO_POSTCODES.has(postcode);
  },
};
