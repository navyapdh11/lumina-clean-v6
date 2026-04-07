'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Reveal } from './Reveal';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Search,
  User,
  CheckCircle,
  Home,
  PlusCircle,
  MapPin,
  Clock,
  Shield,
  Leaf,
  Sparkles,
  Star,
  ChevronRight,
  Zap,
  Award,
  Phone,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import BookingForm from './BookingForm';
import { ToggleSwitch } from './ToggleSwitch';

const Map = dynamic(() => import('./Map'), { ssr: false });

const popularServices = [
  { id: 1, title: 'End of Lease', desc: 'Full bond back guarantee cleaning.', icon: '🔑', badge: 'Most Booked' },
  { id: 2, title: 'Standard Home', desc: 'Weekly or one-off deep cleans.', icon: '🏠', badge: null },
  { id: 3, title: 'Carpet Steam', desc: 'Professional hot-water extraction.', icon: '🧹', badge: null },
  { id: 4, title: 'Office Deep Clean', desc: 'Commercial spaces & fit-outs.', icon: '🏢', badge: null },
  { id: 5, title: 'Mould Remediation', desc: 'Specialist mould removal & prevention.', icon: '🛡️', badge: null },
  { id: 6, title: 'Hazardous Bio', desc: 'Trauma, crime scene & bio clean.', icon: '⚕️', badge: 'Certified' },
];

const stats = [
  { value: 2847, label: 'Homes Cleaned', suffix: '+', icon: Home },
  { value: 98, label: 'Satisfaction Rate', suffix: '%', icon: Star },
  { value: 412, label: 'Active Experts', suffix: '', icon: Zap },
  { value: 8, label: 'AUS Cities', suffix: '+', icon: MapPin },
];

