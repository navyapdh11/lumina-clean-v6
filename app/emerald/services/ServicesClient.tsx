
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Reveal } from '../../components/Reveal';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, MapPin, ChevronRight, Sparkles, ShieldCheck, Leaf } from 'lucide-react';
import { BookingButton } from '../../components/BookingButton';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });



export default function ServicesClient() {
  const [activeFilter, setActiveFilter] = useState('all');

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
      category: 'residential',
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
      category: 'residential',
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
      category: 'specialist',
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
      category: 'commercial',
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
      category: 'specialist',
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
      category: 'specialist',
    },
  ];

  const filtered = activeFilter === 'all'
    ? services
    : services.filter((s) => s.category === activeFilter);

  return (
    <div className="min-h-screen bg-emerald-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-fast absolute -top-20 right-0 w-96 h-96 bg-emerald-300/15 dark:bg-emerald-900/25" />
        <div className="blob blob-slow absolute bottom-1/3 -left-40 w-[500px] h-[500px] bg-teal-200/10 dark:bg-teal-900/15" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-emerald-outline/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          <Link href="/emerald" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text font-headline tracking-tight">
              EmeraldClean
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <Link href="/emerald/services" className="text-emerald-primary font-bold">
              Services
            </Link>
            <Link href="/emerald/pricing" className="text-emerald-text-muted hover:text-emerald-primary font-medium transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-emerald-text">
            Our Services
          </h1>
          <p className="text-emerald-text-muted text-lg mt-4 max-w-2xl leading-relaxed">
            From a quick home tidy to a full forensic bio clean — we have a verified, insured professional for every job.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[
              { key: 'all', label: 'All Services' },
              { key: 'residential', label: 'Residential' },
              { key: 'commercial', label: 'Commercial' },
              { key: 'specialist', label: 'Specialist' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === f.key
                    ? 'btn-gradient text-white shadow-md'
                    : 'glass text-emerald-text hover:border-emerald-primary/40 border border-emerald-outline/20'
                }`}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filtered.map((service, i) => (
            <Reveal key={service.id} delay={i * 80}>
              <div className="card-glass overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Popular badge */}
                {service.popular && (
                  <span className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                {/* Price badge */}
                <div className="absolute bottom-4 right-4 glass rounded-xl px-3 py-1.5">
                  <span className="text-emerald-text font-bold text-sm">{service.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-headline font-bold text-xl text-emerald-text">{service.title}</h2>
                <p className="text-emerald-text-muted text-sm mt-2 flex-1 leading-relaxed">{service.description}</p>

                {/* Features */}
                <ul className="mt-4 space-y-2">
                  {service.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-emerald-text-muted">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6 pt-4 border-t border-emerald-outline/10">
                  <BookingButton
                    label={`Book ${service.title.split(' ')[0]} ${service.title.split(' ')[1] || ''}`}
                    className="w-full btn-gradient text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  />
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

        {/* Coverage Section */}
        <section className="glass rounded-3xl p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-primary mb-4">
                <MapPin className="h-4 w-4" />
                Australia-Wide
              </div>
              <h2 className="font-headline font-bold text-3xl text-emerald-text">Every City. Every Suburb.</h2>
              <p className="text-emerald-text-muted mt-4 leading-relaxed">
                We cover every major city, town, and regional area. Same-day bookings available in metro zones.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin'].map((city) => (
                  <span key={city} className="glass rounded-full px-4 py-1.5 text-sm font-medium text-emerald-text">
                    {city}
                  </span>
                ))}
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-8 text-sm text-emerald-text-muted">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-primary" /> Fully Insured
                </span>
                <span className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-primary" /> Eco Certified
                </span>
              </div>
            </div>

            {/* Live coverage map */}
            <div className="lg:col-span-7 h-80 rounded-2xl overflow-hidden border border-emerald-outline/10 shadow-md">
              <Map />
            </div>
          </div>
        </section>
      </main>

      <footer className="glass border-t border-emerald-outline/20 py-8 px-6 md:px-8 text-sm text-emerald-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <span>© 2026 EmeraldClean Pty Ltd.</span>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-6">
              <li><Link href="/emerald" className="hover:text-emerald-primary transition-colors">Home</Link></li>
              <li><Link href="/emerald/pricing" className="hover:text-emerald-primary transition-colors">Pricing</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

