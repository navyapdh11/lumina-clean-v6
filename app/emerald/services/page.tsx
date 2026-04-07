import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookingButton } from '../../components/BookingButton';
import MapWrapper from './MapWrapper';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore EmeraldClean\'s full range of eco-conscious cleaning services — residential, commercial, specialist, and hazardous bio clean.',
};

const services = [
  {
    id: 'end-of-lease',
    title: 'End of Lease Cleaning',
    price: 'From $199',
    description:
      'Comprehensive bond-back cleaning for tenants and landlords. We guarantee your property passes the final inspection or we return for free.',
    features: [
      'Full bond-back guarantee',
      'All rooms deep cleaned',
      'Oven and kitchen degreasing',
      'Window cleaning (interior)',
      'Carpet steam cleaning available',
    ],
    popular: true,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  },
  {
    id: 'standard-home',
    title: 'Standard Home Cleaning',
    price: 'From $99',
    description:
      'Regular or one-off home cleaning with flexible scheduling. Our verified professionals leave every room spotless.',
    features: [
      'Weekly or fortnightly options',
      'Dusting and surface wiping',
      'Kitchen and bathroom sanitising',
      'Floor vacuuming and mopping',
      'Bed making and linen change',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
  },
  {
    id: 'carpet',
    title: 'Carpet Steam Cleaning',
    price: 'From $149',
    description:
      'Professional hot-water extraction that removes stains, allergens, and deep-seated dirt from all carpet types.',
    features: [
      'Hot-water extraction method',
      'Stain and odour removal',
      'Allergen elimination',
      'Quick dry technology',
      'Fabric protection optional',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    id: 'office',
    title: 'Office & Commercial',
    price: 'Custom Quote',
    description:
      'Tailored commercial cleaning for offices, retail spaces, and strata buildings. After-hours service available.',
    features: [
      'After-hours scheduling',
      'Strata and body corporate',
      'Retail and hospitality',
      'COVID-safe sanitisation',
      'Supply and equipment included',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    id: 'mould',
    title: 'Mould Remediation',
    price: 'Custom Quote',
    description:
      'Specialist mould identification, removal, and prevention treatment using eco-certified anti-microbial solutions.',
    features: [
      'Mould identification survey',
      'Professional removal treatment',
      'Anti-microbial coating',
      'Ventilation assessment',
      'Health and safety compliant',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
  },
  {
    id: 'hazardous',
    title: 'Hazardous Bio Clean',
    price: 'Custom Quote',
    description:
      'Trauma scene, biohazard, and crime scene cleaning by certified technicians. Discrete, compassionate, and compliant.',
    features: [
      'Trauma and crime scenes',
      'Biohazardous material removal',
      'Crime scene clean-up',
      'Hoarding decontamination',
      'OHS and EPA compliant',
    ],
    popular: false,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  },
];

export default function ServicesPage() {
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
            <Link href="/emerald/services" className="text-emerald-primary font-bold hover:underline">
              Services
            </Link>
            <Link href="/emerald/pricing" className="text-emerald-text-muted hover:text-emerald-secondary transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-emerald-text">
            Our Services
          </h1>
          <p className="text-emerald-text-muted text-lg mt-4 max-w-2xl">
            From a quick home tidy to a full forensic bio clean — we have a verified, insured professional for every job.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-emerald-surface rounded-3xl overflow-hidden border border-emerald-outline/10 flex flex-col"
            >
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                {service.popular && (
                  <span className="absolute top-4 left-4 bg-emerald-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-headline font-bold text-xl text-emerald-text">{service.title}</h2>
                <p className="text-emerald-primary font-extrabold text-lg mt-1">{service.price}</p>
                <p className="text-emerald-text-muted text-sm mt-3 flex-1">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-emerald-text-muted">
                      <span className="text-emerald-secondary mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <ServiceBookingButton className="mt-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Coverage Section */}
        <section className="bg-emerald-surface-low rounded-3xl p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="font-headline font-bold text-3xl text-emerald-text">Australia-Wide Service</h2>
              <p className="text-emerald-text-muted mt-4">
                We cover every major city, town, and regional area. Same-day bookings available in metro zones.
              </p>
              <ul className="mt-6 space-y-3">
                {['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin'].map((city) => (
                  <li key={city} className="text-emerald-text flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-primary" />
                    {city}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7 h-80 rounded-2xl overflow-hidden border border-emerald-outline/20">
              <MapWrapper />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-emerald-surface-low border-t py-8 px-6 md:px-8 text-sm text-emerald-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <span>© 2026 EmeraldClean Pty Ltd.</span>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-6">
              <li><Link href="/emerald" className="hover:text-emerald-primary">Home</Link></li>
              <li><Link href="/emerald/pricing" className="hover:text-emerald-primary">Pricing</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ServiceBookingButton({ className }: { className?: string }) {
  return <BookingButton className={className} />;
}