/** Animated counter that counts up when it enters the viewport */
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.round(current));
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="counter">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HomeClient() {
  const { isDark, toggle } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const [compactView, setCompactView] = useState(false);

  const filteredServices = useMemo(() => {
    return popularServices.filter((service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleSuccess = (message: string) => {
    setShowModal(false);
    setToast(message);
    setTimeout(() => setToast(''), 4500);
  };

  return (
    <>
      {/* ── AMBIENT FLOATING BLOBS (decorative background) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-fast absolute -top-32 -right-32 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-900/30" />
        <div className="blob blob-slow absolute top-1/3 -left-40 w-[500px] h-[500px] bg-teal-200/15 dark:bg-teal-900/20" />
        <div className="blob blob absolute bottom-20 right-1/4 w-72 h-72 bg-cyan-200/10 dark:bg-cyan-900/20" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 glass border-b border-emerald-outline/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text font-headline tracking-tight">
              EmeraldClean
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <a href="#services" className="text-emerald-text hover:text-emerald-primary font-medium transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-emerald-text-muted hover:text-emerald-primary font-medium transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-emerald-text-muted hover:text-emerald-primary font-medium transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={isDark}
              onChange={toggle}
              label="Toggle dark mode"
              size="sm"
            />

            <button
              aria-label="Account"
              className="rounded-full p-2 hover:bg-emerald-surface-low transition-colors"
              type="button"
            >
              <User className="h-5 w-5 text-emerald-text" />
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="btn-gradient btn-glow text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5"
              type="button"
            >
              Book Now
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">

        {/* ── HERO SECTION ── */}
        <section className="mb-20 relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-text font-medium">412 experts online now</span>
            </div>

            {/* Gradient headline */}
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl tracking-tight leading-[1.05]">
              <span className="gradient-text">Premium Precision</span>
              <br />
              <span className="text-emerald-text">Cleaning for</span>
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 gradient-text">Australia.</span>
                {/* Underline decoration */}
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 bg-emerald-300/40 dark:bg-emerald-700/40 -z-0 rounded-sm"
                  style={{ transform: 'scaleX(0.85)', transformOrigin: 'left' }}
                />
              </span>
            </h1>

            <p className="text-emerald-text-muted text-lg mt-8 max-w-lg leading-relaxed">
              Eco-certified professionals, bonded & insured. Same-day bookings in metro areas. 100% satisfaction or we come back free.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-emerald-text-muted">
              {[
                { icon: Shield, text: 'Fully Insured' },
                { icon: Leaf, text: 'Eco Certified' },
                { icon: Award, text: 'Verified Pros' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-emerald-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-2xl mt-10">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a specific service..."
                className="w-full pl-14 pr-4 py-5 glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-primary/40 text-emerald-text placeholder:text-emerald-text-muted shadow-md text-base"
                aria-label="Search services"
              />
            </div>
          </div>

          {/* Floating stats panel */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="card-glass p-5 text-center">
                  <stat.icon className="h-5 w-5 text-emerald-primary mx-auto mb-2" />
                  <div className="font-headline font-extrabold text-2xl gradient-text">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-emerald-text-muted text-xs mt-1">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SERVICE CATEGORY GRID ── */}
        <section className="mb-20">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-headline font-bold text-3xl text-emerald-text">Browse by Category</h2>
                <p className="text-emerald-text-muted mt-2">Select the type of clean your space needs</p>
              </div>
              {/* View toggle */}
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-emerald-text-muted">Grid</span>
                <ToggleSwitch
                  checked={compactView}
                  onChange={setCompactView}
                  label="Compact view"
                  size="sm"
                />
                <span className="text-sm text-emerald-text-muted">Compact</span>
              </div>
            </div>
          </Reveal>

          <div className={`grid gap-5 ${compactView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'}`}>
            {/* Hero card — spans 2 columns/rows (or full width in compact mode) */}
            <Reveal delay={100} className={`group relative overflow-hidden rounded-3xl card-glass ${compactView ? 'col-span-2 min-h-[160px]' : 'md:col-span-2 md:row-span-2 min-h-[440px]'}`}>
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                alt="Bright modern living room cleaned to perfection"
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-700 ${compactView ? 'object-left' : ''}`}
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Badge */}
              <span className="absolute top-5 left-5 bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className={`text-white font-headline font-bold ${compactView ? 'text-base' : 'text-3xl'}`}>Residential Cleaning</h3>
                {!compactView && (
                  <p className="text-white/90 mt-2 text-sm">Homes, apartments, end-of-lease & move-in</p>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className={`mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/30 transition-all ${compactView ? 'py-2 px-4 mt-2' : ''}`}
                  type="button"
                >
                  Book Now <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </Reveal>

            {/* Category cards */}
            {[
              { title: 'Commercial', desc: 'Offices, retail & strata', color: 'from-blue-500/80 to-cyan-600/80' },
              { title: 'Eco-Friendly', desc: 'Plant-based, zero-waste', color: 'from-emerald-500/80 to-teal-600/80' },
              { title: 'Specialist', desc: 'Post-renovation, events', color: 'from-amber-500/80 to-orange-600/80' },
              { title: 'Hazardous Bio', desc: 'Trauma, crime, mould', color: 'from-red-500/80 to-rose-600/80' },
            ].map((cat, i) => (
              <Reveal key={cat.title} delay={(i + 2) * 80} className={`relative overflow-hidden rounded-3xl group cursor-pointer ${compactView ? 'min-h-[120px]' : 'min-h-[200px]'}`}>
                {/* Color gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className={`text-white font-headline font-bold ${compactView ? 'text-sm' : 'text-xl'}`}>{cat.title}</h4>
                  {!compactView && <p className="text-white/80 text-sm mt-1">{cat.desc}</p>}
                  <div className={`mt-3 group-hover:translate-x-1 transition-transform ${compactView ? 'hidden' : ''}`}>
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── POPULAR SERVICES ── */}
        <section id="services" className="mb-20">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-headline font-bold text-3xl text-emerald-text">Popular Services</h2>
                <p className="text-emerald-text-muted mt-2">Quick-book our most requested packages</p>
              </div>
            </div>
          </Reveal>

          {filteredServices.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <Search className="h-10 w-10 text-emerald-text-muted mx-auto mb-4" />
              <p className="text-emerald-text-muted">No services match &ldquo;{searchTerm}&rdquo;</p>
            </div>
          ) : (
            <div className={`grid gap-5 ${compactView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredServices.map((service, i) => (
                <Reveal key={service.id} delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className={`card-glass text-left p-6 group w-full ${compactView ? 'py-4 px-4' : ''}`}
                  >
                    {/* Badge */}
                    {service.badge && (
                      <span className="inline-block mb-3 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        {service.badge}
                      </span>
                    )}
                    <div className="text-2xl mb-3">{service.icon}</div>
                    <h4 className={`font-bold text-emerald-text ${compactView ? 'text-sm' : 'text-lg'}`}>
                      {service.title}
                    </h4>
                    <p className={`text-emerald-text-muted mt-1 ${compactView ? 'text-xs' : 'text-sm'}`}>
                      {service.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-emerald-primary text-sm font-bold mt-4 group-hover:gap-2 transition-all">
                      Select <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* ── MAP + COVERAGE ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          <Reveal className="lg:col-span-5">
            <h3 className="font-headline font-bold text-4xl tracking-tight text-emerald-text">
              Australia-Wide Coverage
            </h3>
            <p className="mt-5 text-emerald-text-muted leading-relaxed">
              Verified experts in every major city and regional area. Same-day bookings available in metro zones.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: MapPin, text: '412 experts online right now', highlight: true },
                { icon: Shield, text: '100% satisfaction guarantee', highlight: false },
                { icon: Leaf, text: 'Eco-certified products only', highlight: false },
                { icon: Clock, text: 'Mon–Sat 7am–9pm AEST', highlight: false },
                { icon: Phone, text: 'Emergency bookings available', highlight: false },
              ].map(({ icon: Icon, text, highlight }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${highlight ? 'btn-gradient' : 'glass'}`}>
                    <Icon className={`h-4 w-4 ${highlight ? 'text-white' : 'text-emerald-primary'}`} />
                  </div>
                  <span className="text-emerald-text text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-7">
            <div className="glass rounded-3xl overflow-hidden relative shadow-xl border border-emerald-outline/10 h-[420px]">
              <Map />
              {/* Live badge */}
              <div className="absolute top-6 left-6 glass rounded-2xl p-4 z-10 max-w-[240px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="uppercase text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                    Live
                  </span>
                </div>
                <p className="font-headline font-bold text-xl text-emerald-text">412 Available Experts</p>
                <p className="text-emerald-text-muted text-xs mt-2">Last sync: moments ago</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 w-full btn-gradient text-white text-sm font-bold py-2.5 rounded-xl"
                  type="button"
                >
                  Book Near Me
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="mb-20">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-primary mb-4 uppercase tracking-widest">
                <Zap className="h-4 w-4" /> Simple Process
              </span>
              <h2 className="font-headline font-bold text-3xl text-emerald-text">How It Works</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Choose a Service',
                desc: 'Pick from our 6 specialist cleaning categories or describe your unique needs.',
                color: 'from-emerald-400 to-teal-500',
              },
              {
                step: '02',
                title: 'Book in 60 Seconds',
                desc: 'Select your date, time, and any add-ons. Lock in your price instantly.',
                color: 'from-teal-400 to-cyan-500',
              },
              {
                step: '03',
                title: 'Get It Done',
                desc: 'A verified professional arrives with all equipment. You inspect, then pay.',
                color: 'from-cyan-400 to-blue-500',
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 120}>
                <div className="card-glass p-8 relative overflow-hidden">
                  {/* Step number bg */}
                  <div
                    className={`absolute top-0 right-0 text-[120px] font-extrabold leading-none bg-gradient-to-br ${item.color} opacity-10 select-none -translate-y-8 translate-x-4`}
                  >
                    {item.step}
                  </div>
                  {/* Icon circle */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-white font-headline font-bold text-lg">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-xl text-emerald-text mb-3">{item.title}</h3>
                  <p className="text-emerald-text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="mb-20">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-primary mb-4 uppercase tracking-widest">
                <Award className="h-4 w-4" /> Pricing
              </span>
              <h2 className="font-headline font-bold text-3xl text-emerald-text">Transparent, Simple Pricing</h2>
              <p className="text-emerald-text-muted mt-3">No hidden fees. No call-out charges.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Standard',
                price: '$99',
                note: 'per visit',
                desc: 'Regular home cleaning',
                features: ['Up to 3 bedrooms', 'Kitchen & bathroom', 'Vacuum & mop', 'Surface dusting'],
                highlight: false,
              },
              {
                name: 'Deep Clean',
                price: '$199',
                note: 'per visit',
                desc: 'Seasonal refreshes',
                features: ['Unlimited bedrooms', 'Full kitchen deep clean', 'Inside oven & fridge', 'Skirting boards', '2 cleaners'],
                highlight: true,
              },
              {
                name: 'Specialist',
                price: 'Custom',
                note: 'per project',
                desc: 'Mould, bio, commercial',
                features: ['Fully customised', 'Certified technicians', 'Specialist equipment', 'Compliance docs'],
                highlight: false,
              },
            ].map((tier, i) => (
              <Reveal key={tier.name} delay={i * 100}>
                <div className={`card-glass p-8 flex flex-col ${tier.highlight ? 'ring-2 ring-emerald-primary/40 relative' : ''}`}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-headline font-bold text-xl text-emerald-text">{tier.name}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-extrabold gradient-text">{tier.price}</span>
                    <span className="text-emerald-text-muted text-sm ml-2">{tier.note}</span>
                  </div>
                  <p className="text-emerald-text-muted text-sm mt-2">{tier.desc}</p>

                  <ul className="mt-6 space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-emerald-text">
                        <CheckCircle className="h-4 w-4 text-emerald-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowModal(true)}
                    className={`mt-8 w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      tier.highlight
                        ? 'btn-gradient text-white shadow-lg'
                        : 'glass border border-emerald-outline/30 text-emerald-primary hover:border-emerald-primary hover:bg-emerald-surface-low'
                    }`}
                    type="button"
                  >
                    Book {tier.name}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <Reveal>
          <section className="relative overflow-hidden rounded-3xl mb-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700" />
            {/* Blob decoration */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/20 blob" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-300/20 blob-slow" />
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />

            <div className="relative px-10 py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-white">
                  Ready for a cleaner space?
                </h2>
                <p className="text-emerald-100 mt-3 max-w-md">
                  Book your first clean in under 60 seconds. No lock-in contracts. Cancel anytime.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-base"
                  type="button"
                >
                  Book Your Cleaning
                </button>
                <a
                  href="tel:+61180012345"
                  className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl glass border border-white/20 hover:bg-white/10 transition-all text-base"
                >
                  <Phone className="h-4 w-4" />
                  1800 CLEAN
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* ── FOOTER ── */}
      <footer className="glass border-t border-emerald-outline/20 py-12 px-6 md:px-8 text-sm text-emerald-text-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-emerald-primary">EmeraldClean</span>
            </div>
            <p className="leading-relaxed">Premium eco-conscious cleaning across Australia. Verified, insured, guaranteed.</p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-text mb-3">Services</h4>
            <ul className="space-y-2">
              {['Residential', 'Commercial', 'Specialist', 'Hazardous'].map((s) => (
                <li key={s}>
                  <a href="#services" className="hover:text-emerald-primary transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-text mb-3">Company</h4>
            <ul className="space-y-2">
              {['How it Works', 'Pricing', 'Contact', 'Careers'].map((s) => (
                <li key={s}>
                  <a href="#" className="hover:text-emerald-primary transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <Clock className="h-4 w-4 text-emerald-primary" />
              <span>Mon–Sat 7am–9pm AEST</span>
            </div>
            <p>© 2026 EmeraldClean Pty Ltd.</p>
          </div>
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-emerald-outline/20 z-50 flex justify-around py-3 text-xs" aria-label="Mobile navigation">
        <a href="/" className="flex flex-col items-center text-emerald-primary gap-1">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </a>
        <a href="#services" className="flex flex-col items-center text-emerald-text-muted hover:text-emerald-primary transition-colors gap-1">
          <Search className="h-5 w-5" />
          <span>Services</span>
        </a>
        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center -mt-6"
          aria-label="Open booking"
          type="button"
        >
          <div className="w-12 h-12 rounded-full btn-gradient flex items-center justify-center shadow-lg">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
        </button>
        <a href="#how-it-works" className="flex flex-col items-center text-emerald-text-muted hover:text-emerald-primary transition-colors gap-1">
          <Clock className="h-5 w-5" />
          <span>Info</span>
        </a>
        <button className="flex flex-col items-center text-emerald-text-muted hover:text-emerald-primary transition-colors gap-1" aria-label="Account" type="button">
          <User className="h-5 w-5" />
          <span>Account</span>
        </button>
      </nav>

      {/* ── BOOKING MODAL ── */}
      <BookingForm open={showModal} onOpenChange={setShowModal} onSuccess={handleSuccess} />

      {/* ── TOAST ── */}
      {toast && (
        <div
          className="fixed bottom-20 md:bottom-6 right-6 glass-heavy rounded-2xl px-6 py-4 flex items-center gap-3 z-[10000] shadow-2xl border border-emerald-primary/20"
          role="status"
          aria-live="polite"
        >
          <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center shrink-0">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-emerald-text text-sm pr-2">{toast}</span>
        </div>
      )}
    </>
  );
}
