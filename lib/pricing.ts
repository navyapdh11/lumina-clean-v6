interface PricingInput {
  serviceType: string;
  postcode: string;
  sqm?: number;
  bedrooms?: number;
}

const BASE_PRICES = {
  residential: { base: 99, perBedroom: 30, perSqm: 2.5 },
  commercial: { base: 150, perSqm: 0.65 },
  airbnb: { base: 120, perBedroom: 25 },
  'real-estate': { base: 180, perBedroom: 20 },
  strata: { base: 450, perLocation: 450 },
  ndis: { base: 135, perHour: 55 },
};

const METRO_LOADING = new Set(['2000', '2001', '3000', '3001', '4000', '4001', '6000', '6001']);

export const pricingEngine = {
  calculate(input: PricingInput): number {
    const base = BASE_PRICES[input.serviceType as keyof typeof BASE_PRICES];
    if (!base) return 199;

    let price = base.base;

    if (input.serviceType === 'residential' && input.bedrooms) {
      price += input.bedrooms * base.perBedroom;
    }
    if ((input.serviceType === 'commercial' || input.serviceType === 'residential') && input.sqm) {
      price += input.sqm * base.perSqm;
    }
    if (input.serviceType === 'airbnb' && input.bedrooms) {
      price += input.bedrooms * base.perBedroom;
    }
    if (input.serviceType === 'strata') {
      price = base.perLocation;
    }
    if (METRO_LOADING.has(input.postcode)) {
      price *= 1.15;
    }

    return Math.round(price);
  },
};
