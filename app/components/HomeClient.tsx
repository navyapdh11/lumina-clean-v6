'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Moon,
  Sun,
  Search,
  User,
  CheckCircle,
  Home,
  PlusCircle,
  MapPin,
  Clock,
  Shield,
  Leaf,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import BookingForm from './BookingForm';

const Map = dynamic(() => import('./Map'), { ssr: false });

const popularServices = [
  { id: 1, title: 'End of Lease', desc: 'Full bond back guarantee cleaning.' },
  { id: 2, title: 'Standard Home Cleaning', desc: 'Weekly or one-off deep cleans.' },
  { id: 3, title: 'Carpet Steam Cleaning', desc: 'Professional hot-water extraction.' },
  { id: 4, title: 'Office Deep Clean', desc: 'Commercial spaces & fit-outs.' },
  { id: 5, title: 'Mould Remediation', desc: 'Specialist mould removal & prevention.' },
];

export default function HomeClient() {
  const { isDark, toggle } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const filteredServices = useMemo(() => {
    return popularServices.filter((service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleSuccess = (message: string) => {
    setShowModal(false);
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-emerald-background/90 backdrop-blur border-b border-emerald-outline/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          <div className="text-2xl font-extrabold text-emerald-primary font-headline tracking-tight">
            EmeraldClean
          </div>
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <a href="#services" className="text-emerald-primary font-bold hover:underline">
              Find Service
            </a>
            <a href="#how-it-works" className="text-emerald-text-muted hover:text-emerald-secondary transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-emerald-text-muted hover:text-emerald-secondary transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="rounded-full p-2 hover:bg-emerald-surface-low transition-colors"
              type="button"
            >
              {isDark ? (
                <Moon className="h-5 w-5 text-emerald-text" />
              ) : (
                <Sun className="h-5 w-5 text-emerald-text" />
              )}
            </button>
            <button
              aria-label="Account"
              className="rounded-full p-2 hover:bg-emerald-surface-low transition-colors"
              type="button"
            >
              <User className="h-5 w-5 text-emerald-text" />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-gradient text-white px-5 py-2 rounded-full font-bold"
              type="button"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <section className="mb-16">
          <div className="max-w-3xl">
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl tracking-tight leading-tight text-emerald-text">
              Premium{' '}
              <span className="text-emerald-primary">Precision</span>
              <br />
              Cleaning for Australia.
            </h1>
            <p className="text-emerald-text-muted text-lg mt-6 max-w-xl">
              Select a service category to begin your booking. Eco-conscious,
              verified professionals.
            </p>
            <div className="relative max-w-2xl mt-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a specific service..."
                className="w-full pl-14 pr-4 py-5 bg-emerald-surface-high rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-secondary text-emerald-text placeholder:text-emerald-text-muted"
                aria-label="Search services"
              />
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-emerald-surface-low leaf-asymmetry min-h-[400px] rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                alt="Bright modern airy living room cleaned to perfection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-white font-headline text-3xl">Residential Cleaning</h3>
                <p className="text-white/90 mt-2">Homes, apartments, end-of-lease</p>
              </div>
            </div>

            {[
              ['Commercial', 'Offices, retail & strata'],
              ['Eco-Friendly', 'Plant-based, zero-waste products'],
              ['Specialist', 'Post-renovation, post-event'],
              ['Hazardous Bio Clean', 'Crime scenes, trauma & mould'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-emerald-surface-low rounded-3xl p-8 flex flex-col border border-emerald-outline/10">
                <h4 className="font-bold text-2xl mt-2 text-emerald-text">{title}</h4>
                <p className="text-emerald-text-muted mt-auto">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="mb-20 bg-emerald-surface-low rounded-3xl p-8 md:p-12">
          <div className="mb-12">
            <h2 className="font-headline font-bold text-3xl text-emerald-text">Popular Services</h2>
            <p className="text-emerald-text-muted">Quick-book our most requested packages</p>
          </div>

          {filteredServices.length === 0 ? (
            <p className="text-emerald-text-muted">No services match your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-left bg-emerald-surface p-6 rounded-3xl hover:shadow-xl border border-emerald-outline/10 transition-all hover:-translate-y-1"
                >
                  <h4 className="font-bold mb-2 text-emerald-text">{service.title}</h4>
                  <p className="text-sm text-emerald-text-muted">{service.desc}</p>
                  <span className="text-emerald-primary text-sm font-bold mt-6 block">Select →</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <h3 className="font-headline font-bold text-4xl tracking-tight text-emerald-text">
              Australia-Wide Coverage
            </h3>
            <p className="mt-6 text-emerald-text-muted">
              Verified experts in every major city and regional area.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-emerald-text">
                <MapPin className="h-5 w-5 text-emerald-primary shrink-0" />
                412 experts online right now
              </li>
              <li className="flex items-center gap-3 text-emerald-text">
                <Shield className="h-5 w-5 text-emerald-primary shrink-0" />
                100% satisfaction guarantee
              </li>
              <li className="flex items-center gap-3 text-emerald-text">
                <Leaf className="h-5 w-5 text-emerald-primary shrink-0" />
                Eco-certified products
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7 h-[420px] bg-emerald-surface-high rounded-3xl overflow-hidden relative shadow-2xl border border-emerald-outline/20">
            <Map />
            <div className="absolute top-8 right-8 glass-overlay leaf-asymmetry p-6 max-w-[260px] z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-secondary rounded-full animate-pulse" />
                <span className="uppercase text-xs font-bold tracking-widest text-emerald-secondary">
                  LIVE
                </span>
              </div>
              <p className="font-headline font-bold text-2xl text-emerald-text">412 Available Experts</p>
              <p className="text-xs text-emerald-text-muted mt-4">Last sync: moments ago</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mt-24 mb-20">
          <h2 className="font-headline font-bold text-3xl mb-8 text-emerald-text">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['1. Choose a service', 'Pick the right cleaning package for your home or business.'],
              ['2. Select a time', 'Choose a convenient booking slot in seconds.'],
              ['3. Get it cleaned', 'A verified professional arrives ready to deliver.'],
            ].map(([title, desc], i) => (
              <div key={title} className="bg-emerald-surface-low rounded-3xl p-8 border border-emerald-outline/10">
                <div className="w-12 h-12 rounded-full btn-gradient flex items-center justify-center text-white font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-xl mb-3 text-emerald-text">{title}</h3>
                <p className="text-emerald-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mb-20">
          <h2 className="font-headline font-bold text-3xl mb-8 text-emerald-text">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['Standard', 'From $99', 'Ideal for regular home cleaning.'],
              ['Deep Clean', 'From $199', 'Perfect for seasonal or one-off intensive cleans.'],
              ['Specialist', 'Custom Quote', 'For mould, hazardous, commercial, or restoration work.'],
            ].map(([title, price, desc]) => (
              <div key={title} className="bg-emerald-surface rounded-3xl p-8 border border-emerald-outline/10 shadow-sm">
                <h3 className="font-bold text-2xl text-emerald-text">{title}</h3>
                <p className="text-emerald-primary text-2xl font-extrabold mt-4">{price}</p>
                <p className="text-emerald-text-muted mt-4">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-surface-low rounded-3xl p-8 md:p-12 border border-emerald-outline/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-headline font-bold text-3xl text-emerald-text">Ready to get started?</h2>
            <p className="text-emerald-text-muted mt-4">
              Book your first clean in under 60 seconds.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-8 btn-gradient text-white px-10 py-4 rounded-full font-bold text-lg"
              type="button"
            >
              Book Your Cleaning
            </button>
          </div>
        </section>
      </main>

      <BookingForm
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={handleSuccess}
      />

      {toast && (
        <div
          className="fixed bottom-6 right-6 btn-gradient text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[10000] animate-slide-up"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      <footer className="bg-emerald-surface-low border-t mt-20 py-12 px-6 md:px-8 text-sm text-emerald-text-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-emerald-primary font-bold text-xl">EmeraldClean</div>
            <p className="mt-4">Premium eco-conscious cleaning across Australia.</p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-text mb-3">Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-emerald-primary transition-colors">Residential</a></li>
              <li><a href="#services" className="hover:text-emerald-primary transition-colors">Commercial</a></li>
              <li><a href="#services" className="hover:text-emerald-primary transition-colors">Specialist</a></li>
              <li><a href="#services" className="hover:text-emerald-primary transition-colors">Hazardous</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-text mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-emerald-primary transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-emerald-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-emerald-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-primary transition-colors">Careers</a></li>
            </ul>
          </div>
          <div className="md:text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <Clock className="h-4 w-4 text-emerald-primary" />
              <span>Mon–Sat 7am–7pm AEST</span>
            </div>
            <p>© 2026 EmeraldClean Pty Ltd.</p>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-emerald-surface/90 backdrop-blur-xl border-t border-emerald-outline/20 z-50 flex justify-around py-3 text-xs" aria-label="Mobile navigation">
        <a href="/" className="flex flex-col items-center text-emerald-primary">
          <Home className="h-5 w-5 mb-1" />
          Home
        </a>
        <a href="#services" className="flex flex-col items-center text-emerald-text-muted hover:text-emerald-primary transition-colors">
          <Search className="h-5 w-5 mb-1" />
          Services
        </a>
        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center -mt-6"
          aria-label="Open booking"
          type="button"
        >
          <PlusCircle className="h-10 w-10 text-emerald-primary" />
        </button>
        <a href="#how-it-works" className="flex flex-col items-center text-emerald-text-muted hover:text-emerald-primary transition-colors">
          <Clock className="h-5 w-5 mb-1" />
          Info
        </a>
        <button className="flex flex-col items-center text-emerald-text-muted hover:text-emerald-primary transition-colors" aria-label="Account" type="button">
          <User className="h-5 w-5 mb-1" />
          Account
        </button>
      </nav>
    </>
  );
}
