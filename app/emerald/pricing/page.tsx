import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingButton } from '../../components/BookingButton';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent, competitive pricing for all EmeraldClean services. No hidden fees. Book online in 60 seconds.',
};

const pricingTiers = [
  {
    id: 'standard',
    name: 'Standard',
    price: 'From $99',
    priceNote: 'Per visit',
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
  },
  {
    id: 'deep',
    name: 'Deep Clean',
    price: 'From $199',
    priceNote: 'Per visit',
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
  },
  {
    id: 'specialist',
    name: 'Specialist',
    price: 'Custom Quote',
    priceNote: 'Per project',
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
  },
];

const addOns = [
  { name: 'Carpet Steam Cleaning', price: '+$149', desc: 'Hot-water extraction for up to 3 rooms' },
  { name: 'Window Interiors', price: '+$89', desc: 'All accessible interior windows' },
  { name: 'Inside Fridge/Oven', price: '+$69', desc: 'Degreasing of one appliance' },
  { name: 'Laundry Clean', price: '+$49', desc: 'Full laundry including dryer vent' },
  { name: 'Garage Sweep', price: '+$59', desc: 'Pressure wash and sweep of garage floor' },
  { name: 'Extra Hour (add-on)', price: '+$45/hr', desc: 'Add 1 hour of cleaning time' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-emerald-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-background/90 backdrop-blur border-b border-emerald-outline/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          <Link
            href="/emerald"
            className="text-2xl font-extrabold text-emerald-primary font-headline tracking-tight"
          >
            EmeraldClean
          </Link>
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <Link href="/emerald/services" className="text-emerald-text-muted hover:text-emerald-secondary transition-colors">
              Services
            </Link>
            <Link href="/emerald/pricing" className="text-emerald-primary font-bold hover:underline">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-emerald-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-emerald-text-muted text-lg mt-4 max-w-xl mx-auto">
            No hidden fees. No call-out charges. Book online in 60 seconds and lock in your price before the cleaner arrives.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-emerald-text-muted">
            <span className="flex items-center gap-2">
              <span className="text-emerald-secondary">✓</span> Free re-clean guarantee
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-secondary">✓</span> No lock-in contracts
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-secondary">✓</span> Cancel anytime
            </span>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 flex flex-col ${
                tier.highlight
                  ? 'bg-emerald-surface border-2 border-emerald-primary shadow-xl'
                  : 'bg-emerald-surface-low border border-emerald-outline/10'
              }`}
            >
              {tier.highlight && (
                <span className="bg-emerald-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h2 className="font-headline font-bold text-2xl text-emerald-text">{tier.name}</h2>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-emerald-primary">{tier.price}</span>
                <span className="text-emerald-text-muted text-sm ml-2">{tier.priceNote}</span>
              </div>
              <p className="text-emerald-text-muted text-sm mt-3">{tier.description}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-emerald-text">
                    <span className="text-emerald-secondary mt-0.5 shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <ul className="mt-4 space-y-1">
                {tier.notIncluded.map((excluded) => (
                  <li key={excluded} className="flex items-start gap-2 text-sm text-emerald-text-muted">
                    <span className="text-emerald-text-muted mt-0.5 shrink-0">—</span>
                    {excluded}
                  </li>
                ))}
              </ul>

              <BookingButton
                label={tier.cta}
                className={`mt-8 ${
                  tier.highlight
                    ? ''
                    : 'bg-emerald-surface border border-emerald-primary text-emerald-primary hover:bg-emerald-surface-low transition-colors'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <section className="mb-16">
          <h2 className="font-headline font-bold text-2xl text-emerald-text mb-8">Optional Add-Ons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="bg-emerald-surface rounded-2xl p-5 border border-emerald-outline/10 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-emerald-text">{addon.name}</h3>
                  <p className="text-emerald-text-muted text-sm mt-1">{addon.desc}</p>
                </div>
                <span className="text-emerald-primary font-extrabold shrink-0 ml-4">{addon.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-emerald-surface-low rounded-3xl p-8 md:p-12">
          <h2 className="font-headline font-bold text-2xl text-emerald-text mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
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
            ].map(({ q, a }) => (
              <div key={q} className="bg-emerald-surface rounded-2xl p-6 border border-emerald-outline/10">
                <h3 className="font-bold text-emerald-text">{q}</h3>
                <p className="text-emerald-text-muted text-sm mt-2">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-emerald-surface-low border-t py-8 px-6 md:px-8 text-sm text-emerald-text-muted mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <span>© 2026 EmeraldClean Pty Ltd.</span>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-6">
              <li><Link href="/emerald" className="hover:text-emerald-primary">Home</Link></li>
              <li><Link href="/emerald/services" className="hover:text-emerald-primary">Services</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
