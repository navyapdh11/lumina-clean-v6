'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function PricingCalculator() {
  const [serviceType, setServiceType] = useState<string>('residential');
  const [sqm, setSqm] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('1');
  const [frequency, setFrequency] = useState<string>('once');
  const [calculated, setCalculated] = useState(false);

  const calculatePrice = () => {
    let basePrice = 0;

    switch (serviceType) {
      case 'residential':
        basePrice = 99;
        const bedPrice = parseInt(bedrooms) * 25;
        const bathPrice = parseInt(bathrooms) * 35;
        basePrice += bedPrice + bathPrice;
        break;
      case 'commercial':
        const area = parseInt(sqm) || 0;
        basePrice = area * 0.65;
        break;
      case 'strata':
        basePrice = 450;
        break;
      case 'airbnb':
        basePrice = 149;
        const bedCount = parseInt(bedrooms) || 1;
        basePrice += (bedCount - 1) * 30;
        break;
      case 'realestate':
        basePrice = 299;
        break;
      case 'ndis':
        basePrice = 120;
        break;
    }

    // Apply frequency discount
    if (frequency === 'weekly') {
      basePrice *= 0.8; // 20% discount
    } else if (frequency === 'fortnightly') {
      basePrice *= 0.85; // 15% discount
    } else if (frequency === 'monthly') {
      basePrice *= 0.9; // 10% discount
    }

    return Math.round(basePrice);
  };

  const handleCalculate = () => {
    setCalculated(true);
  };

  const price = calculatePrice();

  const getServiceDescription = () => {
    switch (serviceType) {
      case 'residential':
        return 'Standard home cleaning (all floors vacuumed & mopped, dusting, kitchen, bathrooms)';
      case 'commercial':
        return `Office/commercial cleaning at $0.65/sqm`;
      case 'strata':
        return 'Per location strata cleaning (foyer, common areas, facilities)';
      case 'airbnb':
        return 'Airbnb turnover cleaning (linen change, full clean, restock)';
      case 'realestate':
        return 'Pre-sale presentation clean (deep clean + exterior)';
      case 'ndis':
        return 'NDIS home support cleaning (customized to your plan)';
      default:
        return '';
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-purple-950/50 via-black to-cyan-950/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full mb-6">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <span className="text-gray-300 font-medium">Instant Pricing</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Cleaning Cost Calculator
          </h2>
          <p className="text-xl text-gray-400">Get an instant quote in seconds</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Service Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'residential', label: '🏡 Residential' },
                  { value: 'commercial', label: '🏢 Commercial' },
                  { value: 'strata', label: '🏗️ Strata' },
                  { value: 'airbnb', label: '🔑 Airbnb' },
                  { value: 'realestate', label: '🏘️ Real Estate' },
                  { value: 'ndis', label: '♿ NDIS' },
                ].map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => {
                      setServiceType(service.value);
                      setCalculated(false);
                    }}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                      serviceType === service.value
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-black/30 border-white/20 text-gray-400 hover:border-white/40'
                    }`}
                  >
                    {service.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {serviceType === 'residential' || serviceType === 'airbnb' ? (
                <>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => {
                        setBedrooms(e.target.value);
                        setCalculated(false);
                      }}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Bedroom' : 'Bedrooms'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Bathrooms</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => {
                        setBathrooms(e.target.value);
                        setCalculated(false);
                      }}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Bathroom' : 'Bathrooms'}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : serviceType === 'commercial' ? (
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Area (sqm) *</label>
                  <input
                    type="number"
                    value={sqm}
                    onChange={(e) => {
                      setSqm(e.target.value);
                      setCalculated(false);
                    }}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="500"
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Frequency</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'once', label: 'One-time' },
                    { value: 'weekly', label: 'Weekly (-20%)' },
                    { value: 'fortnightly', label: 'Fortnightly (-15%)' },
                    { value: 'monthly', label: 'Monthly (-10%)' },
                  ].map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => {
                        setFrequency(freq.value);
                        setCalculated(false);
                      }}
                      className={`px-4 py-3 rounded-xl border transition-all text-sm ${
                        frequency === freq.value
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                          : 'bg-black/30 border-white/20 text-gray-400 hover:border-white/40'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-xl text-lg font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 mb-8"
          >
            Calculate Price <ArrowRight className="w-5 h-5" />
          </button>

          {calculated && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 rounded-2xl p-8"
            >
              <div className="text-center">
                <p className="text-gray-300 mb-2">Estimated Price</p>
                <p className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
                  ${price}
                  {frequency !== 'once' && <span className="text-2xl text-gray-400">/clean</span>}
                </p>
                <p className="text-gray-400 mb-6">{getServiceDescription()}</p>
                {frequency !== 'once' && (
                  <p className="text-sm text-cyan-400 mb-6">
                    {frequency === 'weekly' && 'Weekly cleaning with 20% discount applied'}
                    {frequency === 'fortnightly' && 'Fortnightly cleaning with 15% discount applied'}
                    {frequency === 'monthly' && 'Monthly cleaning with 10% discount applied'}
                  </p>
                )}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link
                    href="/book"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:1300586462"
                    className="bg-white/10 backdrop-blur-xl px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    📞 1300-LUMINA
                  </a>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 grid md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No lock-in contract</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>100% satisfaction guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Fully insured</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
