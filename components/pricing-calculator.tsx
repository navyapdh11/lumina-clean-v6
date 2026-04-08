'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { pricingEngine } from '@/lib/pricing';

export function PricingCalculator() {
  const [serviceType, setServiceType] = useState<string>('residential');
  const [sqm, setSqm] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('1');
  const [frequency, setFrequency] = useState<string>('once');
  const [postcode, setPostcode] = useState<string>('');
  const [calculated, setCalculated] = useState(false);

  // Use the SHARED pricing engine — consistent with server
  const calculatePrice = (): number => {
    return pricingEngine.calculate({
      serviceType,
      postcode: postcode || '2000',
      sqm: sqm ? parseFloat(sqm) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      frequency: frequency as 'once' | 'weekly' | 'fortnightly' | 'monthly',
    });
  };

  const handleCalculate = () => {
    setCalculated(true);
  };

  const price = calculatePrice();

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
              {(serviceType === 'residential' || serviceType === 'airbnb') && (
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
              )}

              {serviceType === 'commercial' && (
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Area (sqm)</label>
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
              )}

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Postcode</label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="2000"
                  maxLength={4}
                />
              </div>

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
                <p className="text-gray-400 mb-6">{pricingEngine.getDescription(serviceType)}</p>
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
                    href="tel:1300737842"
                    className="bg-white/10 backdrop-blur-xl px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    📞 1300-PERTHCLEAN
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
