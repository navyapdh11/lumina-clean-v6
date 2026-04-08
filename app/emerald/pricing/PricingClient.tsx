'use client';

import { useState } from 'react';
import { CheckCircle, MinusCircle, Sparkles, ShieldCheck, Leaf, Clock, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { BookingButton } from '../../components/BookingButton';
import { ToggleSwitch } from '../../components/ToggleSwitch';

const faqs = [
  {
    q: 'What if I\'m not satisfied with the clean?',
    a: 'We offer a 100% satisfaction guarantee. If you\'re not happy, we return and re-clean at no extra charge.',
  },
  {
    q: 'Are your products eco-certified?',
    a: 'Yes. All our standard products are independently certified eco-friendly, non-toxic, and safe for children and pets.',
  },
  {
    q: 'Do I need to provide equipment?',
    a: 'No. Our professionals bring all equipment, supplies, and eco-certified cleaning products.',
  },
  {
    q: 'How do I change or cancel a booking?',
    a: 'You can change or cancel up to 24 hours before your scheduled clean through your account dashboard or by calling us.',
  },
  {
    q: 'Are your cleaners background-checked?',
    a: 'Every EmeraldClean professional is verified, insured, and has passed a national police check. We vet all cleaners before they can accept jobs.',
  },
  {
    q: 'Do you offer same-day bookings?',
    a: 'Yes, in metro areas we often have same-day availability. Book before 12pm for the best chance of same-day service.',
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${index}`;
  return (
    <div className="border-b border-emerald-outline/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span className="font-semibold text-emerald-text text-sm group-hover:text-emerald-primary transition-colors">
          {q}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-emerald-primary shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-emerald-text-muted shrink-0 group-hover:text-emerald-primary transition-colors" />
        )}
      </button>
      <p
        id={answerId}
        className={`pb-5 text-emerald-text-muted text-sm leading-relaxed transition-all ${open ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}
      >
        {a}
      </p>
    </div>
  );
}

export default function PricingClient() {
  const [annual, setAnnual] = useState(false);

  const pricingTiers = [
    {
      id: 'standard',
      name: 'Standard',
      monthlyPrice: 99,
      description: 'Ideal for regular home cleaning. Weekly or fortnightly.',
      features: [
        'Up to 3 bedrooms',
        'Kitchen and bathroom clean',
        'Floor vacuum and mop',
        'Surface dusting',
        'Linen change',
        '1 cleaner',
      ],
      notIncluded: ['Deep oven clean', 'Carpet steam cleaning', 'Window interiors'],
      cta: 'Book Standard Clean',
      highlight: false,
      badge: null,
    },
    {
      id: 'deep',
      name: 'Deep Clean',
      monthlyPrice: 199,
      description: 'Perfect for seasonal refreshes, moving days, or one-off intensive cleans.',
      features: [
        'Unlimited bedrooms',
        'Full kitchen deep clean',
        'All bathrooms sanitised',
        'Inside oven and fridge',
        'Skirting boards and doors',
        '2 cleaners',
      ],
      notIncluded: ['Carpet steam cleaning', 'Window interiors'],
      cta: 'Book Deep Clean',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      id: 'specialist',
      name: 'Specialist',
      monthlyPrice: null,
      description: 'For mould remediation, hazardous bio clean, commercial, or restoration work.',
      features: [
        'Fully customised scope',
        'Certified technicians',
        'Specialist equipment',
        'Compliance documentation',
        'OHS and EPA compliant',
        'Dedicated account manager',
      ],
      notIncluded: ['Standard cleaning tasks'],
      cta: 'Request a Quote',
      highlight: false,
      badge: null,
    },
  ];

  const addOns = [
    { name: 'Carpet Steam Cleaning', price: annual ? '$119' : '$149', desc: 'Hot-water extraction for up to 3 rooms' },
    { name: 'Window Interiors', price: annual ? '$71' : '$89', desc: 'All accessible interior windows' },
    { name: 'Inside Fridge/Oven', price: annual ? '$55' : '$69', desc: 'Degreasing of one appliance' },
    { name: 'Laundry Clean', price: annual ? '$39' : '$49', desc: 'Full laundry including dryer vent' },
    { name: 'Garage Sweep', price: annual ? '$47' : '$59', desc: 'Pressure wash and sweep of garage floor' },
    { name: 'Extra Hour', price: annual ? '$36' : '$45', desc: 'Add 1 hour of cleaning time' },
  ];

  return (
    <div className="min-h-screen bg-emerald-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-slow absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-200/10 dark:bg-emerald-900/20" />
        <div className="blob blob-fast absolute bottom-0 left-0 w-80 h-80 bg-teal-200/10 dark:bg-teal-900/15" />
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-primary mb-4 uppercase tracking-widest">
            <Star className="h-4 w-4" /> Pricing
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-emerald-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-emerald-text-muted text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            No hidden fees. No call-out charges. Book online in 60 seconds and lock in your price before the cleaner arrives.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 mt-8 glass rounded-full px-6 py-2.5">
            <span className={`text-sm font-semibold transition-colors ${!annual ? 'text-emerald-primary' : 'text-emerald-text-muted'}`}>
              Weekly / One-off
            </span>
            <ToggleSwitch
              checked={annual}
              onChange={setAnnual}
              label="Annual billing"
              size="sm"
            />
            <div className={`flex items-center gap-1.5 transition-colors ${annual ? 'text-emerald-primary' : 'text-emerald-text-muted'}`}>
              <span className="text-sm font-semibold">Annual</span>
              {annual && (
                <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-emerald-text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-primary" /> Free re-clean guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> No lock-in contracts
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-primary" /> Cancel anytime
            </span>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`card-glass p-8 flex flex-col relative overflow-hidden ${tier.highlight ? 'ring-2 ring-emerald-primary/30' : ''}`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-bl-[100px]" />
              )}

              {tier.badge && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-b-full shadow-lg">
                  {tier.badge}
                </span>
              )}

              <div className="pt-2">
                <h2 className="font-headline font-bold text-2xl text-emerald-text">{tier.name}</h2>
                <div className="mt-3 flex items-baseline gap-2">
                  {tier.monthlyPrice ? (
                    <>
                      <span className="text-4xl font-extrabold gradient-text">
                        ${annual ? Math.round(tier.monthlyPrice * 0.8) : tier.monthlyPrice}
                      </span>
                      <span className="text-emerald-text-muted text-sm">
                        /{annual ? 'mo (billed annually)' : 'visit'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold gradient-text">Custom</span>
                      <span className="text-emerald-text-muted text-sm">/project</span>
                    </>
                  )}
                </div>
                <p className="text-emerald-text-muted text-sm mt-2">{tier.description}</p>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-emerald-text">
                    <CheckCircle className="h-4 w-4 text-emerald-primary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {tier.notIncluded.map((excluded) => (
                  <li key={excluded} className="flex items-start gap-2.5 text-sm text-emerald-text-muted/60">
                    <MinusCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {excluded}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <BookingButton
                  label={tier.cta}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    tier.highlight
                      ? 'btn-gradient text-white shadow-lg'
                      : 'glass border border-emerald-outline/30 text-emerald-primary hover:border-emerald-primary'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-headline font-bold text-2xl text-emerald-text">Optional Add-Ons</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              Save 20% with annual
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="glass rounded-2xl p-5 flex items-center justify-between gap-4 hover-lift"
              >
                <div>
                  <h3 className="font-semibold text-emerald-text text-sm">{addon.name}</h3>
                  <p className="text-emerald-text-muted text-xs mt-1">{addon.desc}</p>
                </div>
                <span className="text-emerald-primary font-extrabold text-lg shrink-0">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="glass rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-headline font-bold text-2xl text-emerald-text">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-emerald-outline/10 flex flex-col sm:flex-row items-center gap-4">
            <p className="text-emerald-text-muted text-sm flex-1">
              Still have questions? Our team is here to help.
            </p>
            <a
              href="tel:1300586462"
              className="btn-gradient text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              Call 1800 CLEAN
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
